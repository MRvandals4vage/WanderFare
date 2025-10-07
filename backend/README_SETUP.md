# 🚀 WanderFare Backend Setup Guide

## Quick Setup Instructions

### 1. Start MySQL
```bash
# Start MySQL service
brew services start mysql

# Or if using system MySQL
sudo systemctl start mysql
```

### 2. Setup Database
```bash
# Connect to MySQL as root
mysql -u root -p

# Run these commands in MySQL:
CREATE DATABASE IF NOT EXISTS wanderfare;
CREATE USER IF NOT EXISTS 'wanderfare_user'@'localhost' IDENTIFIED BY 'wanderfare_password123';
GRANT ALL PRIVILEGES ON wanderfare.* TO 'wanderfare_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Test Database Connection
```bash
# Test the new user
mysql -u wanderfare_user -pwanderfare_password123 wanderfare
# Should connect successfully
EXIT;
```

### 4. Run Application
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 5. Verify Setup
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Health Check**: http://localhost:8080/api/actuator/health

## Test API Endpoints

### Register Customer
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Customer",
    "role": "CUSTOMER",
    "city": "New York"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MySQL Connection Issues
1. Check if MySQL is running: `brew services list | grep mysql`
2. Start MySQL: `brew services start mysql`
3. Reset password if needed: `mysql_secure_installation`

### Application Issues
1. Check logs for detailed error messages
2. Verify database credentials in `application.yml`
3. Ensure database user has proper permissions

## File Structure
```
backend/
├── mysql/
│   ├── setup.sql           # Database setup script
│   ├── sample_data.sql     # Sample data for testing
│   └── reset_database.sql  # Reset database script
├── scripts/
│   ├── start_local.sh      # Start application script
│   └── test_api.sh         # API testing script
└── env.example             # Environment variables example
```
