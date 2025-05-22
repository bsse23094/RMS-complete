const express = require('express');
const router = express.Router();
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/auth');
const { reservationValidator } = require('../middlewares/validators');

// Public routes
router.post('/', reservationValidator, createReservation);

// Protected routes - Staff and Admin
router.get('/', protect, getReservations);
router.get('/:id', protect, getReservation);
router.put('/:id', protect, updateReservation);
router.delete('/:id', [protect, authorize('admin')], deleteReservation);
router.patch('/:id/status', protect, updateReservationStatus);

module.exports = router; 