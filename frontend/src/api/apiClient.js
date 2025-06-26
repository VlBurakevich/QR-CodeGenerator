import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getSession = () => apiClient.post('/auth/session');

export const generateQrCode = (params) => apiClient.post('/qrCode/generate', params);

export const saveQrCode = (qrData) => apiClient.post('/qrCode/', qrData);
export const getHistory = () => apiClient.get('/qrCode/');
export const deleteQrCode = id => apiClient.delete(`/qrCode/${id}`);

export default apiClient;