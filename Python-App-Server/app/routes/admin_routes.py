from flask import Blueprint, request, jsonify, current_app
import boto3

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api')

client = boto3.client('cognito-idp', '')

@admin_bp.route('/admin-register', methods=['POST'])
def register_admin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        client.sign_up(
            ClientId=current_app.config["CLIENT_ID"],
            Username=email,
            Password=password,
            UserAttributes=[{'Name': 'email', 'Value': email}]
        )

        client.admin_confirm_sign_up(
            UserPoolId=current_app.config["USERPOOL_ID"],
            Username=email
        )

        client.admin_add_user_to_group(
            UserPoolId=current_app.config["USERPOOL_ID"],
            Username=email,
            GroupName='Admins'
        )

        return jsonify({'message': 'Admin user registered successfully'}), 201

    except client.exceptions.UsernameExistsException:
        return jsonify({'error': 'User already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500