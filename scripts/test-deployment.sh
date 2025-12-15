#!/bin/bash

# Veridia Hiring Platform Deployment Test Script
# This script tests the deployment to ensure everything is working correctly

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    ((TESTS_PASSED++))
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((TESTS_FAILED++))
}

print_test_header() {
    echo
    echo "========================================"
    echo "  $1"
    echo "========================================"
}

# Test Docker connectivity
test_docker() {
    print_test_header "Docker Connectivity Test"
    
    if docker info > /dev/null 2>&1; then
        print_success "Docker is running"
    else
        print_error "Docker is not running"
        return 1
    fi
    
    if docker-compose --version > /dev/null 2>&1; then
        print_success "Docker Compose is available"
    else
        print_error "Docker Compose is not available"
        return 1
    fi
}

# Test service status
test_services() {
    print_test_header "Service Status Test"
    
    # Check if containers are running
    services=("mysql" "backend" "frontend")
    
    for service in "${services[@]}"; do
        if docker-compose -f docker-compose.prod.yml ps "$service" | grep -q "Up"; then
            print_success "$service container is running"
        else
            print_error "$service container is not running"
        fi
    done
}

# Test database connectivity
test_database() {
    print_test_header "Database Connectivity Test"
    
    # Wait for MySQL to be ready
    print_status "Waiting for MySQL to be ready..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h localhost --silent > /dev/null 2>&1; then
            print_success "MySQL is responding"
            break
        else
            if [ $attempt -eq $max_attempts ]; then
                print_error "MySQL is not responding after $max_attempts attempts"
                return 1
            fi
            echo "Attempt $attempt/$max_attempts - Waiting for MySQL..."
            sleep 5
            ((attempt++))
        fi
    done
    
    # Test database connection
    if docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
    fi
    
    # Check if database exists
    if docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "USE veridia_hiring; SHOW TABLES;" > /dev/null 2>&1; then
        print_success "Database and tables exist"
    else
        print_error "Database or tables not found"
    fi
}

# Test backend API
test_backend() {
    print_test_header "Backend API Test"
    
    # Wait for backend to be ready
    print_status "Waiting for backend to be ready..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
            print_success "Backend health endpoint is responding"
            break
        else
            if [ $attempt -eq $max_attempts ]; then
                print_error "Backend is not responding after $max_attempts attempts"
                return 1
            fi
            echo "Attempt $attempt/$max_attempts - Waiting for backend..."
            sleep 10
            ((attempt++))
        fi
    done
    
    # Test health endpoint response
    health_response=$(curl -s http://localhost:8080/api/health 2>/dev/null)
    if echo "$health_response" | grep -q "OK"; then
        print_success "Health endpoint returns correct status"
    else
        print_error "Health endpoint response incorrect"
    fi
    
    # Test CORS headers
    cors_response=$(curl -s -H "Origin: http://localhost" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8080/api/health 2>/dev/null)
    if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
        print_success "CORS headers are present"
    else
        print_warning "CORS headers may not be properly configured"
    fi
}

# Test frontend
test_frontend() {
    print_test_header "Frontend Test"
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend to be ready..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/health > /dev/null 2>&1; then
            print_success "Frontend health endpoint is responding"
            break
        else
            if [ $attempt -eq $max_attempts ]; then
                print_error "Frontend is not responding after $max_attempts attempts"
                return 1
            fi
            echo "Attempt $attempt/$max_attempts - Waiting for frontend..."
            sleep 5
            ((attempt++))
        fi
    done
    
    # Test main page
    if curl -f http://localhost/ > /dev/null 2>&1; then
        print_success "Frontend main page is accessible"
    else
        print_error "Frontend main page is not accessible"
    fi
    
    # Test static assets
    if curl -f http://localhost/favicon.ico > /dev/null 2>&1; then
        print_success "Static assets are accessible"
    else
        print_warning "Some static assets may not be accessible"
    fi
}

# Test application functionality
test_application() {
    print_test_header "Application Functionality Test"
    
    # Test job listings endpoint
    if curl -f http://localhost:8080/api/jobs > /dev/null 2>&1; then
        print_success "Jobs API endpoint is working"
    else
        print_error "Jobs API endpoint is not working"
    fi
    
    # Test authentication endpoint
    auth_response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test"}' http://localhost:8080/api/auth/login 2>/dev/null)
    if echo "$auth_response" | grep -q "token\|error"; then
        print_success "Authentication endpoint is responding"
    else
        print_warning "Authentication endpoint may have issues"
    fi
}

# Test file uploads
test_uploads() {
    print_test_header "File Upload Test"
    
    # Check if uploads directory exists in container
    if docker-compose -f docker-compose.prod.yml exec -T backend ls /app/uploads > /dev/null 2>&1; then
        print_success "Uploads directory exists"
    else
        print_warning "Uploads directory may not exist"
    fi
    
    # Test file upload permissions
    if docker-compose -f docker-compose.prod.yml exec -T backend test -w /app/uploads; then
        print_success "Uploads directory is writable"
    else
        print_warning "Uploads directory may not be writable"
    fi
}

# Test email configuration
test_email() {
    print_test_header "Email Configuration Test"
    
    # Test email endpoint
    email_response=$(curl -s http://localhost:8080/api/test/email 2>/dev/null)
    if echo "$email_response" | grep -q "success\|error"; then
        print_success "Email test endpoint is responding"
    else
        print_warning "Email configuration may need attention"
    fi
}

# Test security headers
test_security() {
    print_test_header "Security Headers Test"
    
    # Test security headers on frontend
    headers=$(curl -s -I http://localhost/ 2>/dev/null)
    
    if echo "$headers" | grep -q "X-Frame-Options"; then
        print_success "X-Frame-Options header present"
    else
        print_warning "X-Frame-Options header missing"
    fi
    
    if echo "$headers" | grep -q "X-Content-Type-Options"; then
        print_success "X-Content-Type-Options header present"
    else
        print_warning "X-Content-Type-Options header missing"
    fi
    
    if echo "$headers" | grep -q "X-XSS-Protection"; then
        print_success "X-XSS-Protection header present"
    else
        print_warning "X-XSS-Protection header missing"
    fi
}

# Test resource usage
test_resources() {
    print_test_header "Resource Usage Test"
    
    # Check container resource usage
    if docker stats --no-stream | grep -q "veridia"; then
        print_success "Container resource stats available"
        
        # Check for high memory usage
        memory_usage=$(docker stats --no-stream --format "table {{.MemUsage}}" | grep veridia | awk '{print $1}' | cut -d'/' -f1)
        if [ -n "$memory_usage" ]; then
            print_status "Memory usage: $memory_usage"
        fi
    else
        print_warning "Unable to retrieve resource stats"
    fi
}

# Generate test report
generate_report() {
    print_test_header "Test Results Summary"
    
    echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
    echo "Passed: $TESTS_PASSED"
    echo "Failed: $TESTS_FAILED"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo
        print_success "All tests passed! Deployment is ready."
        echo
        echo "Service URLs:"
        echo "- Frontend: http://localhost"
        echo "- Backend API: http://localhost:8080/api"
        echo "- Health Check: http://localhost:8080/api/health"
    else
        echo
        print_error "Some tests failed. Please review the issues above."
        echo
        echo "Common fixes:"
        echo "- Check container logs: docker-compose -f docker-compose.prod.yml logs"
        echo "- Restart services: docker-compose -f docker-compose.prod.yml restart"
        echo "- Verify environment variables in .env file"
        echo "- Check network connectivity and firewall settings"
    fi
}

# Main test function
main() {
    echo "========================================"
    echo "  Veridia Hiring Platform Deployment Test"
    echo "========================================"
    
    # Check if we're in the right directory
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found. Please run this script from the project root."
        exit 1
    fi
    
    # Load environment variables
    if [ -f .env ]; then
        export $(grep -v '^#' .env | xargs)
        print_success "Environment variables loaded"
    else
        print_warning ".env file not found. Some tests may fail."
    fi
    
    # Run tests
    test_docker
    test_services
    test_database
    test_backend
    test_frontend
    test_application
    test_uploads
    test_email
    test_security
    test_resources
    
    # Generate report
    generate_report
    
    # Exit with appropriate code
    if [ $TESTS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main
