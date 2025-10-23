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
  city?: string;
  deliveryAddress?: string;
  postalCode?: string;
  preferences?: string;
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
        const err = Object.assign(new Error(message), { status: response.status });
        throw err;
      }

      if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return undefined as unknown as T;
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response));
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response));
    return response;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.clear();
  }

  getCurrentUser(): AuthResponse | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

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
    try {
      return await this.request(`/vendors/browse/paginated${query ? `?${query}` : ''}`);
    } catch (err: any) {
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

  async getVendorMenu(vendorId: number): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}`);
  }

  async searchMenuItems(vendorId: number, searchTerm: string): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  }

  async getMenuItemsByCategory(vendorId: number, category: string): Promise<MenuItem[]> {
    return this.request(`/vendors/menu/vendor/${vendorId}/category/${encodeURIComponent(category)}`);
  }

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

  async getVendorProfile(): Promise<Vendor> {
    return this.request('/vendors/profile');
  }

  async updateVendorProfile(profileData: Partial<Vendor>): Promise<Vendor> {
    return this.request('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateVendor(vendorId: number, profileData: Partial<Vendor>): Promise<Vendor> {
    return this.request(`/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async saveVendorProfileSmart(userId: number, profileData: Partial<Vendor>): Promise<Vendor> {
    // Backend identifies vendor from JWT; only PUT /vendors/profile is supported
    return this.updateVendorProfile(profileData);
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

  async createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    return this.request('/vendors/menu', {
      method: 'POST',
      body: JSON.stringify(menuItem),
    });
  }

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
    try {
      return await this.createMenuItem({ vendorId, ...base } as any);
    } catch (e1: any) {
      try {
        return await this.request(`/vendors/${vendorId}/menu`, {
          method: 'POST',
          body: JSON.stringify(base),
        });
      } catch (e2: any) {
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
    const normalize = (d: string) => {
      // If only a date (YYYY-MM-DD) is provided, expand to full ISO datetime
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T00:00:00`;
      return d;
    };
    if (startDate) params.set('startDate', normalize(startDate));
    if (endDate) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        // End of day for endDate
        params.set('endDate', `${endDate}T23:59:59`);
      } else {
        params.set('endDate', endDate);
      }
    }
    const query = params.toString();
    return this.request(`/vendors/analytics/profits${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient();

export const auth = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  register: (userData: RegisterRequest) => apiClient.register(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  isAuthenticated: () => apiClient.isAuthenticated(),
};

export default apiClient;
