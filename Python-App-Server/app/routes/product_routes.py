from flask import Blueprint, jsonify, request
from app.models import Product, Inventory
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
        # Create inventory entry
        inventory = Inventory(count=count)
        db.session.add(inventory)
        db.session.flush()  # Get inventory.iid before commit

        # Create product entry
        product = Product(
            category=category,
            gender=gender,
            productName=productName,
            size=size,
            price=price,
            iid=inventory.iid
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'message': 'Product and inventory added successfully', 'product_id': product.pid, 'inventory_id': inventory.iid}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        productList = Product.query.all()
        return jsonify([{
            'pid': product.pid,
            'iid': product.iid, 
            'category': product.category,
            'gender': product.gender,
            'productName': product.productName,
            'size': product.size,
            'price': str(product.price),
            'inventory': {
                'count' : product.inventory.count if product.inventory else 0
        } 
        }for product in productList]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve products", "message": str(e)}), 500
