import os
import boto3
import json

class Config:
    COGNITO_REGION = os.environ.get('COGNITO_REGION', 'us-east-1')
    COGNITO_USER_POOL_ID = os.environ.get('COGNITO_USER_POOL_ID', '')
    JWKS_URL = f'https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}/.well-known/jwks.json'

def get_database_config():
    """Get database configuration from either AWS Secrets Manager or environment variables"""
    # Check if running in AWS (ECS/EC2/Lambda) - AWS automatically sets AWS_EXECUTION_ENV
    if os.environ.get('AWS_EXECUTION_ENV') is not None:  # Running in AWS environment
        try:
            aws_region = os.environ.get('AWS_REGION', 'us-east-1')
            session = boto3.session.Session(region_name=aws_region)
            client = session.client('secretsmanager')
            secret = client.get_secret_value(SecretId='cloudonauts/db-credentials')
            rds_secret = json.loads(secret['SecretString'])
            return {
                'username': rds_secret['username'],
                'password': rds_secret['password'],
                'host': rds_secret['host'],
                'port': str(rds_secret['port']),  # Convert port to string for URL
                'dbname': rds_secret['dbname'] if 'dbname' in rds_secret else rds_secret['dbInstanceIdentifier']
            }
        except Exception as e:
            print(f"Error fetching database credentials from Secrets Manager: {str(e)}")
            raise
    else:  # Local development
        return {
            'username': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'dbname': os.getenv('DB_NAME')
        }

class Config:
    # Get database configuration
    db_config = get_database_config()
    
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{db_config['username']}:{db_config['password']}@"
        f"{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False    