import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBuilding, faUsers, faBox, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

  return (
    <aside className="w-64 bg-gray-700 text-white h-screen">
      <ul className="space-y-4 p-4">
        <li>
          <Link to="/" className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span>Dashboard</span>
          </Link>
        </li>
        {userRole === 'admin' && (
          <>
            <li>
              <Link to="/clients" className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faBuilding} />
                <span>Empresas</span>
              </Link>
            </li>
            <li>
              <Link to="/users" className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUsers} />
                <span>Usuarios</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
