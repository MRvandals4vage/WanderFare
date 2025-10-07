#!/bin/bash

# WanderFare Local Development Startup Script

echo "🚀 Starting WanderFare Local Development Environment..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "📊 Starting MySQL..."
    if command -v brew &> /dev/null; then
        brew services start mysql
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mysql
    else
        echo "❌ Please start MySQL manually"
        exit 1
    fi
    
    # Wait for MySQL to start
    sleep 3
fi

echo "✅ MySQL is running"

# Check if database exists
if mysql -u wanderfare_user -pwanderfare_password123 -e "USE wanderfare;" 2>/dev/null; then
    echo "✅ Database 'wanderfare' exists"
else
    echo "📊 Setting up database..."
    mysql -u root -p < mysql/setup.sql
    echo "✅ Database setup complete"
fi

# Build and run the application
echo "🔨 Building application..."
mvn clean install -q

echo "🚀 Starting WanderFare Backend..."
echo "📖 API Documentation: http://localhost:8080/api/swagger-ui.html"
echo "🔍 Health Check: http://localhost:8080/api/actuator/health"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

mvn spring-boot:run
