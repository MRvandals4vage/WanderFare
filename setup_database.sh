#!/bin/bash

echo "🔧 Setting up WanderFare MySQL Database..."

# Create database and user
mysql -u root -e "
CREATE DATABASE IF NOT EXISTS wanderfare;
CREATE USER IF NOT EXISTS 'wanderfare_user'@'localhost' IDENTIFIED BY 'wanderfare_password123';
GRANT ALL PRIVILEGES ON wanderfare.* TO 'wanderfare_user'@'localhost';
FLUSH PRIVILEGES;
SELECT 'Database setup complete!' as status;
"

echo "✅ Database setup complete!"
echo "📊 Testing connection..."

# Test connection
mysql -u wanderfare_user -pwanderfare_password123 -e "USE wanderfare; SELECT 'Connection successful!' as status;"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test successful!"
else
    echo "❌ Database connection test failed!"
fi
