import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Recommendations
export const getCategories = () => API.get('/recommendations/categories');
export const getRecommendations = (params) => API.get('/recommendations', { params });
export const getRecommendationById = (id) => API.get(`/recommendations/${id}`);
export const createRecommendation = (data) => API.post('/recommendations', data);
export const updateRecommendation = (id, data) => API.put(`/recommendations/${id}`, data);
export const deleteRecommendation = (id) => API.delete(`/recommendations/${id}`);

// Properties
export const submitProperty = (data) => API.post('/properties', data);
export const getMyProperties = () => API.get('/properties/my');
export const getPropertyWithRecs = (id) => API.get(`/properties/${id}`);
export const getAllProperties = () => API.get('/properties');
export const updatePropertyStatus = (id, status) => API.patch(`/properties/${id}/status`, { status });

// Listings
export const getListings = (params) => API.get('/listings', { params });
export const getListingById = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data);
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const getDashboardStats = () => API.get('/listings/stats');

export default API;
