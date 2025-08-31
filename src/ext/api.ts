type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: config.method || 'GET',
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

export const api = new ApiClient();