const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryList,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/list', getCategoryList); // Usa la función correctamente

module.exports = router;
