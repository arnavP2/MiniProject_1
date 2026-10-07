const express = require('express');
const { createOrder, getMyOrders, getShopOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('buyer'), createOrder);

router.route('/myorders')
  .get(protect, authorize('buyer'), getMyOrders);

router.route('/shop')
  .get(protect, authorize('artisan'), getShopOrders);

router.route('/:id/status')
  .put(protect, authorize('artisan'), updateOrderStatus);

module.exports = router;

