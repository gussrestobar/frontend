import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Asegurarse de que la URL base no termine con /api
const baseURL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 