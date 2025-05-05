import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Asegurarse de que la URL base termine con /api
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 