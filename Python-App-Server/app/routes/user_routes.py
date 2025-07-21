from flask import Blueprint, request, jsonify
from app.models import User, Product
from app import db
from app.models import User
from app.auth.token_verify import verify_token
import traceback

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def track_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        claims = verify_token(token)
        data = request.json

        user = User.query.filter_by(sub=data['sub']).first()
        if user:
            user.email = data.get('email')
            user.name = data.get('name')
        else:
            user = User(sub=data['sub'], email=data.get('email'), name=data.get('name'))
            db.session.add(user)

        db.session.commit()
        return jsonify({"message": "User stored/updated successfully", "sub": user.sub})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 401

# Route to get all products ordered by a user
@user_bp.route('/user-orders/<user_uid>', methods=['GET'])
def get_user_orders(user_uid):
    try:
        user = User.query.filter_by(uid=user_uid).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        orders_list = []
        from app.models import OrderProduct, Product
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
                        'price': str(product.price)
                    })
            orders_list.append(order_dict)
        return jsonify(orders_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"message": "Connection success"}), 200