const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getStats,
  seedProducts
} = require('../controllers/productController');

// Categories & stats routes before :id route
router.get('/stats', getStats);
router.get('/categories', getCategories);
router.post('/seed', seedProducts);

// Core CRUD routes
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
