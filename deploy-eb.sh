#!/bin/bash

# AWS Elastic Beanstalk Deployment Script
# Make sure you have AWS CLI and EB CLI installed

echo "🚀 Starting AWS Elastic Beanstalk Deployment..."

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Installing..."
    pip install awsebcli
fi

# Initialize EB if not already done
if [ ! -d ".elasticbeanstalk" ]; then
    echo "📦 Initializing Elastic Beanstalk..."
    eb init -p python-3.11 portfolio-app --region us-east-1
fi

# Create environment if it doesn't exist
echo "🌍 Creating/updating Elastic Beanstalk environment..."
eb create portfolio-env --instance-type t3.micro --database.engine postgres --database.username portfolio_user --database.password $(openssl rand -base64 12)

# Deploy
echo "📤 Deploying application..."
eb deploy

# Get the URL
echo "✅ Deployment complete!"
echo "🌐 Your application URL:"
eb status | grep "CNAME"

echo ""
echo "📝 Next steps:"
echo "1. Update .ebextensions/03_database.config with your RDS endpoint"
echo "2. Update .ebextensions/04_security.config with your domain and secret key"
echo "3. Run 'eb deploy' again to apply changes"
