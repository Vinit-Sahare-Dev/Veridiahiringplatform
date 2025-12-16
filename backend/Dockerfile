# Build stage
FROM maven:3.9-openjdk-17 AS build

WORKDIR /app

# Copy pom.xml first for better dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B || echo "Dependencies download failed, continuing..."

# Copy source code
COPY src ./src

# Build the application with better error handling
RUN mvn clean package -DskipTests -Dmaven.test.skip=true -Dmaven.javadoc.skip=true || \
    mvn clean package -DskipTests -Dmaven.test.skip=true -Dmaven.javadoc.skip=true -X

# Production stage
FROM openjdk:17-jdk-slim AS production

# Install necessary packages and clean up
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create application user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Create necessary directories with proper permissions
RUN mkdir -p /app/uploads /app/logs && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check with proper timeout and retries
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Set JVM options for production
ENV JAVA_OPTS="-Xms512m -Xmx2g -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application with optimized JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
