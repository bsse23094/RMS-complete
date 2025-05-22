// Form validation for reservation form
function validateReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const phone = form.elements['phone'].value.trim();
        const date = form.elements['date'].value;
        const startTime = form.elements['start_time'].value;
        const guests = form.elements['guests'].value;
        
        // Simple validation
        if (!name || !email || !phone || !date || !startTime || !guests) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }
        
        // If validation passes, save to localStorage and redirect
        saveReservation(form);
        showAlert('Reservation successfully booked!', 'success');
        setTimeout(() => {
            window.location.href = 'list.html';
        }, 1500);
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Load and display reservations
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const tbody = document.querySelector('#reservations tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (reservations.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="text-center">No reservations found</td>`;
        tbody.appendChild(row);
        return;
    }
    
    reservations.forEach((res, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${res.name}</td>
            <td>${res.date}</td>
            <td>${res.start_time} - ${res.end_time}</td>
            <td>Table ${res.table_id} (Floor ${res.floor})</td>
            <td>${res.guests}</td>
            <td><span class="status-badge status-${res.status || 'confirmed'}">${res.status || 'Confirmed'}</span></td>
            <td>
                <a href="#" class="action-btn view-btn" data-id="${index}" data-bs-toggle="tooltip" title="View Details">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="add.html?id=${index}" class="action-btn edit-btn" data-bs-toggle="tooltip" title="Edit">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="#" class="action-btn delete-btn" data-id="${index}" data-bs-toggle="tooltip" title="Cancel">
                    <i class="fas fa-times"></i>
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            deleteReservation(id);
        });
    });
}


function updateDashboardStats() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    // Count today's reservations
    const todaysReservations = reservations.filter(res => res.date === today).length;
    
    // Count upcoming reservations (future dates)
    const upcomingReservations = reservations.filter(res => new Date(res.date) > new Date()).length;
    
    // Update the stats on the page
    const statsContainer = document.getElementById('dashboardStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${reservations.length}</h3>
                        <p class="text-muted">Total Reservations</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${todaysReservations}</h3>
                        <p class="text-muted">Today's Reservations</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${upcomingReservations}</h3>
                        <p class="text-muted">Upcoming Reservations</p>
                    </div>
                </div>
            </div>
        `;
    }
}


// Toggle menu categories
function setupMenuFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            menuItems.forEach(item => {
                if (filter === 'all' || item.closest('.menu-section').id === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


// Save reservation to localStorage
function saveReservation(form) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const formData = new FormData(form);
    const reservation = {};
    
    formData.forEach((value, key) => {
        reservation[key] = value;
    });
    
    // Set default status
    reservation.status = 'confirmed';
    
    // Check if editing existing reservation
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        reservations[id] = reservation;
    } else {
        reservations.push(reservation);
    }
    
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Delete reservation
function deleteReservation(id) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.splice(id, 1);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        loadReservations();
        showAlert('Reservation cancelled successfully', 'success');
    }
}

// Setup event listeners for cart functionality
function setupCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items .card-body');
    
    if (!cartContainer) return;
    
    // Load cart items
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
        return;
    }
    
    cartContainer.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h5 class="cart-item-title">${item.name}</h5>
                <p class="text-muted mb-1">${item.description}</p>
                <span class="cart-item-price">Rs. ${item.price}</span>
            </div>
            <div class="cart-item-quantity ms-3">
                <button class="quantity-btn minus">-</button>
                <input type="text" class="quantity-input" value="${item.quantity || 1}" readonly>
                <button class="quantity-btn plus">+</button>
            </div>
            <button class="btn btn-sm btn-outline-danger ms-3 remove-item" data-id="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartItem(this.closest('.cart-item'), index, value - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            input.value = value + 1;
            updateCartItem(this.closest('.cart-item'), index, value + 1);
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.elements['username'].value;
        const password = this.elements['password'].value;
        
        // Simple mock authentication
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('isLoggedIn', 'true');
            showAlert('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('Invalid username or password', 'danger');
        }
    });
    
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const protectedElements = document.querySelectorAll('.admin-only');
    
    if (isLoggedIn) {
        protectedElements.forEach(el => el.style.display = 'block');
    } else {
        protectedElements.forEach(el => el.style.display = 'none');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.alert-container') || document.body;
    container.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    validateReservationForm();
    loadReservations();
    updateDashboardStats();
    setupMenuFilters();
    setupCart();
    setupAuth();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Check if editing reservation
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && document.getElementById('reservationForm')) {
        loadReservationForEdit(id);
    }
});

// Load reservation data for editing
function loadReservationForEdit(id) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations[id];
    
    if (!reservation) return;
    
    const form = document.getElementById('reservationForm');
    for (const key in reservation) {
        if (form.elements[key]) {
            form.elements[key].value = reservation[key];
        }
    }
    
    // Update form title
    const formTitle = document.querySelector('.reservation-card-header h3');
    if (formTitle) {
        formTitle.textContent = 'Edit Reservation';
    }
}