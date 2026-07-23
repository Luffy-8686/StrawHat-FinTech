import axios from 'axios';

// In production: VITE_API_URL = your Render backend URL (e.g. https://creditvision-api.onrender.com)
// In local dev:  proxy in vite.config.js forwards /api → http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  // Health check
  health: () => api.get('/health'),

  // Credit scoring
  submitCreditScore: (signals) => api.post('/credit-score', signals),

  // Risk profiling
  getQuestions: () => api.get('/risk-profile/questions'),
  submitRiskProfile: (answers) => api.post('/risk-profile', { answers }),

  // Investment advice
  getInvestmentAdvice: (riskBucket, monthlyAmount) =>
    api.post('/investment-advice', { riskBucket, monthlyAmount }),

  // Dashboard
  getProfiles: (params = {}) => api.get('/dashboard/profiles', { params }),
  getProfile: (id) => api.get(`/dashboard/profiles/${id}`),
  getStats: () => api.get('/dashboard/stats'),
};

export default apiClient;
