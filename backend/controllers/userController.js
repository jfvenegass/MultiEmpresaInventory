const bcrypt = require('bcrypt');
const { sql } = require('../config/db');

// Obteneción de todos los usuarios
const getUsers = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM users');
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Creación de un usuario
const createUser = async (req, res) => {
  const { nombre, email, rol, client_id, password } = req.body;

  // Validación de campos requeridos
  if (!nombre || !email || !rol || !client_id || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    await sql.query(`
      INSERT INTO users (client_id, nombre, email, password, rol)
      VALUES (${client_id}, '${nombre}', '${email}', '${hashedPassword}', '${rol}')
    `);

    res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualización de un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, client_id, password } = req.body;

  try {
    let updateQuery = `
      UPDATE users SET 
      nombre = '${nombre}', 
      email = '${email}', 
      rol = '${rol}', 
      client_id = ${client_id}`;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = '${hashedPassword}'`;
    }

    updateQuery += ` WHERE id = ${id}`;

    await sql.query(updateQuery);

    res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminación de un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query(`DELETE FROM users WHERE id = ${id}`);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
