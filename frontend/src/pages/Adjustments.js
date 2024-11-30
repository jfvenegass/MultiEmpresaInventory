import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';

function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    client_id: '',
    product_id: '',
    user_id: '',
    cantidad: '',
    motivo: ''
  });

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const response = await apiClient.get('/adjustments');
      setAdjustments(response.data);
    } catch (error) {
      console.error('Error al cargar los ajustes:', error);
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
      await apiClient.post('/adjustments', form);
      fetchAdjustments();
      setForm({ client_id: '', product_id: '', user_id: '', cantidad: '', motivo: '' });
    } catch (error) {
      console.error('Error al registrar el ajuste:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ajustes de Inventario</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="number"
          name="client_id"
          placeholder="ID de Empresa"
          value={form.client_id}
          onChange={handleInputChange}
          className="p-2 border rounded mb-2"
          required
        />
        <input
          type="number"
          name="product_id"
          placeholder="ID de Producto"
          value={form.product_id}
          onChange={handleInputChange}
          className="p-2 border rounded mb-2"
          required
        />
        <input
          type="number"
          name="user_id"
          placeholder="ID de Usuario"
          value={form.user_id}
          onChange={handleInputChange}
          className="p-2 border rounded mb-2"
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleInputChange}
          className="p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="motivo"
          placeholder="Motivo"
          value={form.motivo}
          onChange={handleInputChange}
          className="p-2 border rounded mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Registrar Ajuste
        </button>
      </form>

      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Usuario</th>
            <th>Cantidad</th>
            <th>Motivo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((adj) => (
            <tr key={adj.id}>
              <td>{adj.id}</td>
              <td>{adj.product_name}</td>
              <td>{adj.user_name}</td>
              <td>{adj.cantidad}</td>
              <td>{adj.motivo}</td>
              <td>{new Date(adj.fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Adjustments;
