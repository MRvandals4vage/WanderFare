// WanderFare API Client
// This file handles all API calls to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types for API responses
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

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
  role: 'CUSTOMER' | 'VENDOR';
  // Customer fields
  city?: string;
  deliveryAddress?: string;
  postalCode?: string;
  preferences?: string;
  // Vendor fields
  businessName?: string;
  businessAddress?: string;
  cuisineType?: string;
  description?: string;
}

export interface Vendor {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  city: string;
  postalCode: string;
  cuisineType: string;
  description: string;
  openingTime: string;
  closingTime: string;
  minimumOrder: number;
  deliveryFee: number;
  rating: number;
  totalReviews: number;
  isApproved: boolean;
  imageUrl: string;
}

export interface MenuItem {
  id: number;
  vendorId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  imageUrl?: string;
}

export interface Order {
  id: number;
  customerId: number;
  vendorId: number;
  totalAmount: number;
  deliveryFee: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  specialInstructions?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  price: number;
  menuItem: MenuItem;
}

// API Client Class
class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({} as any));
        const message = (errorData && (errorData.message || errorData.error)) || `HTTP ${response.status}: ${response.statusText}`;
        // Attach status to the error so callers can branch (e.g., 404 fallback)
        const err = Object.assign(new Error(message), { status: response.status });
        throw err;
      }

      // Handle no-content responses (e.g., DELETE 204)
      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return undefined as unknown as T;
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response));
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response));
    
    return response;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Clear all auth-related data
    localStorage.clear();
  }

  getCurrentUser(): AuthResponse | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Vendor APIs
  async getVendors(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<{ content: Vendor[]; totalElements: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.size !== undefined) searchParams.set('size', params.size.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDir) searchParams.set('sortDir', params.sortDir);

    const query = searchParams.toString();
    // Try paginated endpoint first
    try {
      return await this.request(`/vendors/browse/paginated${query ? `?${query}` : ''}`);
    } catch (err: any) {
      // Fallback to non-paginated /vendors/browse and wrap the result
      const list = await this.request<Vendor[]>(`/vendors/browse`);
      return { content: list, totalElements: list.length, totalPages: 1 };
    }
  }

  async searchVendors(searchTerm: string, page = 0, size = 10): Promise<{ content: Vendor[] }> {
    return this.request(`/vendors/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
  }

  async getVendorById(id: number): Promise<Vendor> {
    return this.request(`/vendors/${id}`);
  }

  async filterVendors(filters: {
    city?: string;
    cuisineType?: string;
    minRating?: number;
    maxDeliveryFee?: number;
    page?: number;
    size?: number;
  }): Promise<{ content: Vendor[] }> {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString());
      }
    });

    return this.request(`/vendors/filter?${searchParams.toString()}`);
  }

  // Menu APIs
  async getVendorMenu(vendorId: number): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}`);
  }

  async searchMenuItems(vendorId: number, searchTerm: string): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  }

  async getMenuItemsByCategory(vendorId: number, category: string): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}/category/${encodeURIComponent(category)}`);
  }

  // Order APIs
  async createOrder(orderData: {
    vendorId: number;
    deliveryAddress: string;
    specialInstructions?: string;
    orderItems: { menuItemId: number; quantity: number }[];
  }): Promise<Order> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getCustomerOrders(page = 0, size = 10): Promise<{ content: Order[] }> {
    return this.request(`/orders/customer/my-orders?page=${page}&size=${size}`);
  }

  async getOrderById(orderId: number): Promise<Order> {
    return this.request(`/orders/${orderId}`);
  }

  async reorder(originalOrderId: number): Promise<Order> {
    return this.request(`/orders/reorder/${originalOrderId}`, {
      method: 'POST',
    });
  }

  // Vendor-specific APIs (for vendor users)
  async getVendorProfile(): Promise<Vendor> {
    return this.request('/vendors/profile');
  }

  async updateVendorProfile(profileData: Partial<Vendor>): Promise<Vendor> {
    return this.request('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Prefer explicit vendor update by ID (backend typically exposes /vendors/{id})
  async updateVendor(vendorId: number, profileData: Partial<Vendor>): Promise<Vendor> {
    return this.request(`/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Tries multiple common endpoints to create/update vendor profile
  async saveVendorProfileSmart(userId: number, profileData: Partial<Vendor>): Promise<Vendor> {
    const bodyWithUser = JSON.stringify({ userId, ...profileData });
    // Attempt 1: POST /vendors with { userId, ... }
    try {
      return await this.request('/vendors', {
        method: 'POST',
        body: bodyWithUser,
      });
    } catch (e1: any) {
      // Attempt 2: POST /vendors/{userId}
      try {
        return await this.request(`/vendors/${userId}`, {
          method: 'POST',
          body: JSON.stringify(profileData),
        });
      } catch (e2: any) {
        // Attempt 3: PUT /vendors/profile with userId in body
        return await this.request('/vendors/profile', {
          method: 'PUT',
          body: bodyWithUser,
        });
      }
    }
  }

  async getVendorOrders(page = 0, size = 10): Promise<{ content: Order[] }> {
    return this.request(`/orders/vendor/my-orders?page=${page}&size=${size}`);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Menu management (for vendors)
  async createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    return this.request('/vendors/menu', {
      method: 'POST',
      body: JSON.stringify(menuItem),
    });
  }

  // Resilient creation: try multiple common patterns if the first fails
  async createMenuItemSmart(vendorId: number, partial: Partial<MenuItem>): Promise<MenuItem> {
    const base: any = {
      name: partial.name,
      description: partial.description || '',
      price: partial.price,
      category: partial.category || 'Main',
      isAvailable: partial.isAvailable ?? true,
      isVegetarian: !!partial.isVegetarian,
      isVegan: !!partial.isVegan,
      isGlutenFree: !!partial.isGlutenFree,
    };
    // Attempt 1: POST /vendors/menu with vendorId in body
    try {
      return await this.createMenuItem({ vendorId, ...base } as any);
    } catch (e1: any) {
      // Attempt 2: POST /vendors/{vendorId}/menu
      try {
        return await this.request(`/vendors/${vendorId}/menu`, {
          method: 'POST',
          body: JSON.stringify(base),
        });
      } catch (e2: any) {
        // Attempt 3: POST /vendors/menu/vendor/{vendorId}
        return await this.request(`/vendors/menu/vendor/${vendorId}`, {
          method: 'POST',
          body: JSON.stringify(base),
        });
      }
    }
  }

  async updateMenuItem(itemId: number, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    return this.request(`/vendors/menu/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(menuItem),
    });
  }

  async deleteMenuItem(itemId: number): Promise<void> {
    return this.request(`/vendors/menu/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Analytics APIs (for vendors)
  async getVendorAnalytics(startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    const query = params.toString();
    return this.request(`/vendors/analytics/dashboard${query ? `?${query}` : ''}`);
  }

  async getPriceAnalytics(): Promise<any> {
    return this.request('/vendors/analytics/price-prediction');
  }

  async getProfitAnalytics(startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    const query = params.toString();
    return this.request(`/vendors/analytics/profits${query ? `?${query}` : ''}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export utility functions
export const auth = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  register: (userData: RegisterRequest) => apiClient.register(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  isAuthenticated: () => apiClient.isAuthenticated(),
};

export default apiClient;
