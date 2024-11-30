const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Rutas para usuarios
router.get('/', getUsers); // Obtener todos los usuarios
router.post('/', createUser); // Crear un usuario
router.put('/:id', updateUser); // Actualizar un usuario
router.delete('/:id', deleteUser); // Eliminar un usuario

module.exports = router;
