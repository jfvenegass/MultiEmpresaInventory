const { sql } = require('../config/db');

// Obtención de las métricas principales del dashboard
const getDashboardMetrics = async (req, res) => {
  console.log('Entrando a getDashboardMetrics');
  try {
    // Consultar métricas desde la base de datos
    const totalClients = await sql.query('SELECT COUNT(*) AS total FROM clients');
    const totalProducts = await sql.query('SELECT COUNT(*) AS total FROM products');
    const totalSales = await sql.query('SELECT COUNT(*) AS total FROM sales');
    const lowStockProducts = await sql.query(`
      SELECT COUNT(*) AS total 
      FROM products 
      WHERE cantidad_en_stock < 10
    `);

    // Devolver los resultados al cliente
    res.status(200).json({
      totalClients: totalClients.recordset[0].total,
      totalProducts: totalProducts.recordset[0].total,
      totalSales: totalSales.recordset[0].total,
      lowStockProducts: lowStockProducts.recordset[0].total,
    });
  } catch (error) {
    console.error('Error en getDashboardMetrics:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};  

module.exports = { getDashboardMetrics };
