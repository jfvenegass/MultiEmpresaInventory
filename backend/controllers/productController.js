const { sql } = require('../config/db');

// Obtenención de productos
const getProducts = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM products');
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Creación de producto
const createProduct = async (req, res) => {
  const { nombre, descripcion, precio, cantidad_en_stock, category_id, client_id } = req.body;

  try {
    // Validar que todos los campos están presentes
    if (!nombre || !precio || !cantidad_en_stock || !category_id || !client_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validar que el category_id existe en la tabla de categorías
    const categoryCheck = await sql.query(`SELECT id FROM categories WHERE id = ${category_id}`);
    if (categoryCheck.recordset.length === 0) {
      return res.status(400).json({ message: 'La categoría no existe.' });
    }

    // Validar que el client_id existe en la tabla de clientes
    const clientCheck = await sql.query(`SELECT id FROM clients WHERE id = ${client_id}`);
    if (clientCheck.recordset.length === 0) {
      return res.status(400).json({ message: 'El cliente no existe.' });
    }

    // Insertar el producto
    const query = `
      INSERT INTO products (client_id, nombre, descripcion, precio, cantidad_en_stock, category_id)
      VALUES (${client_id}, '${nombre}', '${descripcion}', ${precio}, ${cantidad_en_stock}, ${category_id})
    `;

    console.log('Ejecutando consulta SQL:', query); // Registrar consulta SQL para depuración

    await sql.query(query);

    res.status(201).json({ message: 'Producto creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el producto:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Error al crear el producto.' });
  }
};


// Actualización de producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, cantidad_en_stock } = req.body;
  try {
    await sql.query(`
      UPDATE products
      SET nombre = '${nombre}', descripcion = '${descripcion}', precio = ${precio}, cantidad_en_stock = ${cantidad_en_stock}
      WHERE id = ${id}
    `);
    res.status(200).json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminación de producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query(`DELETE FROM products WHERE id = ${id}`);
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
