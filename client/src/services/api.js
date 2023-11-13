import axios from 'axios';

// This "api" is imported in every other service

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export const setSessionToken = (token) => {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export default api;