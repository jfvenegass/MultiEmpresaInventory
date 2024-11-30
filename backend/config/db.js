const sql = require('mssql');

// Configuración de la base de datos con autenticación SQL (SQL Login)
const dbConfig = {
  server: 'JOSEPHVENEGAS', // Cambia esto por tu servidor
  database: 'MultiEmpresaInventory', // Cambia esto por tu base de datos
  user: 'sa', // Cambia esto por tu usuario
  password: '37450626', // Cambia esto por tu contraseña
  options: {
    encrypt: true, // Solo necesario para Azure
    trustServerCertificate: true // Confía en certificados autofirmados
  },
};

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Conexión exitosa a la base de datos con autenticación SQL');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
};

module.exports = { connectDB, sql };
