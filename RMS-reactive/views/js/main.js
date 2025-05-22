// main.js - Main utility functions and page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize modals
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegisterModal = document.getElementById('showRegisterModal');
    const showLoginModal = document.getElementById('showLoginModal');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.show();
        });
    }
    
    if (showRegisterModal) {
        showRegisterModal.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
                setTimeout(() => {
                    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
                    registerModal.show();
                }, 500);
            }
        });
    }
    
    if (showLoginModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) {
                registerModal.hide();
                setTimeout(() => {
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                }, 500);
            }
        });
    }

    // Check authentication status on page load
    checkAuthStatus();
});

// Show notification for any action
function showNotification(message, type = 'success') {
    const notification = document.querySelector('.cart-notification');
    if (!notification) return;
    
    document.getElementById('cart-notification-text').textContent = message;
    
    if (type === 'error') {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
} 