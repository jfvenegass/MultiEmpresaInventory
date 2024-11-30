import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    totalProducts: 0,
    totalSales: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get('/dashboard/metrics');
        setMetrics(response.data);
      } catch (err) {
        console.error('Error al obtener las métricas del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Empresas</h2>
          <p className="text-2xl">{metrics.totalClients}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Productos</h2>
          <p className="text-2xl">{metrics.totalProducts}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Ventas</h2>
          <p className="text-2xl">{metrics.totalSales}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">Productos con Bajo Stock</h2>
          <p className="text-2xl">{metrics.lowStockProducts}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
