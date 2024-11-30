const { sql } = require('../config/db');

// Obtención de todas las ventas con sus ítems
const getSales = async (req, res) => {
  try {
    const salesResult = await sql.query(`
      SELECT * FROM sales
    `);

    const sales = salesResult.recordset;

    // Obteneción de detalles de cada venta
    for (let sale of sales) {
      const itemsResult = await sql.query(`
        SELECT si.id, si.product_id, si.cantidad, si.subtotal, p.nombre as product_name
        FROM sale_items si
        INNER JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = ${sale.id}
      `);
      sale.items = itemsResult.recordset;
    }

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Creación de una venta con sus ítems
const createSale = async (req, res) => {
  const { items, total } = req.body;
  const client_id = req.user.client_id; // Obtener client_id del token
  const user_id = req.user.id; // Obtener user_id del token

  console.log('Payload recibido en el backend:', JSON.stringify(req.body, null, 2));

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No se han proporcionado productos para la venta.' });
  }

  try {
    // Validar stock disponible para cada ítem
    for (const item of items) {
      const stockCheck = await sql.query(`
        SELECT cantidad_en_stock 
        FROM products 
        WHERE id = ${item.product_id} AND client_id = ${client_id}
      `);

      if (stockCheck.recordset.length === 0) {
        return res.status(400).json({ message: `Producto con ID ${item.product_id} no encontrado.` });
      }

      const availableStock = stockCheck.recordset[0].cantidad_en_stock;
      if (item.cantidad > availableStock) {
        return res.status(400).json({ message: `Stock insuficiente para el producto con ID ${item.product_id}.` });
      }
    }

    // Insertar la venta
    const saleResult = await sql.query(`
      INSERT INTO sales (client_id, user_id, total)
      OUTPUT Inserted.id
      VALUES (${client_id}, ${user_id}, ${total})
    `);

    const saleId = saleResult.recordset[0].id;

    console.log(`Venta registrada con ID: ${saleId}`);

    // Insertar los detalles de la venta y actualizar el stock
    for (const item of items) {
      await sql.query(`
        INSERT INTO sale_items (client_id, sale_id, product_id, cantidad, subtotal)
        VALUES (${client_id}, ${saleId}, ${item.product_id}, ${item.cantidad}, ${item.subtotal})
      `);

      await sql.query(`
        UPDATE products
        SET cantidad_en_stock = cantidad_en_stock - ${item.cantidad}
        WHERE id = ${item.product_id} AND client_id = ${client_id}
      `);
    }

    res.status(201).json({ message: 'Venta registrada exitosamente', saleId });
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ message: 'Error al registrar la venta.' });
  }
};



// Actualizar una venta existente
const updateSale = async (req, res) => {
  const { id } = req.params;
  const { total, items } = req.body;

  try {
    // Actualizar el total de la venta
    await sql.query(`
      UPDATE sales
      SET total = ${total}
      WHERE id = ${id}
    `);

    // Opcional: Puedes implementar lógica para actualizar ítems si es necesario

    res.status(200).json({ message: 'Venta actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Eliminación de una venta y revertir los cambios en inventario
const deleteSale = async (req, res) => {
  const { id } = req.params;
  const client_id = req.user.client_id;

  try {
    // Obtener los ítems de la venta
    const itemsResult = await sql.query(`
      SELECT * 
      FROM sale_items 
      WHERE sale_id = ${id} AND client_id = ${client_id}
    `);

    const items = itemsResult.recordset;

    // Revertir el stock de los productos
    for (const item of items) {
      await sql.query(`
        UPDATE products
        SET cantidad_en_stock = cantidad_en_stock + ${item.cantidad}
        WHERE id = ${item.product_id} AND client_id = ${client_id}
      `);
    }

    // Eliminar los ítems y la venta
    await sql.query(`DELETE FROM sale_items WHERE sale_id = ${id} AND client_id = ${client_id}`);
    await sql.query(`DELETE FROM sales WHERE id = ${id} AND client_id = ${client_id}`);

    res.status(200).json({ message: 'Venta eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ message: 'Error al eliminar la venta.' });
  }
};

module.exports = { getSales, createSale, deleteSale, updateSale };
