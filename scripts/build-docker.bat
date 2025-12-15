@echo off
REM Docker Build Script for Veridia Hiring Platform (Windows)
REM This script builds Docker images for the full-stack application

setlocal enabledelayedexpansion

REM Colors for output (limited support in Windows CMD)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Function to print status
echo %INFO% Starting Docker build process for Veridia Hiring Platform...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %ERROR% Docker is not installed or not in PATH
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %ERROR% Docker Compose is not installed or not in PATH
    pause
    exit /b 1
)

echo %SUCCESS% Docker and Docker Compose are available

REM Check if .env file exists
if not exist ".env" (
    echo %WARNING% .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo %SUCCESS% Created .env file from .env.example
        echo %WARNING% Please update the .env file with your configuration
    ) else (
        echo %ERROR% .env.example file not found
        pause
        exit /b 1
    )
)

REM Clean up previous builds
echo %INFO% Cleaning up previous builds...
docker-compose down --remove-orphans >nul 2>&1
docker image prune -f >nul 2>&1
echo %SUCCESS% Cleanup completed

REM Build based on argument
set "BUILD_TYPE=%~1"
if "%BUILD_TYPE%"=="" set "BUILD_TYPE=all"

if "%BUILD_TYPE%"=="backend" goto :build_backend
if "%BUILD_TYPE%"=="frontend" goto :build_frontend
if "%BUILD_TYPE%"=="compose" goto :build_compose
if "%BUILD_TYPE%"=="all" goto :build_compose

echo %ERROR% Invalid option: %BUILD_TYPE%
echo Usage: %~nx0 [backend^|frontend^|compose^|all]
pause
exit /b 1

:build_backend
echo %INFO% Building backend image...
cd backend
docker build -t veridia-backend:latest .
if %errorlevel% neq 0 (
    echo %ERROR% Failed to build backend image
    cd ..
    pause
    exit /b 1
)
echo %SUCCESS% Backend image built successfully
cd ..
goto :tag_images

:build_frontend
echo %INFO% Building frontend image...
cd frontend
docker build -t veridia-frontend:latest .
if %errorlevel% neq 0 (
    echo %ERROR% Failed to build frontend image
    cd ..
    pause
    exit /b 1
)
echo %SUCCESS% Frontend image built successfully
cd ..
goto :tag_images

:build_compose
echo %INFO% Building all images with Docker Compose...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo %ERROR% Failed to build images with Docker Compose
    pause
    exit /b 1
)
echo %SUCCESS% All images built successfully with Docker Compose

:tag_images
echo %INFO% Tagging images for different environments...

REM Get timestamp for versioning
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIMESTAMP=%dt:~0,8%_%dt:~8,6%"

REM Tag backend images
docker tag veridia-backend:latest veridia-backend:dev
docker tag veridia-backend:latest veridia-backend:%TIMESTAMP%

REM Tag frontend images
docker tag veridia-frontend:latest veridia-frontend:dev
docker tag veridia-frontend:latest veridia-frontend:%TIMESTAMP%

echo %SUCCESS% Images tagged successfully
echo %INFO% Version tag: %TIMESTAMP%

REM Push images if requested
if "%~2"=="--push" (
    echo %INFO% Pushing images to registry...
    if defined DOCKER_REGISTRY (
        docker push %DOCKER_REGISTRY%/veridia-backend:latest
        docker push %DOCKER_REGISTRY%/veridia-backend:%TIMESTAMP%
        docker push %DOCKER_REGISTRY%/veridia-frontend:latest
        docker push %DOCKER_REGISTRY%/veridia-frontend:%TIMESTAMP%
        echo %SUCCESS% Images pushed to registry
    ) else (
        echo %WARNING% DOCKER_REGISTRY not set. Skipping push.
    )
)

REM Show image information
echo %INFO% Image information:
echo.
docker images | findstr veridia
echo.

echo %INFO% Image sizes:
for /f "tokens=4" %%a in ('docker images veridia-backend:latest --format "{{.Size}}"') do echo Backend: %%a
for /f "tokens=4" %%a in ('docker images veridia-frontend:latest --format "{{.Size}}"') do echo Frontend: %%a

echo.
echo %SUCCESS% Docker build process completed successfully!
echo.
echo %INFO% To start the application, run: docker-compose up -d
echo %INFO% To view logs, run: docker-compose logs -f

pause
