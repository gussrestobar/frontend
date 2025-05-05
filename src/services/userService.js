import api from '../config/api';

export const registrarUsuario = async (datos) => {
  return await api.post('/users/register', datos);
};

export const loginUsuario = async ({ email, password }) => {
  return await api.post('/users/login', { email, password });
};

export const solicitarRecuperacion = async (email) => {
  return await api.post('/users/forgot-password', { email });
};

export const resetearContrasena = async (token, nuevaPassword) => {
  return await api.post('/users/reset-password', { token, nuevaPassword });
};
  