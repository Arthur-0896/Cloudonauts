from flask import Blueprint, request, jsonify
from app.models import User, Product, Order, OrderProduct
from app import db
from app.auth.token_verify import verify_token # Assuming this is for user authentication/authorization
import traceback
import boto3 # Import boto3 for AWS SDK
import os    # For environment variables
import json  # For serializing message body to JSON

order_bp = Blueprint('order_bp', __name__)

# --- Configuration for AWS SQS ---
# It's good practice to get the region and queue name from environment variables.
# For local development, ensure these are set in your environment or use a .env file.
# For production on AWS (e.g., EC2, ECS), use IAM roles/instance profiles for credentials.
SQS_QUEUE_NAME = os.environ.get('SQS_ORDER_CONFIRMATION_QUEUE_NAME', 'order-confirmation-queue')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1') # Ensure this matches your SQS queue's region

# Initialize SQS client
sqs_client = boto3.client(
    'sqs',
    region_name=AWS_REGION,
    # For local development, ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set
    # in your environment. For production on AWS, rely on IAM roles.
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
)

# --- Helper function to get SQS Queue URL ---
# This avoids repeatedly calling get_queue_url if the URL is stable.
# For a production application, consider caching this URL after the first lookup.
def get_sqs_queue_url(queue_name):
    try:
        response = sqs_client.get_queue_url(QueueName=queue_name)
        return response['QueueUrl']
    except Exception as e:
        print(f"Error getting SQS queue URL for '{queue_name}': {e}")
        raise

# Cache the queue URL
SQS_QUEUE_URL = get_sqs_queue_url(SQS_QUEUE_NAME)


# Route to get all products ordered by a user (no change needed here)
@order_bp.route('/user-orders/<user_sub>', methods=['GET'])
# You might want to add @verify_token here if this is a protected route
def get_user_orders(user_sub):
    try:
        user = User.query.filter_by(sub=user_sub).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        orders_list = []
        # Fetch orders for the user
        # Assuming 'orders' is a relationship on the User model
        for order in user.orders:
            order_dict = {
                'order_id': order.oid,
                # Add order_total and email_sent if they exist in your Order model
                # 'order_total': str(order.order_total) if hasattr(order, 'order_total') else None,
                # 'email_sent': order.email_sent if hasattr(order, 'email_sent') else None,
                'products': []
            }
            # Fetch order products for the current order
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
                        'price': str(product.price), # Convert Decimal to string for JSON
                        'thumbLink': product.thumbLink,
                        'quantity': op.quantity if hasattr(op, 'quantity') else 1 # Assuming quantity in OrderProduct
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
        product_ids_with_quantities = data.get('products', []) # Expecting a list of dicts: [{'pid': 1, 'quantity': 2}, ...]

        if not user_sub or not product_ids_with_quantities:
            return jsonify({"error": "Missing required parameters (user_sub or products)"}), 400

        user = User.query.filter_by(sub=user_sub).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Calculate total and prepare product details for the order and potential email
        total_order_amount = 0
        order_products_to_add = [] # To store OrderProduct objects
        products_for_email = [] # To store simplified product details for SQS/email

        for item in product_ids_with_quantities:
            pid = item.get('pid')
            quantity = item.get('quantity', 1) # Default to 1 if quantity not provided

            if not pid or not isinstance(quantity, int) or quantity <= 0:
                db.session.rollback()
                return jsonify({"error": f"Invalid product ID or quantity provided: {item}"}), 400

            product = Product.query.get(pid)
            if not product:
                db.session.rollback()
                return jsonify({"error": f"Product with ID {pid} not found"}), 404

            if product.inventory < quantity:
                db.session.rollback()
                return jsonify({"error": f"Product {product.productName} has insufficient stock. Available: {product.inventory}, Requested: {quantity}"}), 400

            # Update inventory and calculate total
            product.inventory -= quantity
            total_order_amount += product.price * quantity

            # Create OrderProduct instance
            order_products_to_add.append(OrderProduct(pid=pid, quantity=quantity))

            # Prepare product details for the email payload (optional, but good for detailed emails)
            products_for_email.append({
                'pid': product.pid,
                'productName': product.productName,
                'price': str(product.price), # Convert Decimal to string for JSON
                'thumbLink': product.thumbLink,
                'quantity': quantity,
                'size': product.size # Include size for email detail
            })

        # Create new order
        # Ensure your Order model has 'Useruid', 'order_total', and 'email_sent' fields
        new_order = Order(Useruid=user.uid, order_total=total_order_amount, email_sent=False)
        db.session.add(new_order)
        db.session.flush() # This gets us the new order ID (new_order.oid) before commit

        # Link order_products to the new order and add to session
        for op in order_products_to_add:
            op.oid = new_order.oid
            db.session.add(op)

        # Commit the transaction to save order, order_products, and product inventory updates
        db.session.commit()

        # --- IMPORTANT: Send order ID to SQS AFTER successful database commit ---
        try:
            # The SQS message body should ideally be minimal, just the order_id.
            # The Lambda will then fetch all necessary details from the DB.
            sqs_message_body = json.dumps({"oid": new_order.oid})

            send_response = sqs_client.send_message(
                QueueUrl=SQS_QUEUE_URL,
                MessageBody=sqs_message_body,
                # For FIFO queues, you'd need MessageGroupId and MessageDeduplicationId:
                # MessageGroupId='order_confirmation',
                # MessageDeduplicationId=str(new_order.oid) # Ensure this is unique per message
            )

            print(f"Order ID {new_order.oid} sent to SQS. Message ID: {send_response['MessageId']}")

        except Exception as sqs_err:
            print(f"Error sending order ID {new_order.oid} to SQS: {sqs_err}")
            traceback.print_exc()
            # Decide how to handle SQS send failure:
            # - Log it and proceed (order is placed, email might be delayed/missed)
            # - Rollback the order (more complex, might need user notification)
            # For order confirmation, usually logging and proceeding is acceptable.

        # Your API response to the frontend
        return jsonify({
            "message": "Order placed successfully. Confirmation email processing initiated.",
            "order_id": new_order.oid,
            "total_amount": str(total_order_amount)
        }), 201

    except Exception as e:
        db.session.rollback() # Rollback any changes if an error occurs
        traceback.print_exc() # Print full traceback for debugging
        return jsonify({"error": str(e)}), 500