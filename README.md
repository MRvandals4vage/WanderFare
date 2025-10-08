# 🍕 WanderFare - Food Delivery Platform

![WanderFare Logo](https://via.placeholder.com/800x200/FF6B6B/FFFFFF?text=WanderFare+-+Food+Delivery+Platform)

A full-stack food delivery platform built with **Next.js** frontend and **Spring Boot** backend, featuring real-time order tracking, vendor management, and comprehensive analytics.

## 🌟 Features

### For Customers
- **Browse & Search**: Discover restaurants by cuisine, location, and ratings
- **Real-time Orders**: Place orders and track delivery status in real-time
- **Favorites**: Save favorite restaurants and dishes
- **Order History**: Complete order history with reorder functionality
- **Secure Payments**: Integrated payment processing

### For Vendors
- **Vendor Dashboard**: Complete business management interface
- **Menu Management**: Easy-to-use menu creation and editing tools
- **Order Management**: Accept/reject orders, update status, manage deliveries
- **Analytics**: Revenue tracking, popular items, customer insights
- **Profile Management**: Business information and settings management

### For Admins
- **Platform Management**: User and vendor oversight
- **Vendor Approval**: Approve new vendor registrations
- **Analytics Dashboard**: Platform-wide statistics and insights
- **Content Moderation**: Manage platform content and reviews

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React hooks with context API
- **Charts**: Recharts for analytics visualization
- **Forms**: React Hook Form with Zod validation

### Backend
- **Framework**: Spring Boot 3.2 with Java 17
- **Database**: MySQL with JPA/Hibernate
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI
- **Security**: Spring Security with CORS configuration

### DevOps & Tools
- **Database**: MySQL 8.0+ (PlanetScale for production)
- **Deployment**: Docker containerization
- **Build Tool**: Maven (Backend), npm (Frontend)
- **Version Control**: Git with comprehensive documentation

## 🚀 Quick Start

### Prerequisites
- **Java 17+** for backend
- **Node.js 18+** for frontend
- **MySQL 8.0+** for database
- **Maven 3.6+** for backend builds

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WanderFare
   ```

2. **Backend Setup**
   ```bash
   cd backend
   # Copy environment template
   cp env.example .env
   # Edit .env with your database credentials

   # Build and run
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will be available at: `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install

   # Copy environment template
   cp .env.local.example .env.local
   # Edit .env.local if needed (API URL should be: http://localhost:8080/api)

   # Start development server
   npm run dev
   ```
   Frontend will be available at: `http://localhost:3000`

4. **Database Setup**
   ```bash
   # Run the database setup script
   cd backend
   mysql -u root -p < mysql/reset_database.sql
   ```

## 📱 Screenshots

### Application Interface
<div align="center">

#### Customer Dashboard
![Customer Dashboard](./Screenshot%202025-10-08%20at%2010.30.42%E2%80%AFPM.png)

#### Vendor Management
![Vendor Management](./Screenshot%202025-10-08%20at%2010.30.54%E2%80%AFPM.png)

#### Order Processing
![Order Processing](./Screenshot%202025-10-08%20at%2010.30.56%E2%80%AFPM.png)

#### Analytics Dashboard
![Analytics Dashboard](./Screenshot%202025-10-08%20at%2010.31.01%E2%80%AFPM.png)

#### Menu Management
![Menu Management](./Screenshot%202025-10-08%20at%2010.31.06%E2%80%AFPM.png)

#### User Profile
![User Profile](./Screenshot%202025-10-08%20at%2010.31.07%E2%80%AFPM.png)

#### Admin Panel
![Admin Panel](./Screenshot%202025-10-08%20at%2010.31.15%E2%80%AFPM.png)

#### Vendor Analytics
![Vendor Analytics](./Screenshot%202025-10-08%20at%2010.31.17%E2%80%AFPM.png)

</div>

### Key Features Showcase
- **Multi-role Authentication** with secure login/registration
- **Real-time Order Tracking** with status updates
- **Vendor Dashboard** with analytics and menu management
- **Admin Panel** for platform oversight
- **Responsive Design** working across all devices

---

## 🔐 Test Accounts

### Customer Account
- **Email**: `test@customer.com`
- **Password**: `password123`

### Vendor Account
- **Email**: `vendor@test.com`
- **Password**: `password123`

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `password123`

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **API Health**: `http://localhost:8080/api/actuator/health`

## 🏛️ Architecture

### Backend Architecture
```
src/main/java/com/wanderfare/
├── config/           # Configuration classes
├── controller/       # REST API endpoints
├── dto/             # Data Transfer Objects
├── exception/       # Global exception handling
├── model/           # JPA entities
├── repository/      # Data repositories
├── security/        # JWT security configuration
└── service/         # Business logic services
```

### Database Schema
- **users** - Base user table with role inheritance
- **customers** - Customer-specific information
- **vendors** - Vendor business details
- **menu_items** - Restaurant menu items
- **orders** - Customer orders
- **order_items** - Individual order line items

### Frontend Architecture
```
src/
├── app/                    # Next.js app router
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── pages/            # Page-specific components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🔧 Development

### Backend Development
```bash
cd backend

# Run tests
mvn test

# Run with debug
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Build for production
mvn clean package -DskipTests
```

### Frontend Development
```bash
# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 🚢 Deployment

### Backend Deployment Options

#### Option 1: Docker (Recommended)
```bash
cd backend
docker build -t wanderfare-backend .
docker run -p 8080:8080 -e DATABASE_URL=your-db-url wanderfare-backend
```

#### Option 2: Railway/Heroku
```bash
# Deploy to Railway
railway up

# Deploy to Heroku
heroku create wanderfare-backend
git push heroku main
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=your-backend-url
```

#### Option 2: Docker
```bash
# Build frontend
npm run build

# Create Dockerfile (if needed)
# Deploy with your preferred container service
```

## 🔒 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=your-jwt-secret-minimum-32-characters
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Spring Boot and Next.js
- Thanks to all contributors and supporters
- Special thanks to the open-source community

## 📞 Support

For support and questions:
- **Documentation**: Check `/docs` folder for detailed guides
- **API Issues**: Backend logs and Swagger documentation
- **Frontend Issues**: Browser console and network tab

---

**Made with ❤️ for food lovers everywhere!** 🍕🚀

## images

![alt text](<Screenshot 2025-10-08 at 10.30.42 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.30.54 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.30.56 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.31.01 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.31.06 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.31.07 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.31.15 PM.png>) ![alt text](<Screenshot 2025-10-08 at 10.31.17 PM.png>)