import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

export const setSessionToken = (token) => {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export default api;