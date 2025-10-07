# WanderFare Frontend-Backend Integration Guide

This guide provides step-by-step instructions for integrating your Next.js frontend with the Spring Boot backend.


#### Option A: Using TiDB Cloud (Recommended for Production)
```bash
# Set environment variables for TiDB Cloud
export DATABASE_URL="mysql://4NDrRQoSbQCxkD5.root:dNv08cmKwcRS0H7Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslMode=REQUIRED&useSSL=true&serverTimezone=UTC"
export DATABASE_USERNAME="4NDrRQoSbQCxkD5.root"
export DATABASE_PASSWORD="dNv08cmKwcRS0H7Z"
export JWT_SECRET="your-jwt-secret-minimum-32-characters"
```
#### Option B: Using Docker (Local Development)
```bash
# Navigate to backend directory
cd backend

# Start MySQL and Backend with Docker
docker-compose up -d

# Backend will be available at http://localhost:8080/api
```

### 2. Frontend Integration

Update your frontend environment variables:

```bash
# .env.local in your Next.js project
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🔗 API Integration Examples

### Authentication Service (Frontend)

Create `lib/auth.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  // Vendor-specific fields
  businessName?: string;
  businessAddress?: string;
  city?: string;
  postalCode?: string;
  cuisineType?: string;
  description?: string;
  // Customer-specific fields
  deliveryAddress?: string;
  preferences?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
```

### API Client Service (Frontend)

Create `lib/api.ts`:
```typescript
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authService.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Vendor methods
  async getVendors(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.size !== undefined) searchParams.set('size', params.size.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDir) searchParams.set('sortDir', params.sortDir);

    const query = searchParams.toString();
    return this.request(`/vendors/browse/paginated${query ? `?${query}` : ''}`);
  }

  async searchVendors(searchTerm: string, page = 0, size = 10) {
    return this.request(`/vendors/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  }

  async getVendorById(id: number) {
    return this.request(`/vendors/${id}`);
  }

  // Menu methods
  async getVendorMenu(vendorId: number) {
    return this.request(`/vendors/menu/vendor/${vendorId}`);
  }

  async searchMenuItems(vendorId: number, searchTerm: string) {
    return this.request(`/vendors/menu/vendor/${vendorId}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  }

  // Order methods
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getCustomerOrders(page = 0, size = 10) {
    return this.request(`/orders/customer/my-orders?page=${page}&size=${size}`);
  }

  async reorder(originalOrderId: number) {
    return this.request(`/orders/reorder/${originalOrderId}`, {
      method: 'POST',
    });
  }

  // Vendor-specific methods
  async updateVendorProfile(profileData: any) {
    return this.request('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getVendorAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    const query = params.toString();
    return this.request(`/vendors/analytics/dashboard${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient();
```

### Update Your Auth Provider (Frontend)

Update `components/auth-provider.tsx`:
```typescript
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { authService, AuthResponse } from '@/lib/auth'

interface AuthContextType {
  user: AuthResponse | null
  userRole: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = authService.getUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login({ email, password })
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const user = await authService.register(userData)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole: user?.role || null,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Update Login Page (Frontend)

Update `components/pages/login-page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LoginPage() {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      role: formData.get("role") as "CUSTOMER" | "VENDOR",
      // Add conditional fields based on role
      ...(formData.get("role") === "VENDOR" && {
        businessName: formData.get("businessName") as string,
        city: formData.get("city") as string,
        cuisineType: formData.get("cuisineType") as string,
      }),
      ...(formData.get("role") === "CUSTOMER" && {
        city: formData.get("city") as string,
      }),
    }

    try {
      await register(userData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to WanderFare</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" />
                </div>
                <div>
                  <Label htmlFor="role">I am a</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="VENDOR">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required />
                </div>
                {/* Add conditional fields for vendors */}
                <div id="vendorFields" style={{ display: 'none' }}>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" name="businessName" />
                  </div>
                  <div>
                    <Label htmlFor="cuisineType">Cuisine Type</Label>
                    <Input id="cuisineType" name="cuisineType" />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🔧 Backend Configuration for Production

### Environment Variables
```bash
# Production environment variables
DATABASE_URL=mysql://4NDrRQoSbQCxkD5.root:dNv08cmKwcRS0H7Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslMode=REQUIRED&useSSL=true&serverTimezone=UTC
DATABASE_USERNAME=4NDrRQoSbQCxkD5.root
DATABASE_PASSWORD=dNv08cmKwcRS0H7Z
JWT_SECRET=your-very-secure-jwt-secret-minimum-32-characters
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### TiDB Cloud Setup
1. Create a TiDB Cloud account and database cluster
2. Get connection details from TiDB Cloud dashboard
3. Update your `application.yml` with the connection details

## 🚀 Deployment Options

### Option 1: Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

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

## 🧪 Testing the Integration

### 1. Test Authentication
```bash
# Test registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","role":"CUSTOMER"}'

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Vendor Browsing
```bash
curl -X GET http://localhost:8080/api/vendors/browse
```

### 3. Test Protected Endpoints
```bash
curl -X GET http://localhost:8080/api/orders/customer/my-orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📱 Frontend Integration Checklist

- [ ] Update API URL in environment variables
- [ ] Implement authentication service
- [ ] Update auth provider with backend integration
- [ ] Update login/register forms
- [ ] Implement API client for all endpoints
- [ ] Add error handling for API calls
- [ ] Test all user flows (login, browse vendors, place orders)
- [ ] Implement loading states
- [ ] Add proper error messages
- [ ] Test role-based access control

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in `SecurityConfig.java`
2. **Authentication Failures**: Check JWT token format and expiration
3. **Database Connection**: Verify connection string and credentials
4. **404 Errors**: Ensure API endpoints match frontend calls

### Debug Mode
Enable debug logging in `application.yml`:
```yaml
logging:
  level:
    com.wanderfare: DEBUG
    org.springframework.security: DEBUG
```

This comprehensive integration guide should help you successfully connect your Next.js frontend with the Spring Boot backend. The backend is now production-ready with all the features you requested!
