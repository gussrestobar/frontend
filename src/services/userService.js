import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const registrarUsuario = async (datos) => {
  return await axios.post(`${API_URL}/users/register`, datos);
};

export const loginUsuario = async ({ email, password }) => {
  return await axios.post(`${API_URL}/users/login`, { email, password });
};

export const solicitarRecuperacion = async (email) => {
    return await axios.post(`${API_URL}/users/forgot-password`, { email });
  };
  
  export const resetearContrasena = async (token, nuevaPassword) => {
    return await axios.post(`${API_URL}/users/reset-password`, { token, nuevaPassword });
  };
  