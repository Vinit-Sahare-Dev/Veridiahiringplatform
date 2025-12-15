#!/bin/bash

# Veridia Hiring Platform Backup Script
# This script creates comprehensive backups of the application

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

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP_DIR="$BACKUP_DIR/backup_$TIMESTAMP"

# Create backup directory
create_backup_dir() {
    print_status "Creating backup directory: $CURRENT_BACKUP_DIR"
    mkdir -p "$CURRENT_BACKUP_DIR"
    mkdir -p "$CURRENT_BACKUP_DIR/database"
    mkdir -p "$CURRENT_BACKUP_DIR/uploads"
    mkdir -p "$CURRENT_BACKUP_DIR/config"
    mkdir -p "$CURRENT_BACKUP_DIR/logs"
    
    print_success "Backup directory created"
}

# Backup database
backup_database() {
    print_status "Backing up database..."
    
    # Check if MySQL container is running
    if ! docker-compose -f docker-compose.prod.yml ps mysql | grep -q "Up"; then
        print_error "MySQL container is not running"
        return 1
    fi
    
    # Get database credentials from environment
    source .env 2>/dev/null || true
    
    # Create database backup
    docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump \
        -u root \
        -p"$MYSQL_ROOT_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        veridia_hiring > "$CURRENT_BACKUP_DIR/database/veridia_hiring.sql"
    
    # Compress the backup
    gzip "$CURRENT_BACKUP_DIR/database/veridia_hiring.sql"
    
    print_success "Database backup completed"
}

# Backup uploaded files
backup_uploads() {
    print_status "Backing up uploaded files..."
    
    # Check if backend container is running
    if ! docker-compose -f docker-compose.prod.yml ps backend | grep -q "Up"; then
        print_warning "Backend container is not running, skipping uploads backup"
        return 0
    fi
    
    # Copy uploads from container
    docker cp veridia-backend-prod:/app/uploads "$CURRENT_BACKUP_DIR/uploads/"
    
    # Create tar archive
    cd "$CURRENT_BACKUP_DIR"
    tar -czf "uploads_backup_$TIMESTAMP.tar.gz" uploads/
    rm -rf uploads/
    cd - > /dev/null
    
    print_success "Uploads backup completed"
}

# Backup configuration files
backup_config() {
    print_status "Backing up configuration files..."
    
    # Backup environment file
    if [ -f .env ]; then
        cp .env "$CURRENT_BACKUP_DIR/config/.env"
    fi
    
    # Backup Docker compose files
    cp docker-compose.yml "$CURRENT_BACKUP_DIR/config/" 2>/dev/null || true
    cp docker-compose.prod.yml "$CURRENT_BACKUP_DIR/config/" 2>/dev/null || true
    
    # Backup SSL certificates if they exist
    if [ -d nginx/ssl ]; then
        cp -r nginx/ssl "$CURRENT_BACKUP_DIR/config/"
    fi
    
    # Backup nginx configuration
    cp frontend/nginx.conf "$CURRENT_BACKUP_DIR/config/" 2>/dev/null || true
    cp nginx.conf "$CURRENT_BACKUP_DIR/config/" 2>/dev/null || true
    
    print_success "Configuration backup completed"
}

# Backup logs
backup_logs() {
    print_status "Backing up logs..."
    
    # Check if containers are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        # Collect logs from all containers
        docker-compose -f docker-compose.prod.yml logs --no-color > "$CURRENT_BACKUP_DIR/logs/docker_compose_logs_$TIMESTAMP.log"
        
        # Copy application logs from backend
        if docker-compose -f docker-compose.prod.yml ps backend | grep -q "Up"; then
            docker cp veridia-backend-prod:/app/logs "$CURRENT_BACKUP_DIR/logs/" 2>/dev/null || true
        fi
    fi
    
    print_success "Logs backup completed"
}

# Create backup manifest
create_manifest() {
    print_status "Creating backup manifest..."
    
    cat > "$CURRENT_BACKUP_DIR/manifest.txt" << EOF
Backup Information
==================
Backup Date: $(date)
Backup Type: Full Application Backup
Hostname: $(hostname)
User: $(whoami)

Backup Contents:
- Database: MySQL database dump
- Uploads: User uploaded files (resumes, etc.)
- Configuration: Environment files, SSL certificates, nginx config
- Logs: Application and Docker logs

Files:
$(find "$CURRENT_BACKUP_DIR" -type f -exec ls -lh {} \; | awk '{print $5, $9}')

Total Size: $(du -sh "$CURRENT_BACKUP_DIR" | cut -f1)

Restore Instructions:
1. Stop all services: docker-compose -f docker-compose.prod.yml down
2. Run restore script: ./scripts/restore.sh backup_$TIMESTAMP
3. Start services: docker-compose -f docker-compose.prod.yml up -d
EOF
    
    print_success "Backup manifest created"
}

# Compress entire backup
compress_backup() {
    print_status "Compressing backup..."
    
    cd "$BACKUP_DIR"
    tar -czf "backup_$TIMESTAMP.tar.gz" "backup_$TIMESTAMP/"
    rm -rf "backup_$TIMESTAMP/"
    cd - > /dev/null
    
    print_success "Backup compressed: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
}

# Cleanup old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups..."
    
    # Keep last 7 backups
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f -mtime +7 -delete
    
    # Also remove any uncompressed backup directories
    find "$BACKUP_DIR" -name "backup_*" -type d -mtime +1 -exec rm -rf {} + 2>/dev/null || true
    
    print_success "Old backups cleaned up"
}

# Main backup function
main() {
    echo "========================================"
    echo "  Veridia Hiring Platform Backup"
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
    
    # Create backup directory
    create_backup_dir
    
    # Perform backup operations
    backup_database
    backup_uploads
    backup_config
    backup_logs
    create_manifest
    
    # Compress backup
    compress_backup
    
    # Cleanup old backups
    cleanup_old_backups
    
    echo
    print_success "Backup completed successfully!"
    print_status "Backup location: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    print_status "Backup size: $(du -sh "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" | cut -f1)"
    
    # Show backup info
    echo
    echo "Backup Summary:"
    echo "==============="
    echo "File: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
    echo "Size: $(du -sh "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" | cut -f1)"
    echo "Created: $(date)"
    echo "Contents: Database, Uploads, Configuration, Logs"
}

# Run main function
main
