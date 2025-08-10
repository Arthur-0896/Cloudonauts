import os
import json
import boto3
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

db = SQLAlchemy()

def get_secret():
    region = os.getenv('AWS_REGION', 'us-east-1')
    secret_id = os.getenv('AWS_HEADER_SECRET_ID', 'cloudonauts/header-secret')
    client = boto3.client("secretsmanager", region_name=region)
    response = client.get_secret_value(SecretId=secret_id)
    return json.loads(response["SecretString"])

def create_app():
    load_dotenv()

    app = Flask(__name__, template_folder='templates', static_folder='static')

    # Load CORS whitelist from .env
    CORS_WHITE_LIST_ADDRESS = os.getenv("CORS_WHITE_LIST")

    # Load CloudFront secret from Secrets Manager
    secret_data = get_secret()
    CLOUDFRONT_SECRET_HEADER_NAME = secret_data["header_name"]
    CLOUDFRONT_SECRET_HEADER_VALUE = secret_data["header_value"]

    # CORS
    CORS(app, origins=[CORS_WHITE_LIST_ADDRESS])

    # Middleware to check CloudFront secret, except for health check path
    @app.before_request
    def verify_cloudfront_header():
        from flask import request, abort
        
        # Skip secret header check for ALB health check endpoint
        if request.path == '/health':
            return None

        print(f"Loaded secret header name: {CLOUDFRONT_SECRET_HEADER_NAME}")
        print(f"Loaded secret header value: {CLOUDFRONT_SECRET_HEADER_VALUE}")

        headers = dict(request.headers)
        print(f"Incoming request headers: {headers}")


        if request.headers.get(CLOUDFRONT_SECRET_HEADER_NAME) != CLOUDFRONT_SECRET_HEADER_VALUE:
            abort(403)

    # Config
    app.config.from_object('app.config.Config')

    # Init DB
    db.init_app(app)

    # Register Blueprints
    from app.routes.user_routes import user_bp
    from app.routes.product_routes import product_bp
    from app.routes.order_routes import order_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)

    return app
