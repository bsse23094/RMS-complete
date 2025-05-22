// Index Page JavaScript

// Handle login button click
document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Implement login functionality or redirect to login page
    window.location.href = 'login.html';
});

// Handle register button click
document.getElementById('registerBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Implement register functionality or redirect to register page
    window.location.href = 'register.html';
});

// Handle special offers button click
document.getElementById('specialOffersBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Implement special offers functionality
    alert('Special offers feature coming soon!');
});

// Update cart count when storage changes
window.addEventListener('storage', function(e) {
    if (e.key === StorageManager.PREFIX + StorageManager.keys.CART) {
        const cart = StorageManager.get(StorageManager.keys.CART) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }
});

// Initialize featured items if they don't exist
function initializeFeaturedItems() {
    const menuItems = StorageManager.get(StorageManager.keys.MENU_ITEMS);
    if (!menuItems || menuItems.length === 0) {
        const sampleItems = [
            {
                id: '1',
                name: 'Grilled Salmon',
                description: 'Fresh Atlantic salmon with seasonal vegetables',
                price: 1200,
                image: 'images/salmon.jpeg',
                featured: true
            },
            {
                id: '2',
                name: 'Pasta Primavera',
                description: 'Fettuccine pasta with seasonal vegetables',
                price: 850,
                image: 'images/pasta.jpg',
                featured: true
            },
            {
                id: '3',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with vanilla ice cream',
                price: 450,
                image: 'images/cake.jpg',
                featured: true
            }
        ];
        StorageManager.set(StorageManager.keys.MENU_ITEMS, sampleItems);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFeaturedItems();
    
    // Load featured menu items
    loadFeaturedItems();
    
    // Handle any hero section animations or interactions
    initHeroAnimations();
});

// Function to load featured menu items
function loadFeaturedItems() {
    const container = document.getElementById('featuredItems');
    if (!container) return;
    
    // First show loading spinner
    container.innerHTML = `
        <div class="text-center col-12">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Try to fetch from API
    fetch('/api/menu')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                // Filter featured items and display up to 4
                const featuredItems = data.data.filter(item => item.featured).slice(0, 4);
                if (featuredItems.length > 0) {
                    displayFeaturedItems(featuredItems);
                } else {
                    displaySampleFeaturedItems();
                }
            } else {
                displaySampleFeaturedItems();
            }
        })
        .catch(error => {
            console.error('Error fetching featured items:', error);
            displaySampleFeaturedItems();
        });
}

// Display featured menu items from API data
function displayFeaturedItems(items) {
    const container = document.getElementById('featuredItems');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm overflow-hidden">
                <div class="position-relative" style="height: 200px; overflow: hidden;">
                    <img src="${item.image || 'images/default-food.jpg'}" class="card-img-top h-100 w-100 object-fit-cover" 
                        alt="${item.name}" 
                        onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}'">
                    <span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small">Featured</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <p class="card-text mb-0 fw-bold text-dark">Rs. ${item.price}</p>
                        <button class="btn btn-dark btn-sm add-to-cart-btn" 
                                data-item-id="${item._id}"
                                data-item-name="${item.name}"
                                data-item-price="${item.price}"
                                data-item-img="${item.image || 'images/default-food.jpg'}">
                            <i class="fas fa-cart-plus me-1"></i>Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            // Use the cart methods from cart.js
            const button = event.currentTarget;
            const itemId = button.getAttribute('data-item-id');
            const itemName = button.getAttribute('data-item-name');
            const itemPrice = parseFloat(button.getAttribute('data-item-price'));
            const itemImg = button.getAttribute('data-item-img');
            
            // Add item to cart
            if (typeof cart !== 'undefined' && cart.addItem) {
                cart.addItem({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    image: itemImg
                });
                
                // Show notification
                if (typeof showNotification === 'function') {
                    showNotification(`Added ${itemName} to cart`);
                }
            }
        });
    });
}

// Display sample items when API call fails
function displaySampleFeaturedItems() {
    const container = document.getElementById('featuredItems');
    if (!container) return;
    
    const sampleItems = [
        {
            name: "Classic Bruschetta",
            description: "Toasted baguette slices topped with fresh tomatoes, basil, garlic, and olive oil.",
            price: 350,
            image: "https://via.placeholder.com/400x300?text=Bruschetta"
        },
        {
            name: "Grilled Salmon",
            description: "Fresh Atlantic salmon fillet grilled to perfection with lemon butter sauce.",
            price: 1200,
            image: "https://via.placeholder.com/400x300?text=Salmon"
        },
        {
            name: "Pasta Primavera",
            description: "Fettuccine with seasonal vegetables in light cream sauce.",
            price: 850,
            image: "https://via.placeholder.com/400x300?text=Pasta"
        },
        {
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with molten center and vanilla ice cream.",
            price: 450,
            image: "https://via.placeholder.com/400x300?text=Cake"
        }
    ];
    
    container.innerHTML = sampleItems.map(item => `
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm overflow-hidden">
                <div class="position-relative" style="height: 200px; overflow: hidden;">
                    <img src="${item.image}" class="card-img-top h-100 w-100 object-fit-cover" alt="${item.name}">
                    <span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 small">Featured</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <p class="card-text mb-0 fw-bold text-dark">Rs. ${item.price}</p>
                        <button class="btn btn-dark btn-sm add-to-cart-btn" 
                                data-item-id="${item.name.toLowerCase().replace(/\s+/g, '-')}"
                                data-item-name="${item.name}"
                                data-item-price="${item.price}"
                                data-item-img="${item.image}">
                            <i class="fas fa-cart-plus me-1"></i>Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            // Use the cart methods from cart.js
            const button = event.currentTarget;
            const itemId = button.getAttribute('data-item-id');
            const itemName = button.getAttribute('data-item-name');
            const itemPrice = parseFloat(button.getAttribute('data-item-price'));
            const itemImg = button.getAttribute('data-item-img');
            
            // Add item to cart
            if (typeof cart !== 'undefined' && cart.addItem) {
                cart.addItem({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    image: itemImg
                });
                
                // Show notification
                if (typeof showNotification === 'function') {
                    showNotification(`Added ${itemName} to cart`);
                }
            }
        });
    });
}

// Initialize hero section animations
function initHeroAnimations() {
    // Add any hero section animations or interactions here
    const heroSection = document.querySelector('.hero-container');
    if (heroSection) {
        // Example: Add a class after page load to trigger animations
        setTimeout(() => {
            heroSection.classList.add('animate');
        }, 300);
    }
} 