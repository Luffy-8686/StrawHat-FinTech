import axios from 'axios';

// Production backend on Render
const PRODUCTION_API = 'https://strawhat-fintech.onrender.com';

// In local dev: Vite proxy forwards /api → localhost:5000
// In production (Vercel): use the Render backend URL
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BASE_URL = isLocalhost
  ? '/api'
  : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : `${PRODUCTION_API}/api`);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s — Render free tier can take ~20s to wake from sleep
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
