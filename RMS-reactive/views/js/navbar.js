/**
 * Consistent Navbar Component
 * This script injects a consistent navbar across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Create navbar HTML
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <i class="fas fa-utensils me-2"></i>TASTE Restaurant
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}" href="index.html">
                            <i class="fas fa-home me-1"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'menu.html' ? 'active' : ''}" href="menu.html">
                            <i class="fas fa-book-open me-1"></i>Menu
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'add.html' ? 'active' : ''}" href="add.html">
                            <i class="fas fa-calendar-plus me-1"></i>Book Table
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'list.html' ? 'active' : ''}" href="list.html">
                            <i class="fas fa-list me-1"></i>Reservations
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'contact.html' ? 'active' : ''}" href="contact.html">
                            <i class="fas fa-envelope me-1"></i>Contact
                        </a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'cart.html' ? 'active' : ''}" href="cart.html">
                            <i class="fas fa-shopping-cart me-1"></i>Cart
                            <span class="cart-count" id="cartCount">0</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'login.html' ? 'active' : ''}" href="login.html">
                            <i class="fas fa-sign-in-alt me-1"></i>Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${currentPage === 'register.html' ? 'active' : ''}" href="register.html">
                            <i class="fas fa-user-plus me-1"></i>Register
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
    
    // Insert navbar at the beginning of the body
    const navbarContainer = document.createElement('div');
    navbarContainer.id = 'navbar-container';
    navbarContainer.innerHTML = navbarHTML;
    
    // Insert before the first child of body
    document.body.insertBefore(navbarContainer, document.body.firstChild);
    
    // Update cart count
    updateCartCount();
    
    // Check login status and update navbar accordingly
    updateNavbarAuth();
});

// Update cart count badge
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
        cartCount.textContent = totalItems;
        
        // Hide count if zero
        if (totalItems === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'inline-block';
        }
    }
}

// Update navbar based on authentication status
function updateNavbarAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.querySelector('a[href="login.html"]')?.parentNode;
    const registerLink = document.querySelector('a[href="register.html"]')?.parentNode;
    const navbarNav = document.querySelector('.navbar-nav.ms-auto');
    
    if (!loginLink || !registerLink || !navbarNav) return;
    
    if (isLoggedIn) {
        // Hide login and register links
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        
        // Create user dropdown if it doesn't exist
        if (!document.getElementById('userDropdown')) {
            const userDropdownHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle me-1"></i>Admin
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>My Profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-history me-2"></i>Order History</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </li>
            `;
            navbarNav.insertAdjacentHTML('beforeend', userDropdownHTML);
            
            // Add logout event listener
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            });
        }
    } else {
        // Show login and register links
        loginLink.style.display = '';
        registerLink.style.display = '';
        
        // Remove user dropdown if it exists
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.parentNode.remove();
        }
    }
}