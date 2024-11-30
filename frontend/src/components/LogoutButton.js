import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminación del token de localStorage
    localStorage.removeItem('authToken');

    // Redirige al login
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Cerrar Sesión
    </button>
  );
}

export default LogoutButton;
