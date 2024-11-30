import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await apiClient.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        // Actualizar cliente existente
        await apiClient.put(`/clients/${editingClient.id}`, form);
      } else {
        // Crear nuevo cliente
        await apiClient.post('/clients', form);
      }
      fetchClients();
      setForm({ nombre: '', direccion: '', telefono: '', email: '' });
      setEditingClient(null);
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setForm(client);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Empresas</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          {editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}
        </button>
      </form>

      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td className="border px-4 py-2">{client.id}</td>
              <td className="border px-4 py-2">{client.nombre}</td>
              <td className="border px-4 py-2">{client.direccion}</td>
              <td className="border px-4 py-2">{client.telefono}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;
