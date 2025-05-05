import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, { token, nuevaPassword });
      setMensaje('¡Contraseña actualizada! Redirigiendo al login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-xl shadow p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Nueva Contraseña</h2>

        {mensaje && <p className="text-green-600 text-sm mb-4 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Escribe la nueva contraseña"
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-blue-500"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

