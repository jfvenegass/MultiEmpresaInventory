const { sql } = require('../config/db');

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM categories');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías.' });
  }
};

// Obtener lista de categorías
const getCategoryList = async (req, res) => {
  try {
    const result = await sql.query('SELECT id, nombre FROM categories');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener la lista de categorías:', error);
    res.status(500).json({ message: 'Error al obtener la lista de categorías.' });
  }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  const { nombre, descripcion, client_id } = req.body;
  try {
    if (!nombre || !client_id) {
      return res.status(400).json({ message: 'El nombre y el client_id son obligatorios.' });
    }
    await sql.query(`
      INSERT INTO categories (nombre, descripcion, client_id)
      VALUES ('${nombre}', '${descripcion}', ${client_id})
    `);
    res.status(201).json({ message: 'Categoría creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ message: 'Error al crear la categoría.' });
  }
};

// Actualizar una categoría existente
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    await sql.query(`
      UPDATE categories
      SET nombre = '${nombre}', descripcion = '${descripcion}'
      WHERE id = ${id}
    `);
    res.status(200).json({ message: 'Categoría actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ message: 'Error al actualizar la categoría.' });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query(`DELETE FROM categories WHERE id = ${id}`);
    res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ message: 'Error al eliminar la categoría.' });
  }
};

module.exports = { getCategoryList,getCategories, createCategory, updateCategory, deleteCategory };
