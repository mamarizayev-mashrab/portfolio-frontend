/**
 * Axios API Instance
 * Configured with base URL and JWT interceptor
 */

import axios from 'axios';

// Production Backend URL (Render)
const PRODUCTION_API_URL = 'https://portfolio-backendportfolio-backend.onrender.com/api';

// Determine API URL with fallback
const getApiUrl = () => {
    // In development, use localhost
    if (import.meta.env.DEV) {
        return 'http://localhost:5000/api';
    }

    // In production, always use the correct Render backend URL
    // This ensures the frontend always connects to the correct backend
    return PRODUCTION_API_URL;
};

// Create axios instance
const api = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('portfolio-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('portfolio-token');

            // Redirect to login if in admin area
            if (window.location.pathname.startsWith('/admin') &&
                !window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
