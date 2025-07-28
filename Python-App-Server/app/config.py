import os

class Config:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Cognito
    COGNITO_REGION = os.getenv("COGNITO_REGION", "us-east-2")
    USERPOOL_ID = os.getenv("COGNITO_USER_POOL_ID")
    CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")
    JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USERPOOL_ID}/.well-known/jwks.json"
