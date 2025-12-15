#!/bin/bash

# Veridia Hiring Platform Deployment Script
# This script automates the deployment process using Docker Compose

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your production values before continuing."
            print_warning "Especially update passwords, secrets, and email configuration."
            read -p "Press Enter after editing .env file..."
        else
            print_error ".env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    print_success ".env file found"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p nginx/ssl
    mkdir -p logs
    mkdir -p backups
    
    print_success "Directories created"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Stop existing services
    docker-compose -f docker-compose.prod.yml down || true
    
    # Build images
    print_status "Building Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for MySQL
    print_status "Waiting for MySQL..."
    while ! docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent; do
        echo "Waiting for MySQL..."
        sleep 5
    done
    print_success "MySQL is ready"
    
    # Wait for Backend
    print_status "Waiting for Backend..."
    while ! curl -f http://localhost:8080/api/health > /dev/null 2>&1; do
        echo "Waiting for Backend..."
        sleep 10
    done
    print_success "Backend is ready"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    while ! curl -f http://localhost/health > /dev/null 2>&1; do
        echo "Waiting for Frontend..."
        sleep 5
    done
    print_success "Frontend is ready"
}

# Run health checks
health_check() {
    print_status "Running health checks..."
    
    # Check MySQL
    if docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent; then
        print_success "MySQL: Healthy"
    else
        print_error "MySQL: Unhealthy"
    fi
    
    # Check Backend
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        print_success "Backend: Healthy"
    else
        print_error "Backend: Unhealthy"
    fi
    
    # Check Frontend
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Frontend: Healthy"
    else
        print_error "Frontend: Unhealthy"
    fi
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    print_status "Service URLs:"
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:8080/api"
    echo "Health Check: http://localhost:8080/api/health"
}

# Backup function
backup_data() {
    print_status "Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" veridia_hiring > "$BACKUP_DIR/database.sql"
    
    # Backup uploads
    docker cp veridia-backend-prod:/app/uploads "$BACKUP_DIR/uploads"
    
    print_success "Backup created in $BACKUP_DIR"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up old Docker images and containers..."
    
    docker system prune -f
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo "========================================"
    echo "  Veridia Hiring Platform Deployment"
    echo "========================================"
    
    check_docker
    check_env_file
    create_directories
    
    # Ask for deployment type
    echo "Choose deployment type:"
    echo "1) Fresh deployment"
    echo "2) Update existing deployment"
    echo "3) Backup and update"
    echo "4) Health check only"
    echo "5) Cleanup"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_services
            wait_for_services
            health_check
            show_status
            ;;
        2)
            deploy_services
            wait_for_services
            health_check
            show_status
            ;;
        3)
            backup_data
            deploy_services
            wait_for_services
            health_check
            show_status
            ;;
        4)
            health_check
            show_status
            ;;
        5)
            cleanup
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
}

# Run main function
main
