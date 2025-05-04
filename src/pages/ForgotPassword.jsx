import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post('http://localhost:3000/api/users/forgot-password', { email });
      setMensaje('Correo enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-xl shadow p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Recuperar Contraseña</h2>

        {mensaje && <p className="text-green-600 text-sm mb-4 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEnviar} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
