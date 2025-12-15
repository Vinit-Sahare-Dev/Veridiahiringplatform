# Docker Images Guide

This document provides comprehensive information about building and managing Docker images for the Veridia Hiring Platform.

## Overview

The platform consists of three main Docker images:
- **veridia-backend**: Spring Boot API service
- **veridia-frontend**: React web application with Nginx
- **mysql**: MySQL 8.0 database (using official image)

## Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Sufficient disk space (~2GB for all images)

### Build All Images
```bash
# Using the build script (recommended)
./scripts/build-docker.sh

# Or using docker-compose directly
docker-compose build --no-cache
```

### Start the Application
```bash
docker-compose up -d
```

## Build Options

### 1. Individual Component Builds

#### Backend Only
```bash
./scripts/build-docker.sh backend
```

#### Frontend Only
```bash
./scripts/build-docker.sh frontend
```

#### Using Docker Compose
```bash
./scripts/build-docker.sh compose
```

### 2. Environment-Specific Builds

#### Development
```bash
# Build with development optimizations
docker-compose -f docker-compose.yml build
```

#### Production
```bash
# Build with production optimizations
docker-compose -f docker-compose.prod.yml build
```

## Image Details

### Backend Image (veridia-backend)

**Base Image**: OpenJDK 17 JRE Slim
**Size**: ~400MB
**Features**:
- Multi-stage build for optimization
- Non-root user execution
- Health checks enabled
- JVM optimizations for containers
- Security hardening

**Build Process**:
1. Maven build stage (downloads dependencies, compiles code)
2. Production stage (copies JAR, sets up runtime environment)

**Exposed Ports**: 8080
**Health Check**: `/api/health`
**Environment Variables**:
- `SPRING_PROFILES_ACTIVE`: Set to 'production'
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: Database connection
- `JWT_SECRET`, `JWT_EXPIRATION`: Security settings
- Mail configuration variables

### Frontend Image (veridia-frontend)

**Base Image**: Nginx Alpine
**Size**: ~50MB
**Features**:
- Multi-stage build (Node.js build + Nginx serving)
- Optimized for production
- Gzip compression enabled
- Security headers configured
- Static asset caching
- Non-root user execution

**Build Process**:
1. Node.js build stage (installs dependencies, builds React app)
2. Nginx serving stage (serves static files with optimizations)

**Exposed Ports**: 80
**Health Check**: `/health`
**Configuration**: Custom nginx.conf with optimizations

### Database Image (mysql:8.0)

**Base Image**: MySQL 8.0 Official
**Size**: ~500MB
**Features**:
- Persistent data volume
- Initialization scripts
- Health checks enabled
- Optimized for production

**Exposed Ports**: 3306
**Environment Variables**:
- `MYSQL_ROOT_PASSWORD`: Root password
- `MYSQL_DATABASE`: Database name
- `MYSQL_USER`, `MYSQL_PASSWORD`: Application user

## Image Optimization

### Backend Optimizations
- **Multi-stage build**: Reduces final image size by excluding build dependencies
- **JVM Tuning**: Optimized for container environments
- **Security**: Non-root user, minimal attack surface
- **Health Checks**: Automated monitoring capabilities

### Frontend Optimizations
- **Static Asset Caching**: Long-term caching for CSS/JS/images
- **Gzip Compression**: Reduced bandwidth usage
- **Security Headers**: Protection against common vulnerabilities
- **SPA Routing**: Proper handling of client-side routing

## Environment Configuration

### Development Environment
```bash
# Create .env file from example
cp .env.example .env

# Edit configuration
nano .env
```

### Production Environment
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

## Image Management

### List Images
```bash
docker images | grep veridia
```

### Remove Images
```bash
# Remove specific image
docker rmi veridia-backend:latest

# Remove all veridia images
docker rmi $(docker images | grep veridia | awk '{print $3}')
```

### Clean Up
```bash
# Remove unused images
docker image prune -f

# Remove all unused containers, networks, images
docker system prune -a
```

## Version Management

### Automatic Versioning
Images are automatically tagged with timestamps:
```bash
veridia-backend:20231215_143022
veridia-frontend:20231215_143022
```

### Manual Tagging
```bash
# Tag specific version
docker tag veridia-backend:latest veridia-backend:v1.0.0

# Tag for registry
docker tag veridia-backend:latest myregistry.com/veridia-backend:latest
```

## Registry Push

### Setup Registry
```bash
# Login to registry
docker login myregistry.com

# Set registry environment variable
export DOCKER_REGISTRY=myregistry.com
```

### Push Images
```bash
# Push with build script
./scripts/build-docker.sh all --push

# Or push manually
docker push myregistry.com/veridia-backend:latest
docker push myregistry.com/veridia-frontend:latest
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check logs
docker-compose build --no-cache

# Clear Docker cache
docker builder prune -a
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8080

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Use different host port
```

#### Permission Issues
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER /var/run/docker.sock

# Or run with sudo
sudo docker-compose up -d
```

#### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a
```

### Debug Commands

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Inspect Containers
```bash
# Container details
docker inspect veridia-backend

# Shell access to container
docker exec -it veridia-backend sh
```

#### Health Status
```bash
# Check health
docker-compose ps

# Health check details
docker inspect veridia-backend | grep Health -A 10
```

## Performance Monitoring

### Resource Usage
```bash
# Real-time stats
docker stats

# Specific container
docker stats veridia-backend
```

### Image Size Analysis
```bash
# Image layers
docker history veridia-backend

# Image size breakdown
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

## Security Best Practices

### Image Scanning
```bash
# Scan for vulnerabilities (requires trivy)
trivy image veridia-backend:latest
trivy image veridia-frontend:latest
```

### Security Updates
```bash
# Update base images
docker pull maven:3.9-openjdk-17
docker pull node:18-alpine
docker pull nginx:alpine

# Rebuild with updated base images
./scripts/build-docker.sh all
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build Docker Images
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: ./scripts/build-docker.sh all
      - name: Push to registry
        run: ./scripts/build-docker.sh all --push
        env:
          DOCKER_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh './scripts/build-docker.sh all'
            }
        }
        stage('Push') {
            steps {
                sh './scripts/build-docker.sh all --push'
            }
        }
    }
}
```

## Backup and Recovery

### Image Backup
```bash
# Save images
docker save veridia-backend:latest | gzip > backend-backup.tar.gz
docker save veridia-frontend:latest | gzip > frontend-backup.tar.gz
```

### Image Recovery
```bash
# Load images
docker load < backend-backup.tar.gz
docker load < frontend-backup.tar.gz
```

## Migration

### Between Environments
```bash
# Export images
docker save veridia-backend:latest > backend.tar
docker save veridia-frontend:latest > frontend.tar

# Transfer to new server
scp backend.tar frontend.tar user@server:/tmp/

# Import on new server
docker load < /tmp/backend.tar
docker load < /tmp/frontend.tar
```

## Support

For issues related to Docker images:
1. Check the troubleshooting section
2. Review container logs
3. Verify environment configuration
4. Check Docker resource allocation

Additional resources:
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Deployment](https://reactjs.org/docs/deployment.html)
