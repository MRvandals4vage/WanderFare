# WanderFare API Examples

This document provides comprehensive examples of how to use the WanderFare API endpoints.

## Authentication Examples

### 1. Customer Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "deliveryAddress": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "preferences": "Vegetarian options preferred"
  }'
```

### 2. Vendor Registration
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
    "businessName": "Johns Italian Kitchen",
    "businessAddress": "456 Restaurant Ave",
    "city": "New York",
    "postalCode": "10002",
    "cuisineType": "Italian",
    "description": "Authentic Italian cuisine with fresh ingredients"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "customer@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "CUSTOMER"
}
```

## Vendor Management Examples

### 1. Browse All Vendors
```bash
curl -X GET http://localhost:8080/api/vendors/browse
```

### 2. Search Vendors
```bash
curl -X GET "http://localhost:8080/api/vendors/search?searchTerm=italian&page=0&size=10"
```

### 3. Filter Vendors
```bash
curl -X GET "http://localhost:8080/api/vendors/filter?city=New York&cuisineType=Italian&minRating=4.0&page=0&size=10"
```

### 4. Get Vendor Details
```bash
curl -X GET http://localhost:8080/api/vendors/1
```

### 5. Update Vendor Profile (Vendor Only)
```bash
curl -X PUT http://localhost:8080/api/vendors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Johns Premium Italian Kitchen",
    "description": "Premium authentic Italian cuisine",
    "openingTime": "10:00:00",
    "closingTime": "22:00:00",
    "minimumOrder": 15.00,
    "deliveryFee": 3.99
  }'
```

## Menu Management Examples

### 1. Get Vendor Menu
```bash
curl -X GET http://localhost:8080/api/vendors/menu/vendor/1
```

### 2. Search Menu Items
```bash
curl -X GET "http://localhost:8080/api/vendors/menu/vendor/1/search?searchTerm=pizza"
```

### 3. Filter Menu Items
```bash
curl -X GET "http://localhost:8080/api/vendors/menu/vendor/1/paginated?category=Main Course&isVegetarian=true&page=0&size=10"
```

### 4. Create Menu Item (Vendor Only)
```bash
curl -X POST http://localhost:8080/api/vendors/menu \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with fresh mozzarella, tomatoes, and basil",
    "price": 18.99,
    "category": "Pizza",
    "isVegetarian": true,
    "isVegan": false,
    "isSpicy": false,
    "preparationTime": 15,
    "ingredients": "Pizza dough, mozzarella, tomatoes, basil, olive oil",
    "imageUrl": "https://example.com/margherita.jpg"
  }'
```

### 5. Update Menu Item (Vendor Only)
```bash
curl -X PUT http://localhost:8080/api/vendors/menu/1 \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza - Large",
    "price": 22.99,
    "isAvailable": true
  }'
```

## Order Management Examples

### 1. Create Order (Customer Only)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": 1,
    "deliveryAddress": "123 Main St, New York, NY 10001",
    "specialInstructions": "Please ring the doorbell",
    "orderItems": [
      {
        "menuItemId": 1,
        "quantity": 2,
        "specialInstructions": "Extra cheese"
      },
      {
        "menuItemId": 2,
        "quantity": 1
      }
    ]
  }'
```

### 2. Get Customer Orders
```bash
curl -X GET "http://localhost:8080/api/orders/customer/my-orders?page=0&size=10" \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN"
```

### 3. Get Vendor Orders
```bash
curl -X GET "http://localhost:8080/api/orders/vendor/my-orders?page=0&size=10" \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

### 4. Update Order Status (Vendor/Admin Only)
```bash
curl -X PATCH "http://localhost:8080/api/orders/1/status?status=PREPARING" \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

### 5. Reorder Previous Order
```bash
curl -X POST http://localhost:8080/api/orders/reorder/5 \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN"
```

## Analytics Examples (Vendor Only)

### 1. Get Vendor Dashboard Analytics
```bash
curl -X GET "http://localhost:8080/api/vendors/analytics/dashboard?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59" \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

### 2. Get Price Prediction Data
```bash
curl -X GET http://localhost:8080/api/vendors/analytics/price-prediction \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

### 3. Get Profit Analytics
```bash
curl -X GET "http://localhost:8080/api/vendors/analytics/profits?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59" \
  -H "Authorization: Bearer YOUR_VENDOR_JWT_TOKEN"
```

## Admin Examples (Admin Only)

### 1. Get Dashboard Statistics
```bash
curl -X GET http://localhost:8080/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 2. Get Pending Vendors
```bash
curl -X GET http://localhost:8080/api/admin/vendors/pending \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 3. Approve Vendor
```bash
curl -X POST http://localhost:8080/api/admin/vendors/1/approve \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 4. Get Platform Revenue Analytics
```bash
curl -X GET "http://localhost:8080/api/admin/analytics/revenue?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### 1. Login Function
```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

#### 2. Fetch Vendors with Authentication
```javascript
async function fetchVendors() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:8080/api/vendors/browse', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch vendors error:', error);
    throw error;
  }
}
```

#### 3. Place Order
```javascript
async function placeOrder(orderData) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Failed to place order');
    }

    return await response.json();
  } catch (error) {
    console.error('Place order error:', error);
    throw error;
  }
}
```

## Error Handling Examples

### Common Error Responses

#### 1. Validation Error (400)
```json
{
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "path": "uri=/api/auth/register",
  "timestamp": "2024-01-15T10:30:00",
  "fieldErrors": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

#### 2. Authentication Error (401)
```json
{
  "status": 401,
  "error": "Invalid Credentials",
  "message": "Invalid email or password",
  "path": "uri=/api/auth/login",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 3. Authorization Error (403)
```json
{
  "status": 403,
  "error": "Access Denied",
  "message": "You don't have permission to access this resource",
  "path": "uri=/api/admin/dashboard/stats",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 4. Resource Not Found (404)
```json
{
  "status": 404,
  "error": "Resource Not Found",
  "message": "Vendor not found",
  "path": "uri=/api/vendors/999",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Testing with Postman

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:8080/api`
- `token`: `{{token}}` (will be set after login)

### Pre-request Script for Authentication
```javascript
// Add this to requests that require authentication
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('token')
});
```

### Test Script for Login
```javascript
// Add this to the login request test tab
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set('token', response.token);
  pm.environment.set('userId', response.id);
  pm.environment.set('userRole', response.role);
}
```
