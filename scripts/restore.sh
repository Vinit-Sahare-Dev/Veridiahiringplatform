#!/bin/bash

# Veridia Hiring Platform Restore Script
# This script restores the application from a backup

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

# Check if backup file is provided
if [ $# -eq 0 ]; then
    print_error "Please provide a backup file or directory name"
    echo "Usage: $0 <backup_file.tar.gz> or $0 <backup_directory>"
    echo "Example: $0 backup_20231201_120000.tar.gz"
    echo "Example: $0 backup_20231201_120000"
    exit 1
fi

BACKUP_INPUT="$1"
BACKUP_DIR="backups"
RESTORE_DIR="restore_temp_$$"

# Check if backup exists
check_backup() {
    if [ -f "$BACKUP_DIR/$BACKUP_INPUT" ]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_INPUT"
        BACKUP_TYPE="file"
    elif [ -d "$BACKUP_DIR/$BACKUP_INPUT" ]; then
        BACKUP_PATH="$BACKUP_DIR/$BACKUP_INPUT"
        BACKUP_TYPE="directory"
    elif [ -f "$BACKUP_INPUT" ]; then
        BACKUP_FILE="$BACKUP_INPUT"
        BACKUP_TYPE="file"
    else
        print_error "Backup not found: $BACKUP_INPUT"
        echo "Available backups:"
        ls -la "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null || echo "No backup files found"
        exit 1
    fi
    
    print_success "Backup found: $BACKUP_INPUT"
}

# Extract backup if it's a compressed file
extract_backup() {
    if [ "$BACKUP_TYPE" = "file" ]; then
        print_status "Extracting backup..."
        mkdir -p "$RESTORE_DIR"
        cd "$RESTORE_DIR"
        tar -xzf "../$BACKUP_FILE"
        BACKUP_PATH=$(find . -name "backup_*" -type d | head -1)
        cd ..
        print_success "Backup extracted to: $RESTORE_DIR"
    else
        BACKUP_PATH="$BACKUP_DIR/$BACKUP_INPUT"
    fi
}

# Verify backup integrity
verify_backup() {
    print_status "Verifying backup integrity..."
    
    if [ ! -f "$BACKUP_PATH/manifest.txt" ]; then
        print_warning "No manifest file found, but continuing..."
    fi
    
    # Check for essential components
    if [ ! -d "$BACKUP_PATH/database" ]; then
        print_error "Database backup not found"
        exit 1
    fi
    
    print_success "Backup integrity verified"
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    
    docker-compose -f docker-compose.prod.yml down || true
    
    # Wait for services to stop
    sleep 5
    
    print_success "Services stopped"
}

# Restore database
restore_database() {
    print_status "Restoring database..."
    
    # Start MySQL only
    docker-compose -f docker-compose.prod.yml up -d mysql
    
    # Wait for MySQL to be ready
    print_status "Waiting for MySQL to be ready..."
    while ! docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent; do
        echo "Waiting for MySQL..."
        sleep 5
    done
    
    # Get database credentials
    source .env 2>/dev/null || true
    
    # Drop existing database and recreate
    docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "DROP DATABASE IF EXISTS veridia_hiring;"
    docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE veridia_hiring;"
    
    # Restore database
    if [ -f "$BACKUP_PATH/database/veridia_hiring.sql.gz" ]; then
        gunzip -c "$BACKUP_PATH/database/veridia_hiring.sql.gz" | docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" veridia_hiring
    elif [ -f "$BACKUP_PATH/database/veridia_hiring.sql" ]; then
        docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" veridia_hiring < "$BACKUP_PATH/database/veridia_hiring.sql"
    else
        print_error "Database backup file not found"
        exit 1
    fi
    
    print_success "Database restored"
}

# Restore uploaded files
restore_uploads() {
    print_status "Restoring uploaded files..."
    
    if [ -f "$BACKUP_PATH/uploads_backup_"*.tar.gz ]; then
        # Extract uploads backup
        cd "$BACKUP_PATH"
        tar -xzf uploads_backup_*.tar.gz
        cd ..
        
        # Copy uploads to backend container (will be created when backend starts)
        mkdir -p uploads_temp
        cp -r "$BACKUP_PATH/uploads/" uploads_temp/
        
        print_success "Uploads files prepared for restoration"
    else
        print_warning "No uploads backup found"
    fi
}

# Restore configuration
restore_config() {
    print_status "Restoring configuration..."
    
    # Restore environment file
    if [ -f "$BACKUP_PATH/config/.env" ]; then
        print_warning "Found .env file in backup. Do you want to restore it?"
        read -p "This will overwrite current .env file. Restore? (y/N): " restore_env
        if [[ $restore_env =~ ^[Yy]$ ]]; then
            cp "$BACKUP_PATH/config/.env" .env
            print_success "Environment file restored"
        else
            print_status "Skipping .env file restoration"
        fi
    fi
    
    # Restore SSL certificates
    if [ -d "$BACKUP_PATH/config/ssl" ]; then
        mkdir -p nginx/ssl
        cp -r "$BACKUP_PATH/config/ssl/"* nginx/ssl/
        print_success "SSL certificates restored"
    fi
    
    # Restore nginx configuration
    if [ -f "$BACKUP_PATH/config/nginx.conf" ]; then
        cp "$BACKUP_PATH/config/nginx.conf" frontend/
        print_success "Nginx configuration restored"
    fi
    
    print_success "Configuration restored"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start all services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    
    # Wait for backend
    while ! curl -f http://localhost:8080/api/health > /dev/null 2>&1; do
        echo "Waiting for Backend..."
        sleep 10
    done
    
    # Wait for frontend
    while ! curl -f http://localhost/health > /dev/null 2>&1; do
        echo "Waiting for Frontend..."
        sleep 5
    done
    
    print_success "Services started"
}

# Restore uploads to running container
restore_uploads_to_container() {
    print_status "Restoring uploads to running container..."
    
    if [ -d "uploads_temp/uploads" ]; then
        # Copy uploads to backend container
        docker cp uploads_temp/uploads/. veridia-backend-prod:/app/uploads/
        
        # Set proper permissions
        docker-compose -f docker-compose.prod.yml exec -T backend chown -R appuser:appuser /app/uploads
        
        # Clean up temp files
        rm -rf uploads_temp
        
        print_success "Uploads restored to container"
    fi
}

# Verify restore
verify_restore() {
    print_status "Verifying restore..."
    
    # Check database
    if docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "USE veridia_hiring; SHOW TABLES;" > /dev/null 2>&1; then
        print_success "Database verification passed"
    else
        print_error "Database verification failed"
        return 1
    fi
    
    # Check services
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Frontend health check passed"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    print_success "Restore verification completed"
}

# Cleanup
cleanup() {
    print_status "Cleaning up temporary files..."
    
    if [ -d "$RESTORE_DIR" ]; then
        rm -rf "$RESTORE_DIR"
    fi
    
    if [ -d "uploads_temp" ]; then
        rm -rf uploads_temp
    fi
    
    print_success "Cleanup completed"
}

# Show restore summary
show_summary() {
    echo
    print_success "Restore completed successfully!"
    echo
    echo "Restore Summary:"
    echo "==============="
    echo "Backup used: $BACKUP_INPUT"
    echo "Restore date: $(date)"
    echo "Services: All services restored and running"
    echo
    echo "Service URLs:"
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:8080/api"
    echo "Health Check: http://localhost:8080/api/health"
    echo
    echo "Next Steps:"
    echo "1. Verify all data is correct"
    echo "2. Test application functionality"
    echo "3. Check uploaded files are accessible"
    echo "4. Monitor application logs"
}

# Main restore function
main() {
    echo "========================================"
    echo "  Veridia Hiring Platform Restore"
    echo "========================================"
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found. Please run this script from the project root."
        exit 1
    fi
    
    # Warning about data loss
    print_warning "This will replace all current data with the backup!"
    read -p "Are you sure you want to continue? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_status "Restore cancelled"
        exit 0
    fi
    
    # Perform restore operations
    check_backup
    extract_backup
    verify_backup
    stop_services
    restore_database
    restore_uploads
    restore_config
    start_services
    restore_uploads_to_container
    verify_restore
    cleanup
    show_summary
}

# Run main function with cleanup on exit
trap cleanup EXIT
main
