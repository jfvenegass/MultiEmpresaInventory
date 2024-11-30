const { sql } = require('../config/db');

// Obtener todos los ajustes de inventario
const getAdjustments = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT a.*, p.nombre AS product_name, u.nombre AS user_name
      FROM adjustments a
      JOIN products p ON a.product_id = p.id
      JOIN users u ON a.user_id = u.id
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un ajuste de inventario
const createAdjustment = async (req, res) => {
  const { client_id, product_id, user_id, cantidad, motivo } = req.body;

  try {
    // Crear el ajuste
    await sql.query(`
      INSERT INTO adjustments (client_id, product_id, user_id, cantidad, motivo)
      VALUES (${client_id}, ${product_id}, ${user_id}, ${cantidad}, '${motivo}')
    `);

    // Actualizar el inventario del producto
    await sql.query(`
      UPDATE products
      SET cantidad_en_stock = cantidad_en_stock + ${cantidad}
      WHERE id = ${product_id} AND client_id = ${client_id}
    `);

    res.status(201).json({ message: 'Ajuste de inventario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un ajuste de inventario
const updateAdjustment = async (req, res) => {
  const { id } = req.params;
  const { cantidad, motivo } = req.body;

  try {
    await sql.query(`
      UPDATE adjustments
      SET cantidad = ${cantidad}, motivo = '${motivo}'
      WHERE id = ${id}
    `);

    res.status(200).json({ message: 'Ajuste de inventario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un ajuste de inventario
const deleteAdjustment = async (req, res) => {
  const { id } = req.params;

  try {
    // Recuperar el ajuste antes de eliminarlo
    const adjustmentResult = await sql.query(`
      SELECT * FROM adjustments WHERE id = ${id}
    `);
    const adjustment = adjustmentResult.recordset[0];

    if (!adjustment) {
      return res.status(404).json({ message: 'Ajuste no encontrado' });
    }

    // Revertir el cambio en inventario
    await sql.query(`
      UPDATE products
      SET cantidad_en_stock = cantidad_en_stock - ${adjustment.cantidad}
      WHERE id = ${adjustment.product_id} AND client_id = ${adjustment.client_id}
    `);

    // Eliminar el ajuste
    await sql.query(`DELETE FROM adjustments WHERE id = ${id}`);

    res.status(200).json({ message: 'Ajuste de inventario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdjustments, createAdjustment, updateAdjustment, deleteAdjustment };
