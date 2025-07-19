import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()

def create_app():
    load_dotenv()

    app = Flask(__name__, template_folder='templates', static_folder='static')

    # CORS
    CORS(app, origins=["http://localhost:3000"])

    # Config
    app.config.from_object('app.config.Config')

    # Init DB
    db.init_app(app)

    # Register Blueprints
    from app.routes.user_routes import user_bp
    from app.routes.product_routes import product_bp
    from app.routes.admin_routes import admin_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(admin_bp)

    return app