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
        if (!email || !password) return setError('Todos los campos son requeridos');
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return setError('Ingresa un correo electrónico válido');
        }

        await registrarUsuario({ email, password, rol: 'admin', tenant_id: tenantId });
        setMensaje('¡Usuario registrado con éxito!');
        const res = await loginUsuario({ email, password });
        localStorage.setItem('usuario', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        if (!email || !password) return setError('Todos los campos son requeridos');
        const res = await loginUsuario({ email, password });
        localStorage.setItem('usuario', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión o registrarse';
      setError(msg);
    }
  };

  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
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
        <div className="w-full max-w-sm bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo Gus's" className="w-32" />
          </div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
            {isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}
          </h2>

          {mensaje && <p className="text-green-600 text-sm text-center mb-2">{mensaje}</p>}
          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 border rounded focus:ring-2 ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded focus:ring-2 ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded transition"
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
                setEmail('');
                setPassword('');
                setTenantId('');
              }}
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate'}
            </span>
          </p>

          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-orange-600 hover:text-orange-700 text-sm">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
