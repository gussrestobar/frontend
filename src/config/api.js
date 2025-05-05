import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Usar la URL tal cual como está en el .env
const baseURL = API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 