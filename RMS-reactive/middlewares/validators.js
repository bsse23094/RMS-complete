const { check } = require('express-validator');

// User validation
exports.registerValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Menu item validation
exports.menuItemValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').isIn(['appetizer', 'main course', 'dessert', 'beverage'])
];

// Reservation validation
exports.reservationValidator = [
  check('customerName', 'Customer name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('date', 'Date is required').isISO8601().toDate(),
  check('time', 'Time is required').not().isEmpty(),
  check('partySize', 'Party size must be at least 1').isInt({ min: 1 })
];

// Order validation
exports.orderValidator = [
  check('customer.name', 'Customer name is required').not().isEmpty(),
  check('customer.email', 'Please include a valid email').isEmail(),
  check('customer.phone', 'Phone number is required').not().isEmpty(),
  check('items', 'Order must contain at least one item').isArray({ min: 1 }),
  check('orderType', 'Order type is required').isIn(['dine-in', 'takeout', 'delivery'])
]; 