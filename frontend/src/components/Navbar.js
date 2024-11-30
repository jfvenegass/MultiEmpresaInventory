import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">
          <Link to="/">Sistema de Gestión</Link>
        </h1>
      </div>
      <div className="space-x-4">
        <Link to="/categories" className="hover:underline">
          Categorías
        </Link>
        <Link to="/products" className="hover:underline">
          Productos
        </Link>
        <Link to="/sales" className="hover:underline">
          Ventas
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
