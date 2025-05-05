import { useState } from 'react';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';
import logo from '../assets/logo-guss.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, { email });
      setMensaje('Correo enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Gus's" className="w-32" />
        </div>
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Recuperar Contraseña</h2>

        {mensaje && <p className="text-green-600 text-sm mb-4 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEnviar} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded transition"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
