const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'Please add customer name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email']
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number']
    }
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeout', 'delivery'],
    required: true
  },
  tableNumber: {
    type: Number,
    default: null
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema); 