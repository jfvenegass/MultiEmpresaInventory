import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient'; // Asegúrate de que este archivo esté correctamente configurado

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth Token:', localStorage.getItem('authToken'));
    console.log('User Role:', localStorage.getItem('userRole'));
    console.log('Client ID:', localStorage.getItem('client_id'));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', form);
      const { token, rol, client_id } = response.data;

      console.log('Access Token:', token);
      console.log('User Role:', rol);
      console.log('Client ID:', client_id);

      // Guardar en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', rol);
      localStorage.setItem('client_id', client_id);

      // Redirigir
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo192.png" alt="Logo" className="h-16" /> {/* Cambié a usar /logo192.png */}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Ingresar
        </button>
        <p className="mt-4 text-sm">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Registra tu empresa aquí
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
