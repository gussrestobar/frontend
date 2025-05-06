import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';

const Reservas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;

  const [reservas, setReservas] = useState([]);
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [reservaForm, setReservaForm] = useState({
    cliente_nombre: '',
    personas: '',
    fecha: '',
    hora: '',
    mesa_id: '',
    estado: 'pendiente',
    tenant_id: tenantId,
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);

  const obtenerReservas = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/${tenantId}`);
    setReservas(res.data);
  };

  const obtenerMesasDisponibles = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/mesas/disponibles/${tenantId}`);
    setMesasDisponibles(res.data);
  };

  const guardarReserva = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${editandoId}`, reservaForm);
        setEditandoId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, reservaForm);
      }
      setReservaForm({ cliente_nombre: '', personas: '', fecha: '', hora: '', mesa_id: '', estado: 'pendiente', tenant_id: tenantId });
      await Promise.all([obtenerReservas(), obtenerMesasDisponibles()]);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
    }
  };

  const editarReserva = (reserva) => {
    setReservaForm({ ...reserva });
    setEditandoId(reserva.id);
  };

  const confirmarEliminar = (reserva) => {
    setReservaAEliminar(reserva);
    setMostrarModal(true);
  };

  const eliminarReserva = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reservas/${reservaAEliminar.id}`);
      setMostrarModal(false);
      setReservaAEliminar(null);
      await Promise.all([obtenerReservas(), obtenerMesasDisponibles()]);
    } catch (err) {
      console.error('Error al eliminar reserva:', err);
    }
  };

  useEffect(() => {
    obtenerReservas();
    obtenerMesasDisponibles();
  }, []);

  const reservasFiltradas = reservas.filter((r) =>
    r.cliente_nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Reservas</h1>

        <form onSubmit={guardarReserva} className="grid md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Nombre del cliente" className="p-3 border rounded" value={reservaForm.cliente_nombre} onChange={(e) => setReservaForm({ ...reservaForm, cliente_nombre: e.target.value })} required />
          <input type="number" placeholder="Personas" className="p-3 border rounded" value={reservaForm.personas} onChange={(e) => setReservaForm({ ...reservaForm, personas: e.target.value })} required />
          <input type="date" className="p-3 border rounded" value={reservaForm.fecha} onChange={(e) => setReservaForm({ ...reservaForm, fecha: e.target.value })} required />
          <input type="time" className="p-3 border rounded" value={reservaForm.hora} onChange={(e) => setReservaForm({ ...reservaForm, hora: e.target.value })} required />

          <select className="p-3 border rounded" value={reservaForm.mesa_id} onChange={(e) => setReservaForm({ ...reservaForm, mesa_id: e.target.value })} required>
            <option value="">Selecciona una mesa</option>
            {mesasDisponibles.length === 0 ? (
              <option disabled>No hay mesas disponibles</option>
            ) : (
              mesasDisponibles.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa #{mesa.numero} - Capacidad: {mesa.capacidad}
                </option>
              ))
            )}
          </select>

          <select className="p-3 border rounded" value={reservaForm.estado} onChange={(e) => setReservaForm({ ...reservaForm, estado: e.target.value })}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
            {editandoId ? 'Actualizar Reserva' : 'Registrar Reserva'}
          </button>
        </form>

        <input
          type="text"
          placeholder="Buscar por cliente..."
          className="w-full mb-6 p-3 border rounded"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservasFiltradas.map((reserva, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-bold text-orange-600">{reserva.cliente_nombre}</h3>
              <p className="text-gray-700">Personas: {reserva.personas}</p>
              <p className="text-gray-700">Fecha: {reserva.fecha}</p>
              <p className="text-gray-700">Hora: {reserva.hora}</p>
              <p className="text-gray-700">Mesa: #{reserva.numero_mesa || reserva.mesa_id || 'No asignada'}</p>
              <p className={`text-sm font-medium ${
                reserva.estado === 'confirmada' ? 'text-green-600' :
                reserva.estado === 'cancelada' ? 'text-red-600' :
                'text-amber-600'
              }`}>
                Estado: {reserva.estado}
              </p>
              <div className="flex justify-between mt-4">
                <button onClick={() => editarReserva(reserva)} className="text-sm text-blue-600 hover:underline">Editar</button>
                <button onClick={() => confirmarEliminar(reserva)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Deseas eliminar esta reserva?</h3>
            <p className="mb-4 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarModal(false)} className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={eliminarReserva} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
