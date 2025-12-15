@echo off
REM Veridia Hiring Platform Deployment Script for Windows
REM This script automates the deployment process using Docker Compose

setlocal enabledelayedexpansion

REM Colors for output (Windows doesn't have native color support like Linux)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Function to print status
:print_status
echo %INFO% %~1
goto :eof

:print_success
echo %SUCCESS% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

REM Check if Docker is installed
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo %SUCCESS% Docker and Docker Compose are installed
goto :eof

REM Check if .env file exists
:check_env_file
if not exist .env (
    echo %WARNING% .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env >nul
        echo %WARNING% Please edit .env file with your production values before continuing.
        echo %WARNING% Especially update passwords, secrets, and email configuration.
        pause
    ) else (
        echo %ERROR% .env.example file not found. Please create .env file manually.
        pause
        exit /b 1
    )
)

echo %SUCCESS% .env file found
goto :eof

REM Create necessary directories
:create_directories
echo %INFO% Creating necessary directories...
if not exist nginx\ssl mkdir nginx\ssl
if not exist logs mkdir logs
if not exist backups mkdir backups

echo %SUCCESS% Directories created
goto :eof

REM Build and start services
:deploy_services
echo %INFO% Building and starting services...

REM Stop existing services
docker-compose -f docker-compose.prod.yml down >nul 2>&1

REM Build images
echo %INFO% Building Docker images...
docker-compose -f docker-compose.prod.yml build --no-cache

REM Start services
echo %INFO% Starting services...
docker-compose -f docker-compose.prod.yml up -d

echo %SUCCESS% Services deployed successfully
goto :eof

REM Wait for services to be healthy
:wait_for_services
echo %INFO% Waiting for services to be healthy...

REM Wait for MySQL
echo %INFO% Waiting for MySQL...
:wait_mysql
docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent >nul 2>&1
if errorlevel 1 (
    echo Waiting for MySQL...
    timeout /t 5 /nobreak >nul
    goto wait_mysql
)
echo %SUCCESS% MySQL is ready

REM Wait for Backend
echo %INFO% Waiting for Backend...
:wait_backend
curl -f http://localhost:8080/api/health >nul 2>&1
if errorlevel 1 (
    echo Waiting for Backend...
    timeout /t 10 /nobreak >nul
    goto wait_backend
)
echo %SUCCESS% Backend is ready

REM Wait for Frontend
echo %INFO% Waiting for Frontend...
:wait_frontend
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo Waiting for Frontend...
    timeout /t 5 /nobreak >nul
    goto wait_frontend
)
echo %SUCCESS% Frontend is ready
goto :eof

REM Run health checks
:health_check
echo %INFO% Running health checks...

REM Check MySQL
docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent >nul 2>&1
if errorlevel 1 (
    echo %ERROR% MySQL: Unhealthy
) else (
    echo %SUCCESS% MySQL: Healthy
)

REM Check Backend
curl -f http://localhost:8080/api/health >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Backend: Unhealthy
) else (
    echo %SUCCESS% Backend: Healthy
)

REM Check Frontend
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Frontend: Unhealthy
) else (
    echo %SUCCESS% Frontend: Healthy
)
goto :eof

REM Show deployment status
:show_status
echo %INFO% Deployment Status:
docker-compose -f docker-compose.prod.yml ps

echo.
echo %INFO% Service URLs:
echo Frontend: http://localhost
echo Backend API: http://localhost:8080/api
echo Health Check: http://localhost:8080/api/health
goto :eof

REM Backup function
:backup_data
echo %INFO% Creating backup...

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "BACKUP_DIR=backups\%dt:~0,8%_%dt:~8,6%"
mkdir "%BACKUP_DIR%"

REM Backup database
docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u root -p%MYSQL_ROOT_PASSWORD% veridia_hiring > "%BACKUP_DIR%\database.sql"

REM Backup uploads
docker cp veridia-backend-prod:/app/uploads "%BACKUP_DIR%\uploads"

echo %SUCCESS% Backup created in %BACKUP_DIR%
goto :eof

REM Cleanup function
:cleanup
echo %INFO% Cleaning up old Docker images and containers...

docker system prune -f
docker volume prune -f

echo %SUCCESS% Cleanup completed
goto :eof

REM Main deployment function
:main
echo ========================================
echo   Veridia Hiring Platform Deployment
echo ========================================

call :check_docker
call :check_env_file
call :create_directories

REM Ask for deployment type
echo Choose deployment type:
echo 1) Fresh deployment
echo 2) Update existing deployment
echo 3) Backup and update
echo 4) Health check only
echo 5) Cleanup

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    call :deploy_services
    call :wait_for_services
    call :health_check
    call :show_status
) else if "%choice%"=="2" (
    call :deploy_services
    call :wait_for_services
    call :health_check
    call :show_status
) else if "%choice%"=="3" (
    call :backup_data
    call :deploy_services
    call :wait_for_services
    call :health_check
    call :show_status
) else if "%choice%"=="4" (
    call :health_check
    call :show_status
) else if "%choice%"=="5" (
    call :cleanup
) else (
    echo %ERROR% Invalid choice
    pause
    exit /b 1
)

echo %SUCCESS% Deployment completed successfully!
pause
goto :eof

REM Run main function
call :main
