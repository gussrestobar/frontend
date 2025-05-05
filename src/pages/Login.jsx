import { useState, useEffect } from 'react';
import { registrarUsuario, loginUsuario } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper/modules';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';
import logo from '../assets/logo-guss.png';

import promo1 from '../assets/promo-burger.jpg';
import promo2 from '../assets/promo-alitas.jpg';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obtener sucursales desde backend
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tenants`)
      .then(res => setSucursales(res.data))
      .catch(err => {
        console.error('Error al obtener sucursales:', err);
      });
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      if (isRegistering) {
        if (!tenantId) return setError('Selecciona una sucursal');
        await registrarUsuario({ email, password, rol: 'admin', tenant_id: tenantId });
        setMensaje('¡Usuario registrado con éxito!');
        const res = await loginUsuario({ email, password });
        localStorage.setItem('usuario', JSON.stringify(res.data.user));
        localStorage.setItem('tenantId', res.data.tenantId);
        navigate('/dashboard');
      } else {
        const res = await loginUsuario({ email, password });
        localStorage.setItem('usuario', JSON.stringify(res.data.user));
        localStorage.setItem('tenantId', res.data.tenantId);
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión o registrarse';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
      {/* Carrusel lado izquierdo */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
        <Swiper
          effect="fade"
          autoplay={{ delay: 3000 }}
          modules={[EffectFade, Autoplay]}
          loop={true}
          className="w-full h-full"
        >
          <SwiperSlide>
            <img src={promo1} alt="Promo 1" className="w-full h-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={promo2} alt="Promo 2" className="w-full h-full object-cover" />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Formulario lado derecho */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
        <img src={logo} alt="Logo Gus's" className="w-2/6 mb-8" />
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-4">
          {isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}
        </h2>

        <div className="w-full max-w-sm p-6 rounded-lg shadow-lg" style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {mensaje && <p className="text-green-600 text-sm text-center mb-2">{mensaje}</p>}
          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">Sucursal</label>
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecciona una sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
            >
              {isRegistering ? 'Registrar' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <span
              className="text-orange-600 font-medium hover:underline cursor-pointer"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setMensaje('');
                setError('');
              }}
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate'}
            </span>
          </p>

          <p className="text-center text-sm text-gray-500 mt-2">
            <span
              className="text-orange-600 hover:underline cursor-pointer"
              onClick={() => navigate('/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
