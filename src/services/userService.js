import api from '../config/api';

export const registrarUsuario = async (datos) => {
  return await api.post('/api/users/register', datos);
};

export const loginUsuario = async ({ email, password }) => {
  return await api.post('/api/users/login', { email, password });
};

export const solicitarRecuperacion = async (email) => {
  return await api.post('/api/users/forgot-password', { email });
};

export const resetearContrasena = async (token, nuevaPassword) => {
  return await api.post('/api/users/reset-password', { token, nuevaPassword });
};
  