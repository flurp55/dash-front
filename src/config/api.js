// src/config/api.js

const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://voicepulsebackend-ghavb3gugkfrczbz.centralus-01.azurewebsites.net'
    : 'http://localhost:5000',
  
  ENDPOINTS: {
    LOGIN: '/api/login',
    COMPANIES: '/api/companies',
    QUESTIONS: '/api/questions'
  }
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export individual pieces for convenience
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const API_ENDPOINTS = API_CONFIG.ENDPOINTS;

export default API_CONFIG;