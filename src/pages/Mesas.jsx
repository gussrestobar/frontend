import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';

const Mesas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;

  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState({ numero: '', capacidad: '', tenant_id: tenantId });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mesaAEliminar, setMesaAEliminar] = useState(null);

  const obtenerMesas = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/mesas/${tenantId}`);
    setMesas(res.data);
  };

  const guardarMesa = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/mesas/${editandoId}`, form);
      setEditandoId(null);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/mesas`, form);
    }
    setForm({ numero: '', capacidad: '', tenant_id: tenantId });
    obtenerMesas();
  };

  const editarMesa = (mesa) => {
    setForm({ ...mesa });
    setEditandoId(mesa.id);
  };

  const confirmarEliminar = (mesa) => {
    setMesaAEliminar(mesa);
    setMostrarModal(true);
  };

  const eliminarMesa = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/mesas/${mesaAEliminar.id}`);
    setMostrarModal(false);
    setMesaAEliminar(null);
    obtenerMesas();
  };

  useEffect(() => {
    obtenerMesas();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Gestión de Mesas</h1>

        <form onSubmit={guardarMesa} className="grid md:grid-cols-2 gap-4 mb-8">
          <input
            type="number"
            placeholder="Número de mesa"
            className="p-3 border rounded"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Capacidad"
            className="p-3 border rounded"
            value={form.capacidad}
            onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
            required
          />
          <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
            {editandoId ? 'Actualizar Mesa' : 'Agregar Mesa'}
          </button>
        </form>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mesas Registradas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mesas.map((mesa) => (
            <div key={mesa.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-bold text-orange-600">Mesa #{mesa.numero}</h3>
              <p className="text-gray-700">Capacidad: {mesa.capacidad}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => editarMesa(mesa)} className="text-sm text-blue-600 hover:underline">Editar</button>
                <button onClick={() => confirmarEliminar(mesa)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Deseas eliminar esta mesa?</h3>
            <p className="mb-4 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarModal(false)} className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={eliminarMesa} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mesas;
