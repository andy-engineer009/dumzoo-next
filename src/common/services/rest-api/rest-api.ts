// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/';
const API_TIMEOUT = 10000; // 10 seconds

// Environment configuration
// const environment = {
// //   language: 'en',
//   // encryptedData: false
// };

// App API endpoints
const AppApi = {
  proposalQuotesList: '/proposal/quotes',
  quoteBrokerList: '/quote/broker'
};

// Token Management
class TokenManager {
  private static instance: TokenManager;
  private token: any = null;

  private constructor() {
    this.token = this.getTokenFromStorage();
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getToken(): any {
    if (!this.token) {
      this.token = this.getTokenFromStorage();
    }
    return this.token;
  }

  setToken(token: any): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.clear();
  }

  private getTokenFromStorage(): any {
    if (typeof window !== 'undefined') {
      console.log('token', localStorage.getItem('token'));
      return localStorage.getItem('token');
    }
    
    return null;
  }

  isAuthenticated(): any {
    return !!this.getToken();
  }
}

// Current User Service (simplified version)
class CurrentUserService {
  private static instance: CurrentUserService;

  private constructor() {}

  static getInstance(): CurrentUserService {
    if (!CurrentUserService.instance) {
      CurrentUserService.instance = new CurrentUserService();
    }
    return CurrentUserService.instance;
  }

  swalSweetAlert(message: any, type: any): void {
    // You can integrate with any toast library here
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Example with a simple alert (replace with your preferred toast library)
    if (typeof window !== 'undefined') {
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }
}

// Request Interceptor
class RequestInterceptor {
  private static instance: RequestInterceptor;

  private constructor() {}

  static getInstance(): RequestInterceptor {
    if (!RequestInterceptor.instance) {
      RequestInterceptor.instance = new RequestInterceptor();
    }
    return RequestInterceptor.instance;
  }

  intercept(config: any): any {
    const tokenManager = TokenManager.getInstance();
    const token = tokenManager.getToken();
    // Add default headers
    const headers: any = {
      'Content-Type': 'application/json',
    //   'accept-language': environment.language,
    //   'tokenization': environment.encryptedData.toString(),
      ...config.headers,
    };

    // Add authorization header if token exists
    if (token && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    headers['X-Request-Timestamp'] = new Date().toISOString();

    return {
      ...config,
      headers,
    };
  }
}

// Response Interceptor
class ResponseInterceptor {
  private static instance: ResponseInterceptor;

  private constructor() {}

  static getInstance(): ResponseInterceptor {
    if (!ResponseInterceptor.instance) {
      ResponseInterceptor.instance = new ResponseInterceptor();
    }
    return ResponseInterceptor.instance;
  }

  async intercept(response: any): Promise<any> {
    const responseData = await response.json().catch(() => ({}));

    // Handle different HTTP status codes
    if (response.ok) {
      return responseData
      // return {
      //   success: true,
      //   data: responseData.data || responseData,
      //   message: responseData.message,
      //   status: response.status,
      // };
    }

    // Handle specific error cases
    switch (response.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        TokenManager.getInstance().removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'Authentication required. Please login again.',
          status: response.status,
        };

      case 403:
        return {
          success: false,
          error: 'Access denied. You don\'t have permission to perform this action.',
          status: response.status,
        };

      case 404:
        return {
          success: false,
          error: 'Resource not found.',
          status: response.status,
        };

      case 422:
        return {
          success: false,
          error: responseData.message || 'Validation error occurred.',
          status: response.status,
        };

      case 429:
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
          status: response.status,
        };

      case 500:
        return {
          success: false,
          error: 'Internal server error. Please try again later.',
          status: response.status,
        };

      default:
        return {
          success: false,
          error: responseData.message || `Request failed with status ${response.status}`,
          status: response.status,
        };
    }
  }
}

// API Service Class
class ApiService {
  private static instance: ApiService;
  private requestInterceptor: any;
  private responseInterceptor: any;
  private currentUserService: any;

  private constructor() {
    this.requestInterceptor = RequestInterceptor.getInstance();
    this.responseInterceptor = ResponseInterceptor.getInstance();
    this.currentUserService = CurrentUserService.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest(config: any): Promise<any> {
    const interceptedConfig = this.requestInterceptor.intercept(config);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${interceptedConfig.url}`, {
        method: interceptedConfig.method,
        headers: interceptedConfig.headers,
        body: interceptedConfig.data ? JSON.stringify(interceptedConfig.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.responseInterceptor.intercept(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout. Please try again.',
            status: 408,
          };
        }
      }

      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: 0,
      };
    }
  }

  /**
   * Generic Get Method
   */
  async getApi(apiUrl: any): Promise<any> {
    try {
      return await this.makeRequest({
        method: 'GET',
        url: apiUrl,
      });
    } catch (error) {
      this.errorHandler(error, apiUrl);
      throw error;
    }
  }

  /**
   * Generic Post Method
   */
  async postApi(apiUrl: any, body: any): Promise<any> {
    try {
      return await this.makeRequest({
        method: 'POST',
        url: apiUrl,
        data: body,
      });
    } catch (error) {
      this.errorHandler(error, apiUrl);
      throw error;
    }
  }

  /**
   * Generic PUT Method
   */
  async putApi(apiUrl: any, body: any): Promise<any> {
    try {
      return await this.makeRequest({
        method: 'PUT',
        url: apiUrl,
        data: body,
      });
    } catch (error) {
      this.errorHandler(error, apiUrl);
      throw error;
    }
  }

  /**
   * Generic Delete Method
   */
  async delete(apiUrl: any): Promise<any> {
    try {
      return await this.makeRequest({
        method: 'DELETE',
        url: apiUrl,
      });
    } catch (error) {
      this.errorHandler(error, apiUrl);
      throw error;
    }
  }

  /**
   * Generic Send Form Data Method
   */
  async sendFormData(url: any, body: any): Promise<any> {
    try {
      return await this.makeRequest({
        method: 'POST',
        url: url,
        data: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      this.errorHandler(error, url);
      throw error;
    }
  }

  /**
   * Generic catch error method for all api's
   */
  errorHandler(error: any, apiUrl: any): void {
    if (error.error && error.error.code === 401) {
      TokenManager.getInstance().removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      this.currentUserService.swalSweetAlert(error.message || 'something went wrong', 'error');
    }
  }
}

// Export singleton instances
export const apiService = ApiService.getInstance();
export const tokenManager = TokenManager.getInstance();
export const currentUserService = CurrentUserService.getInstance();

// Convenience functions for common API operations
export const api = {
  // GET request
  get: (url: any) => apiService.getApi(url),

  // POST request
  post: (url: any, data?: any) => apiService.postApi(url, data),

  // PUT request
  put: (url: any, data?: any) => apiService.putApi(url, data),

  // DELETE request
  delete: (url: any) => apiService.delete(url),

  // Form data
  sendFormData: (url: any, data?: any) => apiService.sendFormData(url, data),

  // Token management
  getToken: () => tokenManager.getToken(),
  setToken: (token: any) => tokenManager.setToken(token),
  removeToken: () => tokenManager.removeToken(),
  isAuthenticated: () => tokenManager.isAuthenticated(),
};

// Error handler utility
export const handleApiError = (error: any, showAlert?: any) => {
  const errorMessage = error.error || 'An unexpected error occurred';
  
  if (showAlert) {
    currentUserService.swalSweetAlert(errorMessage, 'error');
  } else {
    console.error('API Error:', errorMessage);
  }
  
  return errorMessage;
};

// Success handler utility
export const handleApiSuccess = (response: any, showAlert?: any) => {
  const successMessage = response.message || 'Operation completed successfully';
  
  if (showAlert) {
    currentUserService.swalSweetAlert(successMessage, 'success');
  }
  
  return response;
};
