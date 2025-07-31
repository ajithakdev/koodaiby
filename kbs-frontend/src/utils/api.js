// API utility functions for KBS Frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Items API
  async getItems(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/items?${queryParams}` : '/items';
    return this.request(endpoint);
  }

  async getItem(id) {
    return this.request(`/items/${id}`);
  }

  async createItem(itemData) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(id, itemData) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload for items with images
  async createItemWithImage(formData) {
    return this.request('/items', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async updateItemWithImage(id, formData) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // PIN API
  async generatePin(phone) {
    return this.request('/generate-pin', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyPin(phone, pin) {
    return this.request('/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ phone, pin }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  createItemWithImage,
  updateItemWithImage,
  generatePin,
  verifyPin,
  healthCheck,
} = apiService;