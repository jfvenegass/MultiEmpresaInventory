const express = require('express');
const { getAdjustments, createAdjustment, updateAdjustment, deleteAdjustment } = require('../controllers/adjustmentController');

const router = express.Router();

// Rutas para ajustes de inventario
router.get('/', getAdjustments); // Obtener todos los ajustes
router.post('/', createAdjustment); // Crear un ajuste
router.put('/:id', updateAdjustment); // Actualizar un ajuste
router.delete('/:id', deleteAdjustment); // Eliminar un ajuste

module.exports = router;
