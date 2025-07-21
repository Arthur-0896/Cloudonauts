from flask import Blueprint, jsonify, request
from app.models import Product
from app import db

product_bp = Blueprint('product_bp', __name__)
@product_bp.route('/add-product', methods=['POST'])
def add_product():
    data = request.get_json()
    # Extract product fields
    category = data.get('category')
    gender = data.get('gender')
    productName = data.get('productName')
    size = data.get('size')
    price = data.get('price')
    count = data.get('count')

    if not all([category, gender, productName, size, price]) or count is None:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Create product entry with inventory as integer
        product = Product(
            category=category,
            gender=gender,
            productName=productName,
            size=size,
            price=price,
            inventory=count
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'message': 'Product added successfully', 'product_id': product.pid, 'inventory': product.inventory}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        productList = Product.query.all()
        return jsonify([{
            'pid': product.pid,
            'category': product.category,
            'gender': product.gender,
            'productName': product.productName,
            'size': product.size,
            'price': str(product.price),
            'inventory': product.inventory,
            'thumbLink': product.thumbLink
        } for product in productList]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve products", "message": str(e)}), 500
