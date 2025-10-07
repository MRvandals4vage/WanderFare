# WanderFare Backend API

A comprehensive Spring Boot backend for the WanderFare food delivery platform with JWT authentication, role-based access control, and MySQL database integration.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Customer, Vendor, and Admin roles with JWT-based security
- **Vendor Management**: Complete vendor onboarding, approval workflow, and profile management
- **Menu Management**: Full CRUD operations for menu items with filtering and search
- **Order Processing**: End-to-end order management with status tracking
- **Analytics Dashboard**: Revenue tracking, profit analysis, and price prediction
- **Admin Panel**: Platform oversight with user and vendor management

### Technical Features
- **Spring Boot 3.2**: Latest Spring Boot with Java 17
- **JWT Security**: Stateless authentication with role-based access control
- **MySQL Database**: Production-ready database with PlanetScale support
- **RESTful API**: Clean REST endpoints with proper HTTP methods
- **Swagger Documentation**: Interactive API documentation
- **Exception Handling**: Global exception handling with proper error responses
- **Data Validation**: Input validation with custom error messages

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or PlanetScale account)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WanderFare/backend
```

### 2. Database Configuration

#### For TiDB Cloud (Recommended for Production):
1. Create a TiDB Cloud account and database
2. Get your connection string from the TiDB Cloud dashboard
3. Update `application.yml` with your TiDB Cloud credentials:

```yaml
spring:
  datasource:
    url: mysql://your-username:your-password@gateway01.region.prod.aws.tidbcloud.com:4000/your-database?sslMode=REQUIRED&useSSL=true&serverTimezone=UTC
    username: your-username
    password: your-password
```

#### For Local MySQL (Development Only):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wanderfare?sslMode=REQUIRED
    username: root
    password: your-password
```

### 3. Environment Variables
Create a `.env` file or set environment variables:

```bash
DATABASE_URL=mysql://4NDrRQoSbQCxkD5.root:dNv08cmKwcRS0H7Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslMode=REQUIRED&useSSL=true&serverTimezone=UTC
DATABASE_USERNAME=4NDrRQoSbQCxkD5.root
DATABASE_PASSWORD=dNv08cmKwcRS0H7Z
JWT_SECRET=your-jwt-secret-key-minimum-32-characters
```

### 4. Build and Run
```bash
mvn clean install

# Run the application
mvn spring-boot:run

### Option 2: Heroku Deployment
```bash
# Create Procfile
echo "web: java -jar target/wanderfare-backend-0.0.1-SNAPSHOT.jar" > Procfile

# Deploy to Heroku
heroku create wanderfare-backend
heroku config:set DATABASE_URL=mysql://4NDrRQoSbQCxkD5.root:dNv08cmKwcRS0H7Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test
git push heroku main
```

### Option 3: Docker Deployment
```bash
# Build and run with Docker
docker build -t wanderfare-backend .
docker run -p 8080:8080 -e DATABASE_URL=mysql://4NDrRQoSbQCxkD5.root:dNv08cmKwcRS0H7Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test wanderfare-backend
```

## 🔐 Authentication

### Registration Example
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "VENDOR",
    "businessName": "John's Kitchen",
    "city": "New York",
    "cuisineType": "Italian"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@example.com",
    "password": "password123"
  }'
```

### Using JWT Token
```bash
curl -X GET http://localhost:8080/api/vendors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Architecture

### Project Structure
```
src/main/java/com/wanderfare/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data Transfer Objects
├── exception/       # Exception handling
├── model/           # JPA entities
├── repository/      # Data repositories
├── security/        # Security configuration
└── service/         # Business logic
```

### Database Schema
- **users** - Base user table with inheritance
- **customers** - Customer-specific data
- **vendors** - Vendor-specific data
- **menu_items** - Vendor menu items
- **orders** - Customer orders
- **order_items** - Order line items

## 🔧 Configuration

### Security Configuration
- JWT token expiration: 24 hours (configurable)
- Password encoding: BCrypt
- CORS enabled for frontend integration
- Role-based method security

### Database Configuration
- Auto DDL: Update (creates/updates tables automatically)
- Connection pooling: HikariCP (default)
- Dialect: MySQL8Dialect

## 🚀 Deployment

### Production Checklist
1. Set strong JWT secret (minimum 32 characters)
2. Configure production database credentials
3. Enable HTTPS
4. Set up proper logging
5. Configure monitoring and health checks

### Docker Deployment (Optional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/wanderfare-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Sample API Calls
Check the `docs/api-examples.md` file for comprehensive API usage examples.

## 🤝 Frontend Integration

### CORS Configuration
The backend is configured to accept requests from your Next.js frontend. Update the CORS configuration in `SecurityConfig.java` if needed.

### Sample Frontend Integration
```javascript
// Login example
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();
localStorage.setItem('token', token);

// Authenticated request
const vendorsResponse = await fetch('http://localhost:8080/api/vendors/browse', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/swagger-ui.html`
2. Review the error responses for detailed error messages
3. Check application logs for debugging information

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and authorization
  - Vendor and menu management
  - Order processing
  - Basic analytics
  - Admin panel
