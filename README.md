# Cloudonauts ECommerce
Cloudonauts ECommerce is a cloud native online shopping platform. It is scalable and resilient, utilizing the flexibility of the cloud. 

## Architecture Diagram
![Cloudonauts_main](https://github.com/user-attachments/assets/1aae54b4-a3dc-48c4-bfea-abe08d7d198f)

## Services Used:
- ECS(Amazon Elastic Container Service):     // Deploying backend in clusters.
- RDS(Relational Database) for Postgres:     // Storing inventory, customer data, order history etc.
- Cloudfront:                                // Hosting application at edge locations.
- Cognito:                                   // Secure login managed by AWS.
- Lambda:                                    // Processing Asynchronous events like sending message to SQS.
- Route 53:                                  // Managing Hosted Zones and DNS records.
- ACM(Amazon Certificate Manager)            // Issuing certificate for securing connection (HTTPS).
- S3 (Simple Storage Service)                // Static website hosting and storing images for website.
- SES (Simple Email Service)                 // Automating email receipts to customers.

## Tech Stack:
- Front-End: React.js
- Back-End: Python Flask
- RDBMS: PostgresSQL

## Application Screenshots
### Store page (Images pulled from S3, Item details populated by PostgreSQL RDS database):
![Store page](https://github.com/user-attachments/assets/bb0cd1b9-db91-4395-aaa7-c6d454371208)

### Checkout Page (Cart state maintainted through client side cookies):
![Cart page](https://github.com/user-attachments/assets/9f98d992-4b57-49d3-a92b-5564777a1c5c)

### Order confirmation page (Order recorded in RDS and message published to SQS for async email processing):
![Confirmation Page](https://github.com/user-attachments/assets/0b65c827-0813-4f34-b2c5-8692abed4d37)

### Email confirmation (Order id picked up from SQS, processed by lambda(python), and emailed through SES):
![Email confirmation](https://github.com/user-attachments/assets/4204d9aa-fca8-4133-9e61-1b59f93ab4e7)
