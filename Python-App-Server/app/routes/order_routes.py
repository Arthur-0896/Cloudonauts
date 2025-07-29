from flask import Blueprint, request, jsonify
from app.models import User, Product, Order, OrderProduct
from app import db
from app.auth.token_verify import verify_token # Assuming this is for user authentication/authorization
import traceback
import boto3 # Import boto3 for AWS SDK
import os    # For environment variables
import json  # For serializing message body to JSON
# from collections import Counter # No longer needed if only buying 1 at a time

order_bp = Blueprint('order_bp', __name__)

# --- Configuration for AWS SQS ---
SQS_QUEUE_NAME = os.environ.get('SQS_ORDER_CONFIRMATION_QUEUE_NAME', 'order-confirmation-queue')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

# Initialize SQS client
sqs_kwargs = {
    'service_name': 'sqs',
    'region_name': AWS_REGION
}

# Only add credentials if they are present in environment variables
if os.environ.get('AWS_ACCESS_KEY_ID') and os.environ.get('AWS_SECRET_ACCESS_KEY'):
    sqs_kwargs.update({
        'aws_access_key_id': os.environ.get('AWS_ACCESS_KEY_ID'),
        'aws_secret_access_key': os.environ.get('AWS_SECRET_ACCESS_KEY')
    })

sqs_client = boto3.client(**sqs_kwargs)

# --- Helper function to get SQS Queue URL ---
def get_sqs_queue_url(queue_name):
    try:
        response = sqs_client.get_queue_url(QueueName=queue_name)
        return response['QueueUrl']
    except Exception as e:
        print(f"Error getting SQS queue URL for '{queue_name}': {e}")
        raise

SQS_QUEUE_URL = get_sqs_queue_url(SQS_QUEUE_NAME)


# Route to get all products ordered by a user (UNCHANGED AS REQUESTED)
# This function will list each product individually, which is accurate if only 1 unit can be purchased at a time.
@order_bp.route('/user-orders/<user_sub>', methods=['GET'])
# You might want to add @verify_token here if this is a protected route
def get_user_orders(user_sub):
    try:
        user = User.query.filter_by(sub=user_sub).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        orders_list = []
        for order in user.orders:
            order_dict = {
                'order_id': order.oid,
                'products': []
            }
            order_products = OrderProduct.query.filter_by(oid=order.oid).all()
            for op in order_products:
                product = Product.query.filter_by(pid=op.pid).first()
                if product:
                    order_dict['products'].append({
                        'pid': product.pid,
                        'category': product.category,
                        'gender': product.gender,
                        'productName': product.productName,
                        'size': product.size,
                        'price': str(product.price),
                        'thumbLink': product.thumbLink
                        # Quantity is implicitly 1 per entry, as per the purchase rule.
                    })
            orders_list.append(order_dict)
        return jsonify(orders_list)
    except Exception as e:
        traceback.print_exc() # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500


@order_bp.route('/place-order', methods=['POST'])
# You might want to add @verify_token here if this is a protected route
def place_order():
    try:
        data = request.json
        user_sub = data.get('user_sub')
        # Expecting a list of unique product IDs, as only 1 of each can be bought at a time.
        product_ids_to_buy = data.get('products', []) 

        if not user_sub or not product_ids_to_buy:
            return jsonify({"error": "Missing required parameters (user_sub or products)"}), 400

        if not isinstance(product_ids_to_buy, list):
            return jsonify({"error": "'products' must be a list of product IDs"}), 400
        
        user = User.query.filter_by(sub=user_sub).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        total_order_amount = 0 
        order_products_to_add = [] 
        
        # Iterate through each unique product ID to be purchased
        for pid in product_ids_to_buy:
            if not isinstance(pid, int):
                db.session.rollback()
                return jsonify({"error": f"Invalid product ID in list: {pid}. Expected integer."}), 400

            product = Product.query.get(pid)
            if not product:
                db.session.rollback()
                return jsonify({"error": f"Product with ID {pid} not found"}), 404

            # Since only 1 unit can be bought at a time, check if inventory is at least 1
            if product.inventory < 1:
                db.session.rollback()
                return jsonify({"error": f"Product {product.productName} (ID: {pid}) is out of stock."}), 400
            
            # Decrease inventory by 1 for this product
            product.inventory -= 1
            total_order_amount += product.price # Add price of one unit

            # Create ONE OrderProduct entry for this product ID
            order_products_to_add.append(OrderProduct(pid=pid)) 

        # Create new order
        # Removed order_total and email_sent from constructor - as per previous request.
        # This assumes these DB columns are nullable or have defaults.
        new_order = Order(Useruid=user.uid) 
        db.session.add(new_order)
        db.session.flush() # This gets us the new order ID (new_order.oid) before commit

        # Link order_products to the new order and add to session
        for op in order_products_to_add:
            op.oid = new_order.oid
            db.session.add(op)

        # Commit the transaction to save order, order_products, and product inventory updates
        db.session.commit()

        # --- Send order ID to SQS AFTER successful database commit ---
        try:
            # The SQS message body should ideally be minimal, just the order_id.
            # The Lambda will then fetch all necessary details from the DB.
            sqs_message_body = json.dumps({"order_id": new_order.oid}) 

            send_response = sqs_client.send_message(
                QueueUrl=SQS_QUEUE_URL,
                MessageBody=sqs_message_body,
            )
            print(f"Order ID {new_order.oid} sent to SQS. Message ID: {send_response['MessageId']}")

        except Exception as sqs_err:
            print(f"Error sending order ID {new_order.oid} to SQS: {sqs_err}")
            traceback.print_exc()
            # Log this error; the order itself is placed, email might be delayed.

        # Your API response to the frontend
        return jsonify({
            "message": "Order placed successfully. Confirmation email processing initiated.",
            "order_id": new_order.oid
            # Removed "total_amount" from the response as per previous request.
        }), 201

    except Exception as e:
        db.session.rollback() # Rollback any changes if an error occurs
        traceback.print_exc() # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500