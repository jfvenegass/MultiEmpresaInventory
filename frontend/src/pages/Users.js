import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

function Users() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]); // Estado para empresas
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    rol: 'empleado',
    client_id: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchCompanies(); // Cargar empresas disponibles
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await apiClient.get('/clients/list'); // Endpoint correcto
      setCompanies(response.data);
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos enviados al backend:', form); // Log de los datos del formulario
  
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await apiClient.put(`/users/${editingUser.id}`, form);
      } else {
        // Crear un nuevo usuario
        await apiClient.post('/users', form);
      }
      fetchUsers();
      setForm({ nombre: '', email: '', rol: 'empleado', client_id: '', password: '' });
      setEditingUser(null);
    } catch (error) {
      console.error('Error al guardar el usuario:', error.response?.data || error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      nombre: user.nombre || '',       
      email: user.email || '',         
      rol: user.rol || 'empleado',     
      client_id: user.client_id || '', 
      password: '',                    
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

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
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required={!editingUser} // La contraseña es obligatoria solo al crear un usuario
          />
          <select
            name="rol"
            value={form.rol}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="admin">Administrador</option>
            <option value="empleado">Empleado</option>
          </select>
          <select
            name="client_id"
            value={form.client_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Selecciona una empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </form>

      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.nombre}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.rol}</td>
              <td className="border px-4 py-2">
                {companies.find((company) => company.id === user.client_id)?.nombre || 'N/A'}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
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

export default Users;
