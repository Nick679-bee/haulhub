const API_BASE_URL = 'http://localhost:3001/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'dispatcher';
}

export interface Truck {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  capacity: number;
  fuel_type: string;
  status: 'available' | 'in_use' | 'maintenance';
  driver_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Haul {
  id: number;
  haul_type: 'pickup' | 'delivery' | 'both';
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip: string;
  pickup_date: string;
  pickup_contact_name: string;
  pickup_contact_phone: string;
  pickup_instructions?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  delivery_date: string;
  delivery_contact_name: string;
  delivery_contact_phone: string;
  delivery_instructions?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  load_type: string;
  load_description: string;
  load_weight?: number;
  load_volume?: number;
  load_hazardous: boolean;
  special_requirements?: string;
  distance_miles?: number;
  estimated_duration_hours?: number;
  quoted_price?: number;
  final_price?: number;
  fuel_cost?: number;
  payment_status: 'pending' | 'paid' | 'partial';
  payment_method?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  user_id: number;
  truck_id?: number;
  driver_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHaulRequest {
  haul_type: 'pickup' | 'delivery' | 'both';
  pickup: {
    address: string;
    city: string;
    state: string;
    zip: string;
    date: string;
    contact_name: string;
    contact_phone: string;
    instructions?: string;
    coordinates?: [number, number];
  };
  delivery: {
    address: string;
    city: string;
    state: string;
    zip: string;
    date: string;
    contact_name: string;
    contact_phone: string;
    instructions?: string;
    coordinates?: [number, number];
  };
  load: {
    type: string;
    description: string;
    weight?: number;
    volume?: number;
    hazardous: boolean;
    special_requirements?: string;
  };
  pricing?: {
    quoted_price?: number;
    final_price?: number;
    fuel_cost?: number;
    payment_status?: 'pending' | 'paid' | 'partial';
    payment_method?: string;
  };
  distance_miles?: number;
  estimated_duration_hours?: number;
  notes?: string;
  status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making API request to: ${url}`);
    console.log('Request config:', { method: config.method || 'GET', headers: config.headers });

    try {
      const response = await fetch(url, config);
      console.log(`Response status: ${response.status}`);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      if (error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try again.');
      }
      
      // Handle specific HTTP status codes
      if (error.message.includes('HTTP 401')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      
      if (error.message.includes('HTTP 403')) {
        throw new Error('Access denied. Please log in again.');
      }
      
      if (error.message.includes('HTTP 404')) {
        throw new Error('The requested resource was not found.');
      }
      
      if (error.message.includes('HTTP 500')) {
        throw new Error('Server error. Please try again later.');
      }
      
      if (error.message.includes('HTTP 502') || error.message.includes('HTTP 503')) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      
      // If it's a server response with a message, use that
      if (error.message && !error.message.includes('HTTP')) {
        throw new Error(error.message);
      }
      
      // Generic fallback
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Hauls
  async getHauls(params?: {
    filter?: 'active' | 'completed' | 'pending' | 'my_hauls' | 'my_assignments';
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{ hauls: Haul[]; total: number }>> {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.append('filter', params.filter);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/hauls?${query}` : '/hauls';
    
    return this.request<{ hauls: Haul[]; total: number }>(endpoint);
  }

  async getHaul(id: number): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}`);
  }

  async createHaul(haulData: CreateHaulRequest): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>('/hauls', {
      method: 'POST',
      body: JSON.stringify(haulData),
    });
  }

  async updateHaul(id: number, haulData: Partial<CreateHaulRequest>): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(haulData),
    });
  }

  async deleteHaul(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/hauls/${id}`, {
      method: 'DELETE',
    });
  }

  async assignHaul(id: number, driverId: number): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ driver_id: driverId }),
    });
  }

  async startHaul(id: number): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}/start`, {
      method: 'POST',
    });
  }

  async completeHaul(id: number): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}/complete`, {
      method: 'POST',
    });
  }

  async cancelHaul(id: number): Promise<ApiResponse<{ haul: Haul }>> {
    return this.request<{ haul: Haul }>(`/hauls/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Trucks
  async getTrucks(): Promise<ApiResponse<{ trucks: Truck[] }>> {
    return this.request<{ trucks: Truck[] }>('/trucks');
  }

  async getTruck(id: number): Promise<ApiResponse<{ truck: Truck }>> {
    return this.request<{ truck: Truck }>(`/trucks/${id}`);
  }

  async createTruck(truckData: Partial<Truck>): Promise<ApiResponse<{ truck: Truck }>> {
    return this.request<{ truck: Truck }>('/trucks', {
      method: 'POST',
      body: JSON.stringify(truckData),
    });
  }

  async updateTruck(id: number, truckData: Partial<Truck>): Promise<ApiResponse<{ truck: Truck }>> {
    return this.request<{ truck: Truck }>(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(truckData),
    });
  }

  async deleteTruck(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/trucks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

