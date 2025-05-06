import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';

const Reservas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;

  const [reservas, setReservas] = useState([]);
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [errores, setErrores] = useState({});
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

  // Función para validar el nombre
  const validarNombre = (nombre) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre);
  };

  // Función para validar la fecha
  const validarFecha = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaReserva = new Date(fecha);
    const unMesDespues = new Date();
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);
    return fechaReserva >= hoy && fechaReserva <= unMesDespues;
  };

  // Función para validar la hora
  const validarHora = (hora) => {
    const [horas] = hora.split(':').map(Number);
    return horas >= 8 && horas <= 22;
  };

  // Función para determinar el turno
  const determinarTurno = (hora) => {
    const [horas] = hora.split(':').map(Number);
    return horas < 12 ? 'mañana' : 'tarde';
  };

  const obtenerReservas = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/${tenantId}`);
    setReservas(res.data);
  };

  const obtenerMesasDisponibles = async () => {
    // Validar que fecha y hora estén presentes y tengan el formato correcto
    if (!reservaForm.fecha || !reservaForm.hora) {
      setMesasDisponibles([]);
      return;
    }

    // Validar formato de hora (HH:MM)
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(reservaForm.hora)) {
      setMesasDisponibles([]);
      return;
    }
    
    try {
      console.log('Obteniendo mesas para:', reservaForm.fecha, reservaForm.hora);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/mesas/disponibles/${tenantId}`,
        { 
          params: { 
            fecha: reservaForm.fecha, 
            hora: reservaForm.hora 
          }
        }
      );
      console.log('Mesas disponibles:', res.data);
      setMesasDisponibles(res.data);
    } catch (err) {
      console.error('Error al obtener mesas disponibles:', err);
      setMesasDisponibles([]);
    }
  };

  // Actualizar mesas disponibles cuando cambie la fecha u hora
  useEffect(() => {
    const timer = setTimeout(() => {
      obtenerMesasDisponibles();
    }, 300); // Pequeño retraso para evitar múltiples llamadas

    return () => clearTimeout(timer);
  }, [reservaForm.fecha, reservaForm.hora]);

  // Limpiar mesa seleccionada cuando cambie la fecha u hora
  useEffect(() => {
    setReservaForm(prev => ({ ...prev, mesa_id: '' }));
  }, [reservaForm.fecha, reservaForm.hora]);

  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value;
    if (nuevaFecha) {
      setReservaForm(prev => ({ 
        ...prev, 
        fecha: nuevaFecha,
        mesa_id: '' 
      }));
    }
  };

  const handleHoraChange = (e) => {
    const nuevaHora = e.target.value;
    if (nuevaHora) {
      setReservaForm(prev => ({ 
        ...prev, 
        hora: nuevaHora,
        mesa_id: '' 
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!reservaForm.cliente_nombre) {
      nuevosErrores.cliente_nombre = 'El nombre es requerido';
    } else if (!validarNombre(reservaForm.cliente_nombre)) {
      nuevosErrores.cliente_nombre = 'Solo se permiten letras y espacios';
    }

    // Validar personas
    if (!reservaForm.personas) {
      nuevosErrores.personas = 'El número de personas es requerido';
    } else if (isNaN(reservaForm.personas) || reservaForm.personas < 1 || reservaForm.personas > 9) {
      nuevosErrores.personas = 'Debe ser un número entre 1 y 9';
    }

    // Validar fecha
    if (!reservaForm.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida';
    } else if (!validarFecha(reservaForm.fecha)) {
      nuevosErrores.fecha = 'La fecha debe estar entre hoy y un mes después';
    }

    // Validar hora
    if (!reservaForm.hora) {
      nuevosErrores.hora = 'La hora es requerida';
    } else if (!validarHora(reservaForm.hora)) {
      nuevosErrores.hora = 'La hora debe estar entre 8:00 y 22:00';
    }

    // Validar mesa
    if (!reservaForm.mesa_id) {
      nuevosErrores.mesa_id = 'Debes seleccionar una mesa';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarReserva = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      if (editandoId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/reservas/${editandoId}`, reservaForm);
        setEditandoId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, reservaForm);
      }
      setReservaForm({ cliente_nombre: '', personas: '', fecha: '', hora: '', mesa_id: '', estado: 'pendiente', tenant_id: tenantId });
      setErrores({});
      await Promise.all([obtenerReservas(), obtenerMesasDisponibles()]);
    } catch (err) {
      console.error('Error al guardar reserva:', err);
    }
  };

  const editarReserva = (reserva) => {
    setReservaForm({ ...reserva });
    setEditandoId(reserva.id);
    setErrores({});
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
          <div>
            <input 
              type="text" 
              placeholder="Nombre del cliente" 
              className={`w-full p-3 border rounded ${errores.cliente_nombre ? 'border-red-500' : ''}`} 
              value={reservaForm.cliente_nombre} 
              onChange={(e) => setReservaForm({ ...reservaForm, cliente_nombre: e.target.value })} 
              required 
            />
            {errores.cliente_nombre && <p className="text-red-500 text-sm mt-1">{errores.cliente_nombre}</p>}
          </div>

          <div>
            <input 
              type="number" 
              placeholder="Personas" 
              className={`w-full p-3 border rounded ${errores.personas ? 'border-red-500' : ''}`} 
              value={reservaForm.personas} 
              onChange={(e) => setReservaForm({ ...reservaForm, personas: e.target.value })} 
              min="1" 
              max="9"
              required 
            />
            {errores.personas && <p className="text-red-500 text-sm mt-1">{errores.personas}</p>}
          </div>

          <div>
            <input 
              type="date" 
              className={`w-full p-3 border rounded ${errores.fecha ? 'border-red-500' : ''}`} 
              value={reservaForm.fecha} 
              onChange={handleFechaChange}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
              required 
            />
            {errores.fecha && <p className="text-red-500 text-sm mt-1">{errores.fecha}</p>}
          </div>

          <div>
            <input 
              type="time" 
              className={`w-full p-3 border rounded ${errores.hora ? 'border-red-500' : ''}`} 
              value={reservaForm.hora} 
              onChange={handleHoraChange}
              min="08:00"
              max="22:00"
              required 
            />
            {errores.hora && <p className="text-red-500 text-sm mt-1">{errores.hora}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Turno {determinarTurno(reservaForm.hora)} ({reservaForm.hora < '12:00' ? '8:00 - 12:00' : '12:00 - 22:00'})
            </p>
          </div>

          <div>
            <select 
              className={`w-full p-3 border rounded ${errores.mesa_id ? 'border-red-500' : ''}`} 
              value={reservaForm.mesa_id} 
              onChange={(e) => setReservaForm({ ...reservaForm, mesa_id: e.target.value })} 
              required
              disabled={!reservaForm.fecha || !reservaForm.hora}
            >
              <option value="">Selecciona una mesa</option>
              {mesasDisponibles.length === 0 ? (
                <option disabled>No hay mesas disponibles para este turno</option>
              ) : (
                mesasDisponibles.map((mesa) => (
                  <option key={mesa.id} value={mesa.id}>
                    Mesa #{mesa.numero} - Capacidad: {mesa.capacidad}
                  </option>
                ))
              )}
            </select>
            {errores.mesa_id && <p className="text-red-500 text-sm mt-1">{errores.mesa_id}</p>}
          </div>

          <div>
            <select 
              className="w-full p-3 border rounded" 
              value={reservaForm.estado} 
              onChange={(e) => setReservaForm({ ...reservaForm, estado: e.target.value })}
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

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
