const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getSales, createSale, updateSale, deleteSale } = require('../controllers/salesController');

const router = express.Router();

router.get('/', authenticateToken, getSales);
router.post('/', authenticateToken, createSale);
router.put('/:id', authenticateToken, updateSale);
router.delete('/:id', authenticateToken, deleteSale);

module.exports = router;
