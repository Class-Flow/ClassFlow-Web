import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Sanitize URL for production
if (API_URL.includes('railway.app') || API_URL.includes('vercel.app')) {
    if (!API_URL.startsWith('http')) {
        API_URL = `https://${API_URL}`;
    } else if (API_URL.startsWith('http://')) {
        API_URL = API_URL.replace('http://', 'https://');
    }
}

// Ensure the URL ends with /api if it's not localhost and doesn't already end with it
if (!API_URL.includes('localhost') && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
    // Remove trailing slash if exists before appending /api
    if (API_URL.endsWith('/')) {
        API_URL = API_URL.slice(0, -1);
    }
    API_URL = `${API_URL}/api`;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;
