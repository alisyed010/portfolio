# AWS Deployment Guide

This guide will help you deploy your Django portfolio application to AWS. We provide three deployment options:

## Prerequisites

1. **AWS Account**: Sign up at https://aws.amazon.com
2. **AWS CLI**: Install and configure with your credentials
   ```bash
   pip install awscli
   aws configure
   ```
3. **Docker** (for ECS deployment): Install Docker Desktop
4. **EB CLI** (for Elastic Beanstalk): `pip install awsebcli`

---

## Option 1: AWS Elastic Beanstalk (Recommended for Beginners) ⭐

**Best for**: Quick deployment, managed infrastructure, automatic scaling

### Step 1: Install EB CLI
```bash
pip install awsebcli
```

### Step 2: Initialize Elastic Beanstalk
```bash
eb init -p python-3.11 portfolio-app --region us-east-1
```
- Choose your region (e.g., us-east-1, us-west-2)
- Choose "Create new application"

### Step 3: Create RDS Database (PostgreSQL)

1. Go to AWS Console → RDS → Create Database
2. Choose PostgreSQL
3. Select "Free tier" template
4. Set:
   - DB instance identifier: `portfolio-db`
   - Master username: `portfolio_user`
   - Master password: (choose a strong password)
   - Database name: `portfolio_db`
5. Note the endpoint URL (e.g., `portfolio-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 4: Update Configuration Files

Edit `.ebextensions/03_database.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DB_HOST: "your-rds-endpoint.region.rds.amazonaws.com"
    DB_NAME: "portfolio_db"
    DB_USER: "portfolio_user"
    DB_PASSWORD: "your-password"
    DB_PORT: "5432"
```

Edit `.ebextensions/04_security.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DEBUG: "False"
    SECRET_KEY: "generate-a-secure-secret-key-here"
    ALLOWED_HOSTS: "your-eb-url.elasticbeanstalk.com"
```

Generate a secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Create Environment and Deploy
```bash
# Create environment (first time only)
eb create portfolio-env --instance-type t3.micro

# Deploy
eb deploy

# Open in browser
eb open
```

### Step 6: Run Migrations
```bash
eb ssh
python manage.py migrate
python manage.py createsuperuser
exit
```

### Step 7: Get Your AWS IP/URL
```bash
eb status
```
Your application will be available at: `http://portfolio-env.xxxxx.us-east-1.elasticbeanstalk.com`

---

## Option 2: AWS ECS with Fargate (Docker) 🐳

**Best for**: Containerized deployments, more control, scalable

### Step 1: Set Up ECR (Elastic Container Registry)

```bash
# Set variables
AWS_REGION="us-east-1"
ECR_REPO_NAME="portfolio-app"

# Create ECR repository
aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

# Get login token
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.${AWS_REGION}.amazonaws.com
```

### Step 2: Build and Push Docker Image

```bash
# Build image
docker build -t ${ECR_REPO_NAME}:latest .

# Tag image
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
docker tag ${ECR_REPO_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

# Push image
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest
```

### Step 3: Create RDS Database

Same as Option 1, Step 3.

### Step 4: Update Task Definition

Edit `ecs-task-definition.json`:
- Replace `YOUR_ECR_REPO_URI` with your ECR URI
- Update database credentials
- Update environment variables

### Step 5: Create ECS Cluster and Service

```bash
# Create cluster
aws ecs create-cluster --cluster-name portfolio-cluster --region us-east-1

# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json --region us-east-1

# Create service (requires VPC, subnets, security groups)
# Use AWS Console for this step or see detailed guide below
```

### Step 6: Set Up Load Balancer

1. Go to EC2 → Load Balancers → Create
2. Choose Application Load Balancer
3. Configure:
   - Name: `portfolio-alb`
   - Scheme: Internet-facing
   - Listeners: HTTP:80, HTTPS:443 (optional)
   - Target group: Create new, port 8000
4. Note the DNS name

---

## Option 3: EC2 Instance (Manual Setup) 🖥️

**Best for**: Full control, learning AWS, custom configurations

### Step 1: Launch EC2 Instance

1. Go to EC2 → Launch Instance
2. Choose:
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t2.micro (free tier)
   - Configure security group:
     - SSH (22) from your IP
     - HTTP (80) from anywhere
     - Custom TCP (8000) from anywhere
3. Launch and download key pair

### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx postgresql-client -y

# Install Docker (optional, if using containers)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Step 4: Deploy Application

```bash
# Clone your repository
git clone your-repo-url
cd myproject

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DB_HOST="your-rds-endpoint"
export DB_NAME="portfolio_db"
export DB_USER="portfolio_user"
export DB_PASSWORD="your-password"
export SECRET_KEY="your-secret-key"
export DEBUG="False"
export ALLOWED_HOSTS="your-ec2-ip,ec2-xxx.compute.amazonaws.com"

# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# Run with Gunicorn
gunicorn portfolio.wsgi:application --bind 0.0.0.0:8000
```

### Step 5: Set Up Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add:
```nginx
server {
    listen 80;
    server_name your-ec2-ip;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /home/ubuntu/myproject/staticfiles/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Set Up Systemd Service

```bash
sudo nano /etc/systemd/system/portfolio.service
```

Add:
```ini
[Unit]
Description=Portfolio Gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/myproject
ExecStart=/home/ubuntu/myproject/venv/bin/gunicorn portfolio.wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio
sudo systemctl start portfolio
```

---

## Getting Your AWS IP Address

### Elastic Beanstalk:
```bash
eb status
# Look for "CNAME" field
```

### ECS:
- Check Load Balancer DNS name in EC2 Console
- Or check ECS service → Tasks → Public IP

### EC2:
- Check EC2 Console → Instances → Your instance → Public IPv4 address
- Or use: `curl http://169.254.169.254/latest/meta-data/public-ipv4` (from instance)

---

## Post-Deployment Checklist

- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Update `ALLOWED_HOSTS` with your domain/IP
- [ ] Set `DEBUG=False` in production
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (HTTPS) - use AWS Certificate Manager
- [ ] Configure backups for RDS database
- [ ] Set up CloudWatch monitoring
- [ ] Configure auto-scaling (if needed)

---

## Troubleshooting

### Database Connection Issues
- Check security groups allow traffic from your app to RDS
- Verify RDS endpoint and credentials
- Ensure RDS is publicly accessible (or in same VPC)

### Static Files Not Loading
- Run `python manage.py collectstatic --noinput`
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify Nginx/ALB configuration

### Application Not Accessible
- Check security groups allow HTTP/HTTPS traffic
- Verify `ALLOWED_HOSTS` includes your domain/IP
- Check application logs: `eb logs` or CloudWatch

---

## Cost Estimation (Monthly)

- **Elastic Beanstalk**: ~$15-30 (t3.micro + RDS free tier)
- **ECS Fargate**: ~$20-40 (0.25 vCPU, 0.5GB RAM + RDS)
- **EC2**: ~$10-15 (t2.micro free tier + RDS free tier)

*Note: Free tier available for first 12 months on new AWS accounts*

---

## Security Best Practices

1. **Never commit secrets**: Use environment variables or AWS Secrets Manager
2. **Use HTTPS**: Set up SSL certificate via AWS Certificate Manager
3. **Restrict security groups**: Only allow necessary ports
4. **Rotate credentials**: Regularly update database passwords
5. **Enable CloudWatch**: Monitor logs and metrics
6. **Use IAM roles**: Don't hardcode AWS credentials

---

## Need Help?

- AWS Documentation: https://docs.aws.amazon.com
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- EB CLI Docs: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
