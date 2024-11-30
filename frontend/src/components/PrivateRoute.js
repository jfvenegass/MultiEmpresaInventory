import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const location = useLocation(); // Ruta actual

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Configuración de rutas permitidas según el rol
  const routesByRole = {
    admin: ['/', '/clients', '/users', '/products', '/sales', '/categories'],
    empleado: ['/', '/products', '/sales', '/categories'],
  };

  const allowedRoutes = routesByRole[role] || [];

  // Mostrar mensaje de bienvenida para empleados en "/"
  if (role === 'empleado' && location.pathname === '/') {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold">¡Bienvenido!</h1>
        </div>
      </div>
    );
  }

  // Redirigir si la ruta actual no está permitida
  if (!allowedRoutes.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  // Renderizado de vistas
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {role === 'admin' && <Sidebar />}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

export default PrivateRoute;
