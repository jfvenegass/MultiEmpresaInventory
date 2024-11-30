const bcrypt = require('bcrypt');
const { sql } = require('../config/db');

// Obtención de todas las empresas
const getClients = async (req, res) => {
  try {
    const result = await sql.query('SELECT * FROM clients');
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener lista de empresas
const getClientList = async (req, res) => {
  console.log('Entrando a getClientList');
  try {
    const result = await sql.query('SELECT id, nombre FROM clients');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener la lista de empresas:', error);
    res.status(500).json({ message: 'Error al obtener la lista de empresas.' });
  }
};

// Creación de una nueva empresa
const createClient = async (req, res) => {
  const { nombre, direccion, telefono, email } = req.body;
  try {
    await sql.query(`
      INSERT INTO clients (nombre, direccion, telefono, email)
      VALUES ('${nombre}', '${direccion}', '${telefono}', '${email}')
    `);
    res.status(201).json({ message: 'Empresa creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registro de una nueva empresa con administrador
const registerClient = async (req, res) => {
  const { nombre, direccion, telefono, email, adminEmail, adminPassword } = req.body;

  try {
    // Crear la empresa
    const clientResult = await sql.query(`
      INSERT INTO clients (nombre, direccion, telefono, email)
      OUTPUT Inserted.id
      VALUES ('${nombre}', '${direccion}', '${telefono}', '${email}')
    `);

    const clientId = clientResult.recordset[0].id;

    // Crear el administrador asociado
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await sql.query(`
      INSERT INTO users (client_id, nombre, email, password, rol)
      VALUES (${clientId}, 'Administrador', '${adminEmail}', '${hashedPassword}', 'admin')
    `);

    res.status(201).json({ message: 'Empresa y administrador registrados exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualización de una empresa
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email } = req.body;
  try {
    await sql.query(`
      UPDATE clients
      SET nombre = '${nombre}', direccion = '${direccion}', telefono = '${telefono}', email = '${email}'
      WHERE id = ${id}
    `);
    res.status(200).json({ message: 'Empresa actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminación de una empresa
const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query(`
      DELETE FROM clients WHERE id = ${id}
    `);
    res.status(200).json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClientList, getClients, createClient, registerClient, updateClient, deleteClient };
