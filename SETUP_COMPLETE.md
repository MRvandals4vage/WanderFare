# 🎉 WanderFare Complete Setup Guide

## ✅ What's Been Updated

### **Backend Integration Complete**
- ✅ **Authentication System**: Real JWT-based login/registration
- ✅ **API Client**: Complete API integration in `lib/api.ts`
- ✅ **Database Setup**: MySQL configuration with sample data
- ✅ **Environment Config**: Template for environment variables

### **Frontend Updates Complete**
- ✅ **Auth Provider**: Real authentication with user state management
- ✅ **Login Page**: Complete login/registration forms with validation
- ✅ **Vendors Page**: Live data from backend API with search/filter
- ✅ **Navbar**: User profile dropdown with real user information
- ✅ **Dummy Data Removed**: All hardcoded data replaced with API calls

## 🚀 Quick Start Instructions

### **1. Setup Database**
```bash
# Start MySQL
brew services start mysql

# Connect as root and run setup
mysql -u root -p < backend/mysql/setup.sql

# Verify connection
mysql -u wanderfare_user -pwanderfare_password123 wanderfare
```

### **2. Setup Environment**
```bash
# Copy environment template
cp env.template .env.local

# Edit .env.local and add:
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### **3. Start Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run

# Backend will be available at: http://localhost:8080/api
# Swagger docs: http://localhost:8080/api/swagger-ui.html
```

### **4. Start Frontend**
```bash
# In project root
npm install
npm run dev

# Frontend will be available at: http://localhost:3000
```

### **5. Test the Integration**
```bash
# Run API tests
cd backend
chmod +x scripts/test_api.sh
./scripts/test_api.sh
```

## 📋 Test User Accounts

### **Create Test Accounts**
1. **Customer Account**:
   - Email: `customer@test.com`
   - Password: `password123`
   - Role: Customer

2. **Vendor Account**:
   - Email: `vendor@test.com`
   - Password: `password123`
   - Role: Vendor
   - Business: Test Restaurant

3. **Admin Account** (via SQL):
   ```sql
   mysql -u wanderfare_user -pwanderfare_password123 wanderfare < backend/mysql/sample_data.sql
   ```

## 🔧 Key Features Working

### **Authentication**
- ✅ User registration with role selection
- ✅ Login with JWT tokens
- ✅ Protected routes based on user roles
- ✅ User profile in navbar
- ✅ Logout functionality

### **Vendor Management**
- ✅ Browse vendors with real data
- ✅ Search vendors by name/cuisine
- ✅ Filter by city, cuisine type
- ✅ Pagination support
- ✅ Vendor approval status
- ✅ Real-time data loading

### **Data Flow**
- ✅ Frontend → API Client → Backend → Database
- ✅ Error handling and loading states
- ✅ Responsive design maintained
- ✅ Type safety with TypeScript

## 📁 Updated Files

### **Frontend Files**
- `components/auth-provider.tsx` - Real authentication
- `components/pages/login-page.tsx` - Complete auth forms
- `components/pages/vendors-page.tsx` - Live vendor data
- `components/navbar.tsx` - User profile integration
- `lib/api.ts` - Complete API client

### **Backend Files**
- `src/main/resources/application.yml` - Local MySQL config
- `mysql/setup.sql` - Database setup script
- `mysql/sample_data.sql` - Test data
- `scripts/start_local.sh` - Easy startup script
- `scripts/test_api.sh` - API testing script

## 🎯 Next Steps

### **Immediate Actions**
1. **Test the complete flow**:
   - Register new accounts
   - Login with different roles
   - Browse vendors as customer
   - Check vendor profile as vendor

2. **Add sample data**:
   ```bash
   mysql -u wanderfare_user -pwanderfare_password123 wanderfare < backend/mysql/sample_data.sql
   ```

### **Development Workflow**
1. **Start backend**: `cd backend && mvn spring-boot:run`
2. **Start frontend**: `npm run dev`
3. **Test APIs**: Use Swagger UI at `http://localhost:8080/api/swagger-ui.html`
4. **Monitor logs**: Check terminal for any errors

### **Additional Features to Implement**
- **Order Management**: Create order flow for customers
- **Menu Management**: CRUD operations for vendor menus
- **Analytics Dashboard**: Revenue and profit tracking
- **Admin Panel**: User and vendor management
- **Real-time Updates**: WebSocket integration

## 🔍 Troubleshooting

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   # Check MySQL status
   brew services list | grep mysql
   
   # Restart MySQL
   brew services restart mysql
   ```

2. **Backend Won't Start**
   ```bash
   # Check Java version
   java -version
   
   # Clean rebuild
   mvn clean install
   ```

3. **Frontend API Errors**
   - Check `.env.local` has correct API URL
   - Verify backend is running on port 8080
   - Check browser console for CORS errors

4. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration
   - Verify user exists in database

### **Database Commands**
```bash
# View all users
mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT * FROM users;"

# View all vendors
mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT * FROM vendors;"

# Reset database
mysql -u root -p < backend/mysql/reset_database.sql
```

## 🎊 Success Indicators

You'll know everything is working when:
- ✅ You can register and login with different roles
- ✅ Vendors page shows real data from database
- ✅ User profile appears in navbar after login
- ✅ No console errors in browser
- ✅ Backend logs show successful database connections
- ✅ Swagger UI displays all API endpoints

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review browser console for errors
3. Check backend logs for database issues
4. Verify environment variables are set correctly

**Your WanderFare application is now fully integrated with a real backend! 🎉**
