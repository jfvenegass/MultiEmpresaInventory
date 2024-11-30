import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
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
      const payload = { ...form, client_id: localStorage.getItem('client_id') || 1 }; // Asignar un client_id predeterminado si no está disponible
      if (!payload.nombre || !payload.client_id) {
        throw new Error('El nombre y el client_id son obligatorios.');
      }
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory.id}`, payload);
      } else {
        await apiClient.post('/categories', payload);
      }
      fetchCategories();
      setForm({ nombre: '', descripcion: '' });
      setEditingCategory(null);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setForm(category);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>
      {role === 'admin' && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la categoría"
              value={form.nombre}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
            {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
          </button>
        </form>
      )}

      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            {role === 'admin' && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="border px-4 py-2">{category.id}</td>
              <td className="border px-4 py-2">{category.nombre}</td>
              <td className="border px-4 py-2">{category.descripcion}</td>
              {role === 'admin' && (
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
