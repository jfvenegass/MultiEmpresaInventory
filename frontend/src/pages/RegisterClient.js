import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

function RegisterClient() {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    adminEmail: '',
    adminPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Datos enviados:', form); // Verifica los datos enviados
      await apiClient.post('/clients/register', form);
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirigir al login tras 3 segundos
    } catch (err) {
      console.error('Error al registrar la empresa:', err.response?.data || err);
      setError('Error al registrar la empresa. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Registrar Nueva Empresa</h2>
        {success && <p className="text-green-500">Empresa registrada exitosamente. Redirigiendo...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la empresa"
          value={form.nombre}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email de la empresa"
          value={form.email}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <h3 className="text-lg font-bold mt-4 mb-2">Datos del Administrador</h3>
        <input
          type="email"
          name="adminEmail"
          placeholder="Email del administrador"
          value={form.adminEmail}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="password"
          name="adminPassword"
          placeholder="Contraseña del administrador"
          value={form.adminPassword}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Registrar Empresa
        </button>
      </form>
    </div>
  );
}

export default RegisterClient;
