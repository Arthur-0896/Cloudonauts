import json
import boto3
import os

# Initialize SES client (using SESv2 is generally recommended for newer features)
# Boto3 will automatically use IAM Role credentials if deployed to Lambda
ses_client = boto3.client('sesv2', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

def lambda_handler(event, context):
    print(f"Received event: {json.dumps(event)}")

    # --- Extract information from the event (expecting direct payload from Flask) ---
    order_id = event.get('orderId')
    customer_email = event.get('customerEmail')
    customer_name = event.get('customerName', "Valued Customer") # Default if not provided
    ordered_products_details = event.get('products', []) # Extract the detailed products list

    # Basic validation
    if not order_id or not customer_email:
        print("Missing 'orderId' or 'customerEmail' in the event payload.")
        return {
            'statusCode': 400,
            'body': json.dumps('Missing required parameters: orderId or customerEmail.')
        }

    # --- Prepare the dynamic parts of the email body ---
    order_summary_html_items = ""
    order_summary_plain_text_items = ""
    total_price = 0.0

    if ordered_products_details:
        for item in ordered_products_details:
            product_name = item.get('productName', 'Unknown Product')
            # Ensure price is handled correctly, assuming it's passed as a string from Flask's Decimal
            item_price = float(item.get('price', 0.0))
            
            order_summary_html_items += f"<li>{product_name} - ${item_price:.2f}</li>"
            order_summary_plain_text_items += f"{product_name} - ${item_price:.2f}\n"
            total_price += item_price
    else:
        order_summary_html_items = "<li>No specific items listed.</li>"
        order_summary_plain_text_items = "No specific items listed.\n"


    # --- Prepare the email content ---
    # Get the SES source email from environment variables (best practice)
    # Ensure this environment variable is set in your Lambda configuration in AWS.
    sender_email = os.environ.get('SES_SOURCE_EMAIL', 'shaikhuzair961@gmail.com') # Fallback if not set
    
    subject = f"Cloudonats: Hooray!! Your Order #{order_id} is Confirmed!"

    # HTML body
    body_html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }}
            h1 {{ color: #0056b3; }}
            ul {{ list-style-type: none; padding: 0; }}
            li {{ margin-bottom: 5px; }}
            .footer {{ margin-top: 20px; font-size: 0.9em; color: #777; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Confirmation</h1>
            <p>Dear {customer_name},</p>
            <p>Thank you for your order! Your order <strong>#{order_id}</strong> has been successfully placed.</p>
            <p><strong>Order Summary:</strong></p>
            <ul>
                {order_summary_html_items}
            </ul>
            <p><strong>Total Price: ${total_price:.2f}</strong></p>
            <p>We'll send you another update when your order is out for delivery.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thanks,</p>
            <p>Claudonatuts Team</p>
            <div class="footer">
                <p>This is an automated email, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Simple text body
    body_text = f"""
Dear {customer_name},

Thank you for your order! Your order #{order_id} has been successfully placed.

Order Summary:
{order_summary_plain_text_items}
Total Price: ${total_price:.2f}

We'll send you another update when your order is out for delivery.

If you have any questions, please don't hesitate to contact us.

Thanks,
The Claudonauts Team

This is an automated email, please do not reply.
"""

    # --- Send the email using SES ---
    try:
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [customer_email], # <--- CRITICAL FIX: Use the customer's email!
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': body_html,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': subject,
                },
            },
            Source=sender_email,
            # ConfigurationSetName='OptionalConfigurationSet', # Uncomment if you use SES Configuration Sets
        )

        print(f"Email sent! Message ID: {response['MessageId']}")

        return {
            'statusCode': 200,
            'body': json.dumps(f'Email sent for order ID: {order_id}. MessageId: {response["MessageId"]}')
        }

    except Exception as e:
        print(f"Error sending email: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error sending email for order ID {order_id}: {str(e)}')
        }