// Menu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fondo from '../assets/fondo-dashboard.png';

const Menu = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tenantId = usuario?.tenant_id;

  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editando, setEditando] = useState(null);
  const [platoAEliminar, setPlatoAEliminar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    imagen_url: '',
    tenant_id: tenantId
  });

  const obtenerPlatos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/${tenantId}`);
    setPlatos(res.data);
  };

  const obtenerCategorias = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`);
    setCategorias(res.data);
  };

  const guardarPlato = async (e) => {
    e.preventDefault();
    if (editando !== null) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/menu/${editando}`, nuevoPlato);
      setEditando(null);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/menu`, nuevoPlato);
    }
    setNuevoPlato({ nombre: '', descripcion: '', precio: '', categoria_id: '', imagen_url: '', tenant_id: tenantId });
    obtenerPlatos();
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    if (!nuevaCategoria) return;
    await axios.post(`${import.meta.env.VITE_API_URL}/api/categorias`, { nombre: nuevaCategoria });
    setNuevaCategoria('');
    obtenerCategorias();
  };

  const subirImagen = async (e) => {
    const formData = new FormData();
    formData.append('imagen', e.target.files[0]);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
    setNuevoPlato({ ...nuevoPlato, imagen_url: res.data.url });
  };

  const editarPlato = (plato) => {
    setNuevoPlato({ ...plato, tenant_id: tenantId });
    setEditando(plato.id);
  };

  const confirmarEliminar = (plato) => {
    setPlatoAEliminar(plato);
    setMostrarModal(true);
  };

  const eliminarPlato = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/menu/${platoAEliminar.id}`);
    setMostrarModal(false);
    setPlatoAEliminar(null);
    obtenerPlatos();
  };

  useEffect(() => {
    obtenerPlatos();
    obtenerCategorias();
  }, [tenantId]);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur p-4 md:p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4 md:mb-6">Gestión del Menú</h1>

        <form onSubmit={guardarPlato} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Nombre del plato" 
              className="w-full p-2 md:p-3 border rounded focus:ring-2 ring-orange-500" 
              value={nuevoPlato.nombre} 
              onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })} 
              required 
            />
            <input 
              type="text" 
              placeholder="Precio (Bs)" 
              className="w-full p-2 md:p-3 border rounded focus:ring-2 ring-orange-500" 
              value={nuevoPlato.precio} 
              onChange={(e) => setNuevoPlato({ ...nuevoPlato, precio: e.target.value })} 
              required 
            />
            <select 
              className="w-full p-2 md:p-3 border rounded focus:ring-2 ring-orange-500" 
              value={nuevoPlato.categoria_id} 
              onChange={(e) => setNuevoPlato({ ...nuevoPlato, categoria_id: e.target.value })}
            >
              <option value="">Selecciona categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/jpg" 
              onChange={subirImagen} 
              className="w-full p-2 border rounded focus:ring-2 ring-orange-500" 
            />
            <p className="text-sm text-gray-500">Formatos permitidos: JPG, PNG (máximo 5MB)</p>
          </div>

          <div className="space-y-3">
            <textarea 
              placeholder="Descripción" 
              className="w-full h-full p-2 md:p-3 border rounded focus:ring-2 ring-orange-500" 
              rows="4"
              value={nuevoPlato.descripcion} 
              onChange={(e) => setNuevoPlato({ ...nuevoPlato, descripcion: e.target.value })}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="md:col-span-2 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition"
          >
            {editando !== null ? 'Actualizar Plato' : 'Guardar Plato'}
          </button>
        </form>

        {/* Formulario para crear categoría */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Crear Nueva Categoría</h2>
          <form onSubmit={crearCategoria} className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Nombre de la categoría" 
              className="flex-1 p-2 md:p-3 border rounded focus:ring-2 ring-orange-500" 
              value={nuevaCategoria} 
              onChange={(e) => setNuevaCategoria(e.target.value)} 
              required 
            />
            <button 
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Crear
            </button>
          </form>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Platos Registrados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platos.map((plato, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <img src={plato.imagen_url || 'https://via.placeholder.com/300'} alt={plato.nombre} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="text-xl font-bold text-orange-600">{plato.nombre}</h3>
              <p className="text-sm text-gray-600">{plato.categoria}</p>
              <p className="text-gray-800 mt-1">{plato.descripcion}</p>
              <p className="text-right font-bold text-green-600 mt-2">Bs {plato.precio}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => editarPlato(plato)} className="text-sm text-blue-600 hover:underline">Editar</button>
                <button onClick={() => confirmarEliminar(plato)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Deseas eliminar este plato?</h3>
            <p className="mb-4 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarModal(false)} className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
              <button onClick={eliminarPlato} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;