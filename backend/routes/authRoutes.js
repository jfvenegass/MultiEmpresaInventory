const express = require('express');
const { login, refreshAccessToken, logout, validateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/refresh', refreshAccessToken); // Endpoint para obtener un nuevo Access Token
router.post('/logout', logout); // Endpoint para cerrar sesión
router.get('/validate', validateToken);

module.exports = router;
