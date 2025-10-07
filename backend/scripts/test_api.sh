#!/bin/bash

# WanderFare API Testing Script

BASE_URL="http://localhost:8080/api"

echo "🧪 Testing WanderFare API..."
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s "$BASE_URL/actuator/health" | jq '.' || echo "Health check failed"
echo ""

# Test 2: Register Customer
echo "2️⃣ Testing Customer Registration..."
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcustomer@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Customer",
    "phoneNumber": "+1234567890",
    "role": "CUSTOMER",
    "city": "New York",
    "deliveryAddress": "123 Test Street",
    "postalCode": "10001"
  }')

echo "$CUSTOMER_RESPONSE" | jq '.' || echo "Customer registration failed"
CUSTOMER_TOKEN=$(echo "$CUSTOMER_RESPONSE" | jq -r '.token')
echo ""

# Test 3: Register Vendor
echo "3️⃣ Testing Vendor Registration..."
VENDOR_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testvendor@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Vendor",
    "phoneNumber": "+1234567891",
    "role": "VENDOR",
    "businessName": "Test Restaurant",
    "businessAddress": "456 Business Ave",
    "city": "New York",
    "postalCode": "10002",
    "cuisineType": "American",
    "description": "Test restaurant for API testing"
  }')

echo "$VENDOR_RESPONSE" | jq '.' || echo "Vendor registration failed"
VENDOR_TOKEN=$(echo "$VENDOR_RESPONSE" | jq -r '.token')
echo ""

# Test 4: Login
echo "4️⃣ Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcustomer@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.' || echo "Login failed"
echo ""

# Test 5: Browse Vendors
echo "5️⃣ Testing Browse Vendors..."
curl -s -X GET "$BASE_URL/vendors/browse" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | jq '.' || echo "Browse vendors failed"
echo ""

# Test 6: Get Vendor Profile (Vendor)
echo "6️⃣ Testing Vendor Profile..."
curl -s -X GET "$BASE_URL/vendors/profile" \
  -H "Authorization: Bearer $VENDOR_TOKEN" | jq '.' || echo "Vendor profile failed"
echo ""

echo "✅ API Testing Complete!"
echo ""
echo "🔗 Useful URLs:"
echo "   Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo "   Health Check: http://localhost:8080/api/actuator/health"
