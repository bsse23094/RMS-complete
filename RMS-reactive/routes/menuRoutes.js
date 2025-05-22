const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory
} = require('../controllers/menuController');
const { protect, authorize } = require('../middlewares/auth');
const { menuItemValidator } = require('../middlewares/validators');

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.get('/category/:category', getMenuItemsByCategory);

// Protected routes - Admin only
router.post('/', [protect, authorize('admin'), menuItemValidator], createMenuItem);
router.put('/:id', [protect, authorize('admin')], updateMenuItem);
router.delete('/:id', [protect, authorize('admin')], deleteMenuItem);

module.exports = router; 