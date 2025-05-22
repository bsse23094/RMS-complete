const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../middlewares/validators');

// Public routes
router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', [protect, authorize('admin')], getUsers);

module.exports = router; 