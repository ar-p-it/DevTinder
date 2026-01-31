# DevTinder

## Environment Variables

Create a `.env` file in the project root with the following variables:

- MONGODB_URI: MongoDB connection string (contains username/password).
- JWT_SECRET: Secret used to sign and verify JWTs.
- AWS_REGION: AWS region for SES (e.g., us-east-1).
- AWS_ACCESS_KEY_ID: AWS access key (if using SES).
- AWS_SECRET_ACCESS_KEY: AWS secret access key (if using SES).

The `.env` file is ignored by Git. Rotate any credentials that were previously hardcoded.
