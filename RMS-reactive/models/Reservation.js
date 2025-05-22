const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date for reservation']
  },
  time: {
    type: String,
    required: [true, 'Please add a time for reservation']
  },
  partySize: {
    type: Number,
    required: [true, 'Please add number of guests'],
    min: [1, 'Party size must be at least 1']
  },
  tableNumber: {
    type: Number,
    default: null
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', reservationSchema); 