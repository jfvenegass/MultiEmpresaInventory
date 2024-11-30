const { sql } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Login de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query(`SELECT * FROM users WHERE email = '${email}'`);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.recordset[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar Access Token
    const token = jwt.sign(
      { id: user.id, client_id: user.client_id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      token,
      rol: user.rol,
      client_id: user.client_id,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Refrescar el Access Token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token requerido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Verificar si el token existe en la base de datos
    const tokenResult = await sql.query(`
      SELECT * FROM refresh_tokens WHERE token = '${refreshToken}'
    `);

    if (tokenResult.recordset.length === 0) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    // Generar nuevo Access Token
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }
};


// Logout y revocación del Refresh Token
const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token requerido' });
  }

  try {
    // Eliminar el Refresh Token de la base de datos
    await sql.query(`
      DELETE FROM refresh_tokens WHERE token = '${refreshToken}'
    `);

    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

// Validación de Access Token
const validateToken = (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { login, refreshAccessToken, logout, validateToken };
