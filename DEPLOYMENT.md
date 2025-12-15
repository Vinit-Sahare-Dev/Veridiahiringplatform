# Veridia Hiring Platform - Deployment Guide

This guide provides comprehensive instructions for deploying the Veridia Hiring Platform using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Production Deployment](#production-deployment)
5. [SSL/HTTPS Configuration](#sslhttps-configuration)
6. [Monitoring and Health Checks](#monitoring-and-health-checks)
7. [Backup and Recovery](#backup-and-recovery)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

## Prerequisites

### System Requirements

- **Operating System**: Linux, macOS, or Windows with Docker Desktop
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: Minimum 20GB free space
- **Network**: Stable internet connection

### Software Installation

#### Docker Installation (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin
```

#### Docker Installation (CentOS/RHEL)
```bash
# Install Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Docker Desktop (Windows/macOS)
Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop

## Environment Configuration

### 1. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your production values:

```bash
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=veridia_hiring
MYSQL_USER=veridia
MYSQL_PASSWORD=your_secure_db_password_here
DB_HOST=mysql
DB_PORT=3306
DB_NAME=veridia_hiring
DB_USERNAME=veridia
DB_PASSWORD=your_secure_db_password_here

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-here-change-in-production-minimum-32-characters
JWT_EXPIRATION=86400000

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. SSL Certificates (Optional but Recommended)

For HTTPS, place your SSL certificates in the `nginx/ssl/` directory:

```bash
mkdir -p nginx/ssl
# Place your certificates here:
# nginx/ssl/cert.pem
# nginx/ssl/key.pem
```

## Deployment Options

### Option 1: Automated Deployment (Recommended)

Use the provided deployment scripts:

#### Linux/macOS
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### Windows
```cmd
scripts\deploy.bat
```

The script will guide you through:
- Fresh deployment
- Update existing deployment
- Backup and update
- Health check only
- Cleanup

### Option 2: Manual Deployment

#### Step 1: Build and Start Services
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Step 2: Verify Services
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Step 3: Health Checks
```bash
# Backend health check
curl http://localhost:8080/api/health

# Frontend health check
curl http://localhost/health
```

## Production Deployment

### 1. Production Docker Compose

The production configuration includes:

- **MySQL 8.0**: Production database with persistent storage
- **Backend**: Spring Boot application with production optimizations
- **Frontend**: Nginx serving optimized React build
- **Redis**: Optional caching layer
- **Logging**: Centralized logging with log rotation
- **Health Checks**: Automated health monitoring

### 2. Production Optimizations

#### Backend Optimizations
- Connection pooling (HikariCP)
- Production logging configuration
- Security headers
- Health check endpoints
- Memory management

#### Frontend Optimizations
- Gzip compression
- Static asset caching
- Security headers
- SSL termination (if certificates provided)

#### Database Optimizations
- Connection pooling
- Query optimization
- Index management
- Regular backups

## SSL/HTTPS Configuration

### Option 1: Using Your Own Certificates

1. Place certificates in `nginx/ssl/`:
   ```
   nginx/ssl/cert.pem  # Your SSL certificate
   nginx/ssl/key.pem   # Your private key
   ```

2. Update `nginx/nginx.conf` for HTTPS:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /etc/nginx/ssl/cert.pem;
       ssl_certificate_key /etc/nginx/ssl/key.pem;
       
       # SSL configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
       ssl_prefer_server_ciphers off;
       
       # ... rest of configuration
   }
   ```

### Option 2: Using Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Health Checks

### Health Check Endpoints

- **Backend**: `GET /api/health`
- **Frontend**: `GET /health`
- **Database**: MySQL health check via Docker

### Monitoring Commands

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f mysql

# Resource usage
docker stats

# Disk usage
docker system df
```

### Log Management

Logs are configured with rotation:
- **Max file size**: 10MB
- **Max files**: 3 per service
- **Location**: Docker logs + application logs in `/app/logs`

## Backup and Recovery

### Automated Backup Script

```bash
# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup_20231201_120000
```

### Manual Backup

```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p veridia_hiring > backup.sql

# Backup uploads
docker cp veridia-backend-prod:/app/uploads ./uploads_backup

# Backup entire deployment
docker-compose -f docker-compose.prod.yml down
tar -czf full_backup_$(date +%Y%m%d).tar.gz .env uploads/ nginx/ssl/
```

### Recovery

```bash
# Restore database
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p veridia_hiring < backup.sql

# Restore uploads
docker cp ./uploads_backup veridia-backend-prod:/app/uploads
```

## Troubleshooting

### Common Issues

#### 1. Services Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check resource usage
docker stats

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### 2. Database Connection Issues
```bash
# Check MySQL status
docker-compose -f docker-compose.prod.yml exec mysql mysqladmin ping

# Test database connection
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

#### 3. Frontend Not Loading
```bash
# Check Nginx status
docker-compose -f docker-compose.prod.yml exec frontend nginx -t

# Check Nginx logs
docker-compose -f docker-compose.prod.yml logs frontend
```

#### 4. SSL Certificate Issues
```bash
# Verify certificate
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL configuration
docker-compose -f docker-compose.prod.yml exec frontend nginx -t
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Optimize Docker
docker system prune -a

# Monitor database
docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p -e "SHOW PROCESSLIST;"
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` file to version control
- Use strong, unique passwords
- Regularly rotate secrets
- Use environment-specific configurations

### 2. Network Security
- Configure firewall rules
- Use VPN for remote access
- Implement rate limiting
- Regular security updates

### 3. Application Security
- Keep dependencies updated
- Use HTTPS in production
- Implement security headers
- Regular security audits

### 4. Database Security
- Limit database access
- Use strong passwords
- Regular backups
- Monitor for suspicious activity

## Maintenance

### Regular Tasks

1. **Daily**:
   - Check service health
   - Review logs for errors
   - Monitor resource usage

2. **Weekly**:
   - Update security patches
   - Review backup status
   - Clean up old logs

3. **Monthly**:
   - Update Docker images
   - Review SSL certificates
   - Performance optimization

### Update Process

```bash
# 1. Create backup
./scripts/backup.sh

# 2. Pull latest changes
git pull origin main

# 3. Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify deployment
./scripts/deploy.sh  # Choose option 4 for health check
```

## Support

For deployment issues:

1. Check this documentation first
2. Review logs for error messages
3. Check the troubleshooting section
4. Create an issue in the project repository

---

**Note**: This deployment guide assumes you have administrative access to the deployment server and basic understanding of Docker and web applications.
