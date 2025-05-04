import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import bg from '../assets/fondo-dashboard.png';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumen, setResumen] = useState({ reservas: 0, mesas: 0, total: 0 });
  const [nombreSucursal, setNombreSucursal] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/resumen/${tenantId}`);
        setResumen(res.data);
      } catch (err) {
        console.error('Error al obtener resumen:', err);
      }
    };

    const fetchSucursal = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tenants/${tenantId}`);
        setNombreSucursal(res.data.nombre);
      } catch (err) {
        console.error('Error al obtener el nombre de la sucursal:', err);
      }
    };

    fetchResumen();
    fetchSucursal();
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Reservas Hoy</h2>
            <p className="text-3xl font-bold text-orange-600 mt-2">{resumen.reservas}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Mesas Disponibles</h2>
            <p className="text-3xl font-bold text-green-500 mt-2">{resumen.mesas}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total del Mes</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">{resumen.total}</p>
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
