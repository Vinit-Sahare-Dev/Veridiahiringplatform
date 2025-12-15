#!/bin/bash

# Docker Build Script for Veridia Hiring Platform
# This script builds Docker images for the full-stack application

set -e

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
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please update the .env file with your configuration"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    fi
}

# Clean up previous builds
cleanup() {
    print_status "Cleaning up previous builds..."
    
    # Stop and remove existing containers
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Remove dangling images
    docker image prune -f 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Build backend image
build_backend() {
    print_status "Building backend image..."
    
    cd backend
    
    # Build the backend Docker image
    docker build -t veridia-backend:latest .
    
    if [ $? -eq 0 ]; then
        print_success "Backend image built successfully"
    else
        print_error "Failed to build backend image"
        exit 1
    fi
    
    cd ..
}

# Build frontend image
build_frontend() {
    print_status "Building frontend image..."
    
    cd frontend
    
    # Build the frontend Docker image
    docker build -t veridia-frontend:latest .
    
    if [ $? -eq 0 ]; then
        print_success "Frontend image built successfully"
    else
        print_error "Failed to build frontend image"
        exit 1
    fi
    
    cd ..
}

# Build all images using docker-compose
build_with_compose() {
    print_status "Building all images with Docker Compose..."
    
    # Build images without starting containers
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        print_success "All images built successfully with Docker Compose"
    else
        print_error "Failed to build images with Docker Compose"
        exit 1
    fi
}

# Tag images for different environments
tag_images() {
    print_status "Tagging images for different environments..."
    
    # Get current timestamp for versioning
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    # Tag backend images
    docker tag veridia-backend:latest veridia-backend:dev
    docker tag veridia-backend:latest veridia-backend:$TIMESTAMP
    
    # Tag frontend images
    docker tag veridia-frontend:latest veridia-frontend:dev
    docker tag veridia-frontend:latest veridia-frontend:$TIMESTAMP
    
    print_success "Images tagged successfully"
    print_status "Version tag: $TIMESTAMP"
}

# Push images to registry (optional)
push_images() {
    if [ "$1" = "--push" ]; then
        print_status "Pushing images to registry..."
        
        # Check if registry is configured
        if [ -z "$DOCKER_REGISTRY" ]; then
            print_warning "DOCKER_REGISTRY not set. Skipping push."
            return
        fi
        
        # Push backend
        docker push $DOCKER_REGISTRY/veridia-backend:latest
        docker push $DOCKER_REGISTRY/veridia-backend:$TIMESTAMP
        
        # Push frontend
        docker push $DOCKER_REGISTRY/veridia-frontend:latest
        docker push $DOCKER_REGISTRY/veridia-frontend:$TIMESTAMP
        
        print_success "Images pushed to registry"
    fi
}

# Show image information
show_image_info() {
    print_status "Image information:"
    echo ""
    docker images | grep veridia
    echo ""
    
    print_status "Image sizes:"
    echo "Backend: $(docker images veridia-backend:latest --format "table {{.Size}}")"
    echo "Frontend: $(docker images veridia-frontend:latest --format "table {{.Size}}")"
}

# Main execution
main() {
    print_status "Starting Docker build process for Veridia Hiring Platform..."
    echo ""
    
    # Check prerequisites
    check_docker
    check_env_file
    
    # Clean up
    cleanup
    
    # Build options
    case "${1:-all}" in
        "backend")
            build_backend
            ;;
        "frontend")
            build_frontend
            ;;
        "compose"|"all")
            build_with_compose
            ;;
        *)
            print_error "Invalid option: $1"
            echo "Usage: $0 [backend|frontend|compose|all] [--push]"
            exit 1
            ;;
    esac
    
    # Tag images
    tag_images
    
    # Push if requested
    if [ "$2" = "--push" ] || [ "$1" = "--push" ]; then
        push_images --push
    fi
    
    # Show image information
    show_image_info
    
    print_success "Docker build process completed successfully!"
    echo ""
    print_status "To start the application, run: docker-compose up -d"
    print_status "To view logs, run: docker-compose logs -f"
}

# Handle script interruption
trap 'print_error "Build process interrupted"; exit 1' INT

# Run main function with all arguments
main "$@"
