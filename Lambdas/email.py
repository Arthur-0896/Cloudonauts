import psycopg2
import boto3
import os
import json
import traceback
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Load environment variables
RDS_HOST = os.environ['RDS_HOST']
RDS_USER = os.environ['RDS_USER']
RDS_PASS = os.environ['RDS_PASS']
RDS_DB = os.environ['RDS_DB']
SES_REGION = 'us-east-2'
SES_SOURCE_EMAIL = 'arthur.tristram1@gmail.com'

# Initialize SES client
ses = boto3.client('ses', region_name=SES_REGION)

def build_html_email(name, order_id, items, total_order_amount):
    items_html = ""
    for item in items:
        item_total = f"<strong style='color: green;'>${item['total_price']:.2f}</strong>"
        if item['quantity'] == 1:
            quantity_display = f"{item_total}"
        else:
            quantity_display = (
                f"<strong>${item['price']:.2f}</strong> × {item['quantity']} = {item_total}"
            )

        items_html += f"""
        <li style="display: flex; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #ccc; padding-bottom: 12px;">
          <img src="{item['thumb']}" alt="{item['name']}" width="80" height="80" style="border-radius: 8px; margin-right: 20px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
          <div style="flex-grow: 1;">
            <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">{item['name']}</p>
            <p style="margin: 0; font-size: 14px; color: #1a1a1a;">{quantity_display}</p>
          </div>
        </li>"""

    html = f"""<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Order Confirmation</title>
</head>
<body style="background-color: #f4f4f4; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif;">
  <div style="max-width: 600px; margin: auto; background: rgb(182, 237, 253); border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 12px;">
      <img src="https://cloudonauts-products.s3.us-east-2.amazonaws.com/Cloudonauts-shopping.png" alt="Cloudonauts Logo" width="200" height="100" style="object-fit: contain;" />
    </div>
    
    <p style="color: #1a1a1a; font-size: 18px;">Greetings <b>{name}!</b> Your order is confirmed!</>
    <p style="font-size: 16px; color: #1a1a1a;">Order id: <strong>#{order_id}</strong></p>
    <ul style="list-style: none; padding-left: 0;">
      {items_html}
    </ul>
    <p style="font-size: 17px; margin-top: 24px; color: #1a1a1a;"><strong>Order Total: <span style="color: green;">${total_order_amount:.2f}</span></strong></p>
    <p style="font-size: 16px; color: #1a1a1a;">We’ll notify you when your order ships.</p>
    <div style="margin-top: 10px;">
      <p style="font-size: 16px; color: #1a1a1a;">Best Regards,<br/><strong>The Cloudonauts Team</strong></p>
    </div>
  </div>
</body>
</html>"""
    return html



def build_text_email(name, order_id, items, total_order_amount):
    items_text = "\n".join(
        f"- {item['name']}: ${item['price']:.2f} × {item['quantity']} = ${item['total_price']:.2f}" for item in items
    )
    return f"""Hi {name},

Thank you for your order (Order ID: {order_id})!

Here are the items in your order:
{items_text}

Total Order Amount: ${total_order_amount:.2f}

We'll notify you when your order ships.

Best Regards,  
The Cloudonauts Team
"""

def lambda_handler(event, context):
    conn = None
    cursor = None
    try:
        # Debug log: full incoming event
        print("Incoming event:", json.dumps(event, indent=2))

        # Extract Order ID from SQS message
        message_body = event['Records'][0]['body']
        print(f"Raw SQS message body: {message_body}")
        msg = json.loads(message_body)
        order_id = int(msg['order_id'])

        print(f"Processing order ID: {order_id}")

        # Connect to RDS PostgreSQL
        conn = psycopg2.connect(
            host=RDS_HOST,
            database=RDS_DB,
            user=RDS_USER,
            password=RDS_PASS
        )
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                o.oid AS order_id,
                u.email AS user_email,
                u.name AS user_name,
                p."productName" AS product_name,
                p.price AS product_price,
                p."thumbLink" AS product_thumb,
                op.count AS quantity,
                o.total_amount AS total_order_price
            FROM "order" o
            JOIN users u ON o."Useruid" = u.uid
            JOIN order_product op ON o.oid = op.oid
            JOIN product p ON op.pid = p.pid
            WHERE o.oid = %s
            ORDER BY p."productName"
        """, (order_id,))

        rows = cursor.fetchall()
        if not rows:
            return {
                "statusCode": 404,
                "body": f"No data found for order ID {order_id}"
            }

        user_email = rows[0][1]
        user_name = rows[0][2]
        total_order_amount = rows[0][7]
        items = [{
            "name": row[3],
            "price": row[4],
            "thumb": row[5],
            "quantity": row[6],
            "total_price": row[4] * row[6]
        } for row in rows]

        html_body = build_html_email(user_name, order_id, items,total_order_amount)
        text_body = build_text_email(user_name, order_id, items,total_order_amount)

        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Cloudonauts Order Confirmation - #{order_id}"
        msg['From'] = SES_SOURCE_EMAIL
        msg['To'] = user_email

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        response = ses.send_raw_email(
            Source=SES_SOURCE_EMAIL,
            Destinations=[user_email],
            RawMessage={'Data': msg.as_string()}
        )

        print(f"Email sent to {user_email} for order ID {order_id}. SES Message ID: {response['MessageId']}")

        return {
            "statusCode": 200,
            "body": f"Email sent successfully for order ID {order_id}"
        }

    except Exception as e:
        error_message = f"{type(e).__name__}: {str(e)}"
        traceback_str = traceback.format_exc()
        print("Exception occurred:", error_message)
        print("Traceback:\n", traceback_str)

        if conn:
            conn.rollback()

        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": error_message,
                "trace": traceback_str
            })
        }

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
