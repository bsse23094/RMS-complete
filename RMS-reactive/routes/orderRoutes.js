const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');
const { orderValidator } = require('../middlewares/validators');

// Public routes
router.post('/', orderValidator, createOrder);

// Protected routes - Staff and Admin
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, updateOrder);
router.delete('/:id', [protect, authorize('admin')], deleteOrder);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router; 