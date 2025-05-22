/**
 * Skime Restaurant Management System
 * Authentication Module
 * 
 * This module handles user registration, login, and session management
 * using localStorage to store user data in JSON format.
 */

// Initialize users array from localStorage or create empty array if none exists
function initializeUsers() {
    const users = localStorage.getItem('skime_users');
    return users ? JSON.parse(users) : [];
}

// Save users array to localStorage
function saveUsers(users) {
    localStorage.setItem('skime_users', JSON.stringify(users));
}

// Check if email already exists in users array
function emailExists(email) {
    const users = initializeUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}


// Validate password strength
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 number, 1 special character
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
}

// Register a new user
function registerUser(userData) {
    // Check if email already exists
    if (emailExists(userData.email)) {
        return {
            success: false,
            message: 'Email already registered. Please use a different email or login.'
        };
    }
    
    // Validate password
    if (!validatePassword(userData.password)) {
        return {
            success: false,
            message: 'Password does not meet requirements.'
        };
    }
    
    // Get existing users
    const users = initializeUsers();
    
    // Create user object (excluding confirmPassword)
    const newUser = {
        id: Date.now().toString(), // Simple unique ID
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // In a real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    // Add new user to array
    users.push(newUser);
    
    // Save updated users array
    saveUsers(users);
    
    return {
        success: true,
        message: 'Registration successful!'
    };
}

// Authenticate user login
function loginUser(email, password) {
    const users = initializeUsers();
    
    // Find user with matching email and password
    const user = users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
    
    if (user) {
        // Create session data (excluding password)
        const sessionUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        };
        
        // Save to session storage
        sessionStorage.setItem('skime_current_user', JSON.stringify(sessionUser));
        
        return {
            success: true,
            user: sessionUser
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password.'
        };
    }
}

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('skime_current_user') !== null;
}

// Get current logged in user
function getCurrentUser() {
    const userData = sessionStorage.getItem('skime_current_user');
    return userData ? JSON.parse(userData) : null;
}

// Logout user
function logoutUser() {
    sessionStorage.removeItem('skime_current_user');
}

// Update navigation based on login status
function updateNavigation() {
    const loggedIn = isLoggedIn();
    const currentUser = getCurrentUser();
    
    // Get navigation elements
    const loginLink = document.querySelector('a[href="login.html"]').parentNode;
    const registerLink = document.querySelector('a[href="register.html"]').parentNode;
    const navbarNav = document.querySelector('.navbar-nav.ms-auto');
    
    if (loggedIn && currentUser) {
        // Hide login and register links
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        
        // Create user dropdown if it doesn't exist
        if (!document.getElementById('userDropdown')) {
            const userDropdownHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle me-1"></i>${currentUser.firstName}
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
                logoutUser();
                window.location.href = 'index.html';
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

// Event listeners for forms
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation based on login status
    updateNavigation();
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const userData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            // Validate passwords match
            if (userData.password !== userData.confirmPassword) {
                const errorElement = document.getElementById('registerError');
                errorElement.textContent = 'Passwords do not match.';
                errorElement.style.display = 'block';
                return;
            }
            
            // Register user
            const result = registerUser(userData);
            
            if (result.success) {
                // Show success message
                document.getElementById('registerSuccess').style.display = 'block';
                document.getElementById('registerError').style.display = 'none';
                registerForm.reset();
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                // Show error message
                const errorElement = document.getElementById('registerError');
                errorElement.textContent = result.message;
                errorElement.style.display = 'block';
                document.getElementById('registerSuccess').style.display = 'none';
            }
        });
    }
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Authenticate user
            const result = loginUser(email, password);
            
            if (result.success) {
                // If remember me is checked, store in localStorage
                if (rememberMe) {
                    localStorage.setItem('skime_remembered_user', email);
                } else {
                    localStorage.removeItem('skime_remembered_user');
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                // Show error message
                const errorElement = document.getElementById('loginError');
                errorElement.style.display = 'block';
            }
        });
        
        // Auto-fill remembered user
        const rememberedUser = localStorage.getItem('skime_remembered_user');
        if (rememberedUser) {
            document.getElementById('email').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
    }
});