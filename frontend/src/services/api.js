import axios from 'axios';

// Create Axios client configured for proxy or explicit base URL
const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const productApi = {
  // Fetch products with search, category, pricing, sorting, pagination
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },

  // Fetch single product by ID
  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  // Get categories with counts
  getCategories: async () => {
    const response = await API.get('/products/categories');
    return response.data;
  },

  // Get stats overview
  getStats: async () => {
    const response = await API.get('/products/stats');
    return response.data;
  },

  // Seed sample products
  seedProducts: async () => {
    const response = await API.post('/products/seed');
    return response.data;
  }
};

export default productApi;
