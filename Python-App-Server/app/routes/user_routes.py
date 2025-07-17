from flask import Blueprint, request, jsonify
from app.models import User, Product
from app import db
from app.models import User
from app.auth.token_verify import verify_token
import traceback

user_bp = Blueprint('user_bp', __name__, url_prefix='/api')

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
@user_bp.route('/user-products/<user_uid>', methods=['GET'])
def get_user_products(user_uid):
    try:
        user = User.query.filter_by(uid=user_uid).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        products = []
        for order in user.orders:
            for product in order.products:
                products.append({
                    'pid': product.pid,
                    'category': product.category,
                    'gender': product.gender,
                    'productName': product.productName,
                    'size': product.size,
                    'price': str(product.price)
                })
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500