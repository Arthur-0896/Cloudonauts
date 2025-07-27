from flask import Blueprint, request, jsonify
from app.models import User, Product, Order, OrderProduct
from app import db
from app.auth.token_verify import verify_token
import traceback
import boto3 # Import boto3 for AWS SDK
import os    # For environment variables

order_bp = Blueprint('order_bp', __name__)

# Initialize AWS Lambda client
# It's good practice to get the region from environment variables
# For local development, you might hardcode it or configure AWS CLI credentials
lambda_client = boto3.client(
    'lambda',
    region_name=os.environ.get('AWS_REGION', 'us-east-1'), # Replace 'us-east-1' with your desired region
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),      # Ensure these are set in your environment
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY') # For production, use IAM roles with instance profiles
)

# Replace with the actual name of your Lambda function
# This should match the name you gave it in the AWS Lambda console (e.g., OrderConfirmationEmailSender)
LAMBDA_FUNCTION_NAME = os.environ.get('LAMBDA_ORDER_CONFIRMATION_NAME', 'OrderConfirmationEmailSender')

# Route to get all products ordered by a user (no change here)
@order_bp.route('/user-orders/<user_sub>', methods=['GET'])
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
                    })
            orders_list.append(order_dict)
        return jsonify(orders_list)
    except Exception as e:
        traceback.print_exc() # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500

@order_bp.route('/place-order', methods=['POST'])
def place_order():
    try:
        data = request.json
        user_sub = data.get('user_sub')
        product_ids = data.get('products', [])

        if not user_sub or not product_ids:
            return jsonify({"error": "Missing required parameters"}), 400

        # Get user by sub
        user = User.query.filter_by(sub=user_sub).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Create new order
        new_order = Order(Useruid=user.uid)
        db.session.add(new_order)
        db.session.flush()  # This gets us the new order ID before commit

        # Prepare product details for the email (optional, but good for detailed emails)
        ordered_products_details = []

        # Add all products to the order
        for pid in product_ids:
            product = Product.query.get(pid)
            if not product:
                db.session.rollback()
                return jsonify({"error": f"Product with ID {pid} not found"}), 404
            
            if product.inventory <= 0:
                db.session.rollback()
                return jsonify({"error": f"Product {product.productName} is out of stock"}), 400

            order_product = OrderProduct(oid=new_order.oid, pid=pid)
            db.session.add(order_product)
            product.inventory -= 1

            ordered_products_details.append({
                'pid': product.pid,
                'productName': product.productName,
                'price': str(product.price), # Convert Decimal to string for JSON
                'thumbLink': product.thumbLink
            })

        # Commit the transaction to save order and product updates
        db.session.commit()

        # --- IMPORTANT: Trigger the Lambda function AFTER successful commit ---
        try:
            # Construct the payload for the Lambda function
            lambda_payload = {
                'orderId': new_order.oid,
                'customerEmail': user.email, # Assuming your User model has an 'email' field
                'customerName': user.username, # Assuming your User model has a 'username' field
                'products': ordered_products_details # Include product details
            }
            
            # Invoke the Lambda function asynchronously (InvocationType='Event')
            # 'Event' means Lambda processes it in the background, without waiting for a response.
            # This is ideal for tasks like sending emails where your API doesn't need to wait.
            response = lambda_client.invoke(
                FunctionName=LAMBDA_FUNCTION_NAME,
                InvocationType='Event', # 'RequestResponse' for synchronous, 'Event' for asynchronous
                Payload=json.dumps(lambda_payload)
            )
            
            print(f"Lambda invocation response: {response}")
            # Check for errors in the invocation response (though for 'Event' type, it's mostly about validation)
            if response.get('StatusCode') != 202: # 202 Accepted for 'Event' invocation
                print(f"Warning: Lambda invocation might have failed. Status Code: {response.get('StatusCode')}")
                # You might log this error to a monitoring system
            
        except Exception as lambda_err:
            print(f"Error invoking Lambda function {LAMBDA_FUNCTION_NAME}: {lambda_err}")
            traceback.print_exc()
            # Decide if you want to fail the order if email fails.
            # For confirmation emails, usually, we don't, as the order is already placed.
            # You might log this error and have a retry mechanism.


        # Your API response to the frontend
        return jsonify({
            "message": "Order placed successfully. Confirmation email is being sent.",
            "order_id": new_order.oid
        }), 201

    except Exception as e:
        db.session.rollback()
        traceback.print_exc() # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500