import axios from 'axios';

// Prioritize the environment variable; fallback to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5156/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add the JWT token to requests if it exists in localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;