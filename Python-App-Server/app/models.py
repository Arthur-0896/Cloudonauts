from app import db
class User(db.Model):
    __tablename__ = 'users'

    uid = db.Column(db.Integer, primary_key=True)
    sub = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True)
    name = db.Column(db.String(255))

    orders = db.relationship('Order', back_populates='user')

class Order(db.Model):
    __tablename__ = 'order'

    oid = db.Column(db.Integer, primary_key=True)
    Useruid = db.Column(db.Integer, db.ForeignKey('users.uid'), nullable=False)

    user = db.relationship('User', back_populates='orders')
    products = db.relationship('Product', secondary='order_product', back_populates='orders')

class OrderProduct(db.Model):
    __tablename__ = 'order_product'

    oid = db.Column(db.Integer, db.ForeignKey('order.oid'), primary_key=True)
    pid = db.Column(db.Integer, db.ForeignKey('product.pid'), primary_key=True)

class Product(db.Model):
    __tablename__ = 'product'

    pid = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(255))
    gender = db.Column(db.String(255))  # Changed from char to String to match ERD
    productName = db.Column(db.String(255))
    size = db.Column(db.String(255))
    price = db.Column(db.Numeric(10, 2))
    imageLink = db.Column(db.String(255))
    thumbLink = db.Column(db.String(255))
    iid = db.Column(db.Integer, db.ForeignKey('inventory.iid'))

    inventory = db.relationship('Inventory', back_populates='products')
    orders = db.relationship('Order', secondary='order_product', back_populates='products')

class Inventory(db.Model):
    __tablename__ = 'inventory'

    iid = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer)

    products = db.relationship('Product', back_populates='inventory')
