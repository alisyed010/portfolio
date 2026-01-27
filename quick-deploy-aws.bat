@echo off
REM Quick AWS Deployment Script for Windows
REM Make sure you have AWS CLI and EB CLI installed

echo.
echo ========================================
echo  AWS Portfolio Deployment Quick Start
echo ========================================
echo.

REM Check if AWS CLI is installed
where aws >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo AWS CLI not found. Please install it from:
    echo https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Check if EB CLI is installed
where eb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing EB CLI...
    pip install awsebcli
)

REM Check AWS credentials
echo Checking AWS credentials...
aws sts get-caller-identity >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo AWS credentials not configured. Please run:
    echo   aws configure
    pause
    exit /b 1
)

echo Prerequisites check passed!
echo.

REM Initialize EB if needed
if not exist ".elasticbeanstalk" (
    echo Initializing Elastic Beanstalk...
    eb init -p python-3.11 portfolio-app --region us-east-1
)

echo.
echo ========================================
echo  Ready to deploy!
echo ========================================
echo.
echo Next steps:
echo 1. Run: eb create portfolio-env --instance-type t3.micro
echo 2. Update .ebextensions\03_database.config with RDS endpoint
echo 3. Update .ebextensions\04_security.config with secret key
echo 4. Run: eb deploy
echo 5. Run: eb open
echo.
echo For detailed instructions, see AWS_DEPLOYMENT_GUIDE.md
echo.
pause
