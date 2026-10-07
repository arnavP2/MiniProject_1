const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Buyer
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { artisan, products, totalAmount, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  const order = await Order.create({
    buyer: req.user.id,
    artisan,
    products,
    totalAmount,
    paymentMethod,
    fulfillmentMethod: 'Self-Pickup',
    status: 'Pending',
    paymentStatus: paymentMethod === 'UPI QR' ? 'Pending' : 'Pending'
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get logged in user orders (Buyer)
// @route   GET /api/orders/myorders
// @access  Private/Buyer
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ buyer: req.user.id }).populate('artisan', 'name artisanData location').populate('products.product', 'name images price');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Get orders for artisan shop
// @route   GET /api/orders/shop
// @access  Private/Artisan
exports.getShopOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ artisan: req.user.id }).populate('buyer', 'name email').populate('products.product', 'name images price');
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Update order status to Ready for Pickup
// @route   PUT /api/orders/:id/status
// @access  Private/Artisan
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Make sure user owns this shop
  if (order.artisan.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  order.status = req.body.status || 'Ready for Pickup';
  await order.save();

  res.status(200).json({ success: true, data: order });
});

