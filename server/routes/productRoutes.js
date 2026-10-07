const express = require('express');
const { createProduct, getProducts, getMyProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('artisan'), upload.array('images', 5), createProduct);

router.route('/me')
  .get(protect, authorize('artisan'), getMyProducts);

module.exports = router;

