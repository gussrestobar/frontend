import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Usar la URL base sin el prefijo /api
const baseURL = API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 