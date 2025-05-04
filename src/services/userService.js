import axios from 'axios';

const API = 'http://localhost:3000/api';

export const registrarUsuario = async (datos) => {
  return await axios.post(`${API}/users/register`, datos);
};

export const loginUsuario = async ({ email, password }) => {
  return await axios.post(`${API}/users/login`, { email, password });
};

export const solicitarRecuperacion = async (email) => {
    return await axios.post(`${API}/users/forgot-password`, { email });
  };
  
  export const resetearContrasena = async (token, nuevaPassword) => {
    return await axios.post(`${API}/users/reset-password`, { token, nuevaPassword });
  };
  