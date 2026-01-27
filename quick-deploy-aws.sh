#!/bin/bash

# Quick AWS Deployment Script
# This script helps you deploy to AWS Elastic Beanstalk quickly

set -e

echo "🚀 AWS Portfolio Deployment Quick Start"
echo "========================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Installing..."
    pip install awscli
    echo "✅ Please run 'aws configure' to set up your credentials"
    exit 1
fi

if ! command -v eb &> /dev/null; then
    echo "📦 Installing EB CLI..."
    pip install awsebcli
fi

# Check AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Get user input
read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Enter application name (default: portfolio-app): " APP_NAME
APP_NAME=${APP_NAME:-portfolio-app}

read -p "Enter environment name (default: portfolio-env): " ENV_NAME
ENV_NAME=${ENV_NAME:-portfolio-env}

# Initialize EB
if [ ! -d ".elasticbeanstalk" ]; then
    echo "📦 Initializing Elastic Beanstalk..."
    eb init -p python-3.11 ${APP_NAME} --region ${AWS_REGION}
else
    echo "✅ Elastic Beanstalk already initialized"
fi

# Check if environment exists
if eb list | grep -q ${ENV_NAME}; then
    echo "🌍 Environment ${ENV_NAME} already exists"
    read -p "Deploy to existing environment? (y/n): " DEPLOY_EXISTING
    if [ "$DEPLOY_EXISTING" != "y" ]; then
        echo "Exiting..."
        exit 0
    fi
else
    echo "🌍 Creating new environment..."
    read -p "Create RDS database? (y/n): " CREATE_DB
    if [ "$CREATE_DB" == "y" ]; then
        read -sp "Enter database password: " DB_PASSWORD
        echo ""
        eb create ${ENV_NAME} \
            --instance-type t3.micro \
            --database.engine postgres \
            --database.username portfolio_user \
            --database.password ${DB_PASSWORD} \
            --database.size db.t3.micro
    else
        eb create ${ENV_NAME} --instance-type t3.micro
    fi
fi

# Deploy
echo "📤 Deploying application..."
eb deploy ${ENV_NAME}

# Get URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application URL:"
eb status ${ENV_NAME} | grep "CNAME" || eb status ${ENV_NAME}

echo ""
echo "📝 Next steps:"
echo "1. Update .ebextensions/03_database.config with your RDS endpoint"
echo "2. Update .ebextensions/04_security.config with your secret key"
echo "3. Run migrations: eb ssh -> python manage.py migrate"
echo "4. Create superuser: eb ssh -> python manage.py createsuperuser"
echo ""
echo "To open your app: eb open"
echo "To view logs: eb logs"
