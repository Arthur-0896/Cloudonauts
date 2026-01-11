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

## Tech stack:
- Front-End: React.js
- Back-End: Python Flask
- RDBMS: PostgresSQL
