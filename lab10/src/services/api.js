import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const productsAPI = {
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export const cartAPI = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error);
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1, temperature = 'warm-white') => {
    try {
      const response = await api.post('/cart', { productId, quantity, temperature });
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error);
      throw error;
    }
  },

  updateCartItem: async (productId, quantity, temperature = 'warm-white') => {
    try {
      const response = await api.put(`/cart/${productId}`, { quantity, temperature });
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error);
      throw error;
    }
  },

  removeFromCart: async (productId, temperature = 'warm-white') => {
    try {
      const response = await api.delete(`/cart/${productId}`, { data: { temperature } });
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Cart API Error:', error);
      throw error;
    }
  }
};

export default api;