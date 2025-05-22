const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');

// Home page
router.get('/', async (req, res) => {
  try {
    // Fetch featured menu items
    const featuredItems = await MenuItem.find({ featured: true }).limit(4);
    
    res.render('pages/index', {
      title: 'Welcome to Skime Restaurant',
      featuredItems
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('pages/index', {
      title: 'Welcome to Skime Restaurant',
      featuredItems: []
    });
  }
});

// Menu page
router.get('/menu', async (req, res) => {
  try {
    // Fetch menu items by category
    const appetizers = await MenuItem.find({ category: 'appetizer', isAvailable: true });
    const mainCourses = await MenuItem.find({ category: 'main course', isAvailable: true });
    const desserts = await MenuItem.find({ category: 'dessert', isAvailable: true });
    const beverages = await MenuItem.find({ category: 'beverage', isAvailable: true });
    
    res.render('pages/menu', {
      title: 'Our Menu',
      categories: {
        appetizers,
        mainCourses,
        desserts,
        beverages
      }
    });
  } catch (error) {
    console.error('Error loading menu page:', error);
    res.render('pages/menu', {
      title: 'Our Menu',
      categories: {
        appetizers: [],
        mainCourses: [],
        desserts: [],
        beverages: []
      }
    });
  }
});

// Reservation page
router.get('/reservations', (req, res) => {
  res.render('pages/reservations', {
    title: 'Book a Table'
  });
});

// Order page
router.get('/orders', (req, res) => {
  res.render('pages/orders', {
    title: 'Place an Order'
  });
});

// Reservation and Order List page
router.get('/list', (req, res) => {
  res.render('pages/list', {
    title: 'Reservations & Orders'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us'
  });
});

module.exports = router; 