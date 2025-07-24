from flask import Blueprint, request, jsonify
from app.models import User, Product, Order, OrderProduct
from app import db
from app.auth.token_verify import verify_token
import traceback

order_bp = Blueprint('order_bp', __name__)

# Route to get all products ordered by a user
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
        db.session.flush()  # This gets us the new order ID

        # Add all products to the order
        for pid in product_ids:
            # Verify product exists
            product = Product.query.get(pid)
            if not product:
                db.session.rollback()
                return jsonify({"error": f"Product with ID {pid} not found"}), 404
            
            # Check inventory
            if product.inventory <= 0:
                db.session.rollback()
                return jsonify({"error": f"Product {product.productName} is out of stock"}), 400

            # Create order product mapping
            order_product = OrderProduct(oid=new_order.oid, pid=pid)
            db.session.add(order_product)

            # Update inventory
            product.inventory -= 1

        # Commit the transaction
        db.session.commit()

        return jsonify({
            "message": "Order placed successfully",
            "order_id": new_order.oid
        }), 201

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
