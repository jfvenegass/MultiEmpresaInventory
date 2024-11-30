const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  registerClient,
  updateClient,
  deleteClient,
  getClientList // Asegúrate de importar este controlador
} = require('../controllers/clientController');

// Rutas para empresas
router.get('/', getClients); // Obtener todas las empresas
router.post('/', createClient); // Crear una nueva empresa
router.post('/register', registerClient); // Registrar una nueva empresa con administrador
router.put('/:id', updateClient); // Actualizar una empresa
router.delete('/:id', deleteClient); // Eliminar una empresa
router.get('/list', getClientList); // Endpoint para obtener la lista de empresas

module.exports = router;
