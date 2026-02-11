/**
 * Axios API Instance
 * Configured with base URL and JWT interceptor
 */

import axios from 'axios';

// Production Backend URL (Render)
const PRODUCTION_API_URL = 'https://portfolio-backendportfolio-backend.onrender.com/api';

const getApiUrl = () => {
    // In development mode explicitly, use localhost
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:5000/api';
    }

    // In production, always use this specific URL. 
    // We remove the env var check to prevent incorrect overrides in Vercel.
    const url = 'https://portfolio-backendportfolio-backend.onrender.com/api';
    console.log('Using API URL:', url); // For debugging
    return url;
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

        // Prevent caching
        config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        config.headers['Pragma'] = 'no-cache';
        config.headers['Expires'] = '0';

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
