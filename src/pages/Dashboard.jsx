import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import bg from '../assets/fondo-dashboard.png';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nombreSucursal, setNombreSucursal] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;
  const [estadisticas, setEstadisticas] = useState({
    total_reservas: 0,
    total_mesas: 0,
    total_platos: 0
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchSucursal = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tenants/${tenantId}`);
        setNombreSucursal(res.data.nombre);
      } catch (err) {
        console.error('Error al obtener el nombre de la sucursal:', err);
      }
    };

    const obtenerEstadisticas = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/estadisticas/${tenantId}`
        );
        console.log('Estadísticas recibidas:', res.data); // Para depuración
        setEstadisticas(res.data);
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        // Establecer valores por defecto en caso de error
        setEstadisticas({
          total_reservas: 0,
          total_mesas: 0,
          total_platos: 0
        });
      }
    };

    fetchSucursal();
    obtenerEstadisticas();
  }, [tenantId]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`fixed z-40 md:relative transition-all duration-300 bg-white/90 backdrop-blur-md shadow-xl w-64 p-6 ${sidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
        <h2 className="text-2xl font-bold text-orange-600 mb-6">Gus's Admin</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block text-gray-800 hover:text-orange-500">Dashboard</Link>
          <Link to="/menu" className="block text-gray-800 hover:text-orange-500">Gestión de Menú</Link>
          <Link to="/reservas" className="block text-gray-800 hover:text-orange-500">Reservas</Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div
        className="flex-1 bg-cover bg-center p-6 overflow-y-auto w-full"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Topbar móvil */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white drop-shadow">Dashboard</h1>
          <button onClick={toggleSidebar} className="text-white">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white drop-shadow mb-6">Bienvenido a la sucursal: {nombreSucursal}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Reservas */}
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Reservas Totales</p>
                <h2 className="text-3xl font-bold text-orange-600">{estadisticas.total_reservas}</h2>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tarjeta de Mesas */}
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Mesas Totales</p>
                <h2 className="text-3xl font-bold text-orange-600">{estadisticas.total_mesas}</h2>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tarjeta de Platos */}
          <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Platos en Menú</p>
                <h2 className="text-3xl font-bold text-orange-600">{estadisticas.total_platos}</h2>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Accesos Rápidos</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/menu" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 text-center">
              Gestión de Menú
            </Link>
            <Link to="/reservas" className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 text-center">
              Ver Reservas
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
