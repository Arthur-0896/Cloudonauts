import os
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)

CORS(app, origins=["http://localhost:3000"])

# Database Configuration
DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_PORT = os.getenv('DB_PORT')

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ------------------ Models ------------------

class Shoe(db.Model):
    __tablename__ = 'shoes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    s3link = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Shoe {self.name} (Size: {self.size})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'size': self.size,
            's3link': self.s3link
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    shoe_id = db.Column(db.Integer, db.ForeignKey('shoes.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    shoe = db.relationship('Shoe', backref='cart_items')

    def to_dict(self):
        return {
            'id': self.id,
            'shoe': self.shoe.to_dict(),
            'quantity': self.quantity
        }

# ------------------ Dummy Data ------------------

def create_dummy_data():
    print("Checking if dummy data needs to be added...")

    first_image = 'https://s3manavbucket1.s3.us-east-1.amazonaws.com/download+(1).jpg'
    second_image = 'https://s3manavbucket1.s3.us-east-1.amazonaws.com/nike.webp'

    try:
        shoe_count = Shoe.query.count()
        print(f"Current number of shoes in DB: {shoe_count}")

        if shoe_count == 0:
            print("Populating database with dummy data...")
            dummy_shoes = [
                Shoe(name='Nike Air Max 270', size=9, s3link=first_image),
                Shoe(name='Adidas Ultraboost 22', size=10, s3link=second_image),
                Shoe(name='Puma RS-X', size=8, s3link=first_image),
                Shoe(name='New Balance 990v5', size=9, s3link=second_image),
                Shoe(name='Converse Chuck Taylor', size=7, s3link=first_image),
                Shoe(name='Vans Old Skool', size=11, s3link=second_image),
                Shoe(name='Reebok Classic', size=8, s3link=first_image),
                Shoe(name='Asics Gel-Kayano', size=10, s3link=second_image),
            ]
            db.session.add_all(dummy_shoes)
            db.session.commit()
            print("✅ Dummy data added successfully!")
        else:
            print("ℹ️ Database already contains data. Skipping dummy data creation.")
    except Exception as e:
        print(f"❌ Error checking/creating dummy data: {e}")

# ------------------ Routes ------------------

@app.route('/api/shoes', methods=['GET'])
def get_all_shoes():
    try:
        shoes = Shoe.query.all()
        print(f"Fetched {len(shoes)} shoes")
        return jsonify([shoe.to_dict() for shoe in shoes]), 200
    except Exception as e:
        app.logger.error(f"Error fetching shoes: {e}")
        return jsonify({"error": "Failed to retrieve shoes", "message": str(e)}), 500

@app.route('/api/cart', methods=['GET'])
def get_cart():
    try:
        items = CartItem.query.all()
        return jsonify([item.to_dict() for item in items]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve cart", "message": str(e)}), 500

@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        shoe_id = data.get('shoe_id')
        quantity = data.get('quantity', 1)

        shoe = Shoe.query.get(shoe_id)
        if not shoe:
            return jsonify({"error": "Shoe not found"}), 404

        existing_item = CartItem.query.filter_by(shoe_id=shoe_id).first()
        if existing_item:
            existing_item.quantity += quantity
        else:
            cart_item = CartItem(shoe_id=shoe_id, quantity=quantity)
            db.session.add(cart_item)

        db.session.commit()
        return jsonify({"message": "Item added to cart successfully"}), 201

    except Exception as e:
        app.logger.error(f"Error adding to cart: {e}")
        return jsonify({"error": "Failed to add item to cart", "message": str(e)}), 500

@app.route('/api/cart/count', methods=['GET'])
def cart_count():
    try:
        count = sum(item.quantity for item in CartItem.query.all())
        return jsonify({'count': count}), 200
    except Exception as e:
        return jsonify({'count': 0, 'error': str(e)}), 500

@app.route('/api/cart/<int:shoe_id>', methods=['DELETE'])
def remove_from_cart(shoe_id):
    try:
        item = CartItem.query.filter_by(shoe_id=shoe_id).first()
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({"message": "Item removed successfully"}), 200
        else:
            return jsonify({"error": "Item not found in cart"}), 404
    except Exception as e:
        app.logger.error(f"Error removing from cart: {e}")
        return jsonify({"error": "Failed to remove item", "message": str(e)}), 500

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cart')
def cart_page():
    return render_template('cart.html')

# ------------------ App Runner ------------------

if __name__ == '__main__':
    with app.app_context():
        print("🚀 Attempting to create database tables...")
        db.create_all()
        print("✅ Database tables checked/created.")
        create_dummy_data()

    app.run(debug=True, port=5000)