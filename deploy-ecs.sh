#!/bin/bash

# AWS ECS Deployment Script
# Prerequisites: AWS CLI configured, Docker installed

set -e

echo "🚀 Starting AWS ECS Deployment..."

# Configuration
AWS_REGION="us-east-1"
ECR_REPO_NAME="portfolio-app"
ECS_CLUSTER_NAME="portfolio-cluster"
ECS_SERVICE_NAME="portfolio-service"
TASK_DEFINITION="ecs-task-definition.json"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "📦 Building Docker image..."
docker build -t ${ECR_REPO_NAME}:latest .

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URI}

# Create ECR repository if it doesn't exist
echo "📝 Creating ECR repository if needed..."
aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} || \
    aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

echo "🏷️  Tagging image..."
docker tag ${ECR_REPO_NAME}:latest ${ECR_REPO_URI}:latest

echo "📤 Pushing image to ECR..."
docker push ${ECR_REPO_URI}:latest

# Update task definition with image URI
echo "📋 Updating task definition..."
sed -i.bak "s|YOUR_ECR_REPO_URI|${ECR_REPO_URI}|g" ${TASK_DEFINITION}

# Register task definition
echo "📝 Registering task definition..."
aws ecs register-task-definition --cli-input-json file://${TASK_DEFINITION} --region ${AWS_REGION}

# Create cluster if it doesn't exist
echo "🌍 Creating ECS cluster if needed..."
aws ecs describe-clusters --clusters ${ECS_CLUSTER_NAME} --region ${AWS_REGION} || \
    aws ecs create-cluster --cluster-name ${ECS_CLUSTER_NAME} --region ${AWS_REGION}

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create an Application Load Balancer"
echo "2. Create an ECS service using the task definition"
echo "3. Update security groups to allow traffic on port 8000"
