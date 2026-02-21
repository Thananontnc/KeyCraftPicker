
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
});

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const backendUrl = apiBaseUrl.replace('/api', '');
    return `${backendUrl}${path}`;
};

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const token = parsedUser.token || localStorage.getItem('token');
                // We'll update login to store token inside user object or separately. 
                // Plan: Store token separately or inside user object. 
                // Let's support both for robustness, but storing inside user object is what our login route currently does? 
                // Wait, login route returns { token, data: user }. Frontend stores 'user' as data.
                // So token needs to be stored separately or merged.

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing user for token', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
