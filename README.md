# Portfolio Project

A Django-based portfolio website with visitor region tracking functionality.

## Features

- Portfolio website with multiple sections (Home, About, Projects, Tools, Contact)
- Visitor region tracking using IP geolocation
- Admin interface to view visitor statistics
- Dockerized for easy deployment

## Visitor Tracking

The application automatically tracks visitors by their region:
- Uses free IP geolocation APIs (ip-api.com and ipapi.co as fallback)
- Stores region name and visit count in the database
- Accessible via Django admin panel

## Setup

### Local Development (SQLite)

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

4. Run development server:
```bash
python manage.py runserver
```

5. Access the application:
- Website: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Create superuser (in a new terminal):
```bash
docker-compose exec web python manage.py createsuperuser
```

3. Access the application:
- Website: http://localhost:8000/
- Admin: http://localhost:8000/admin/

The Docker setup includes:
- Django web application
- PostgreSQL database
- Automatic migrations on startup
- Static files collection

### Docker Commands

- Start containers: `docker-compose up`
- Start in background: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild: `docker-compose up --build`
- Access shell: `docker-compose exec web bash`

## Project Structure

```
myproject/
├── portfolio/          # Django project settings
├── resume/            # Main app
│   ├── models.py      # Visitor model
│   ├── views.py       # View functions
│   ├── middleware.py  # Visitor tracking middleware
│   ├── utils.py       # IP geolocation utility
│   └── templates/     # HTML templates
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── requirements.txt   # Python dependencies
```

## Visitor Tracking Details

- **Model**: `Visitor` with fields:
  - `region`: Region name (e.g., "California, United States")
  - `count`: Number of visits from this region
  - `created_at`: First visit timestamp
  - `updated_at`: Last visit timestamp

- **Middleware**: `VisitorTrackingMiddleware` tracks each page visit
- **APIs Used**: 
  - Primary: ip-api.com (free, 45 requests/minute)
  - Fallback: ipapi.co (free tier available)

## Admin Panel

Access the admin panel to view visitor statistics:
1. Go to http://localhost:8000/admin/
2. Login with superuser credentials
3. Navigate to "Visitors" section
4. View regions sorted by visit count

## AWS Deployment 🚀

This project is configured for easy deployment to AWS. See **[AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)** for detailed instructions.

### Quick Deploy to AWS Elastic Beanstalk

1. **Install prerequisites:**
   ```bash
   pip install awscli awsebcli
   aws configure  # Enter your AWS credentials
   ```

2. **Run quick deploy script:**
   ```bash
   chmod +x quick-deploy-aws.sh
   ./quick-deploy-aws.sh
   ```

3. **Or deploy manually:**
   ```bash
   eb init -p python-3.11 portfolio-app --region us-east-1
   eb create portfolio-env --instance-type t3.micro
   eb deploy
   eb open  # Opens your app in browser
   ```

4. **Get your AWS URL/IP:**
   ```bash
   eb status  # Shows your application URL
   ```

### AWS Deployment Options

- **Elastic Beanstalk** (Easiest) - Managed platform, auto-scaling
- **ECS Fargate** (Docker) - Container-based, scalable
- **EC2** (Manual) - Full control, custom setup

See `AWS_DEPLOYMENT_GUIDE.md` for complete instructions on all three methods.

## Notes

- Local IPs (127.0.0.1, localhost) are tracked as "Local"
- Unknown regions are stored as "Unknown"
- The middleware skips tracking for admin and static file requests
- For production, consider:
  - Setting `DEBUG=False`
  - Configuring proper `ALLOWED_HOSTS`
  - Using environment variables for sensitive data
  - Setting up proper logging
  - Using AWS RDS for database
  - Setting up SSL/HTTPS
