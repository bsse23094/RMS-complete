import { StorageManager } from './storage.js';

// Initialize storage managers
const menuStorageManager = new StorageManager('menu_items', {
    version: 1,
    validator: (data) => Array.isArray(data)
});

const cartStorageManager = new StorageManager('cart', {
    version: 1,
    validator: (data) => Array.isArray(data)
});

// Cart state
let cartItems = [];

// Load cart items on page load
async function loadCart() {
    try {
        cartItems = await cartStorageManager.get() || [];
        updateCartUI();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart UI when storage changes
window.addEventListener('storage', function(e) {
    if (e.key === StorageManager.PREFIX + StorageManager.keys.CART) {
        updateCartUI();
    }
});

// Update cart UI
function updateCartUI() {
    const cart = StorageManager.get(StorageManager.keys.CART) || [];
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartItemsList = document.getElementById('cartItems');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    if (cartTotal) cartTotal.textContent = `Rs. ${total.toFixed(2)}`;

    // Update cart items list
    if (cartItemsList) {
        cartItemsList.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Rs. ${item.price.toFixed(2)} × ${item.quantity || 1}</small>
                </div>
                <div>
                    <span class="text-muted">Rs. ${((item.price * (item.quantity || 1))).toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
    }
}

// Add item to cart
async function addToCart(itemId, name, price, image = '') {
    try {
        const existingItemIndex = cartItems.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
        } else {
            cartItems.push({
                id: itemId,
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }

        await cartStorageManager.set(cartItems);
        updateCartUI();
        
        // Show success toast
        const toast = new bootstrap.Toast(document.getElementById('addToCartToast'));
        toast.show();
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Error adding item to cart');
    }
}

// Remove item from cart
function removeFromCart(index) {
    const cart = StorageManager.get(StorageManager.keys.CART) || [];
    cart.splice(index, 1);
    StorageManager.set(StorageManager.keys.CART, cart);
    updateCartUI();
}

// Clear cart
function clearCart() {
    StorageManager.set(StorageManager.keys.CART, []);
    updateCartUI();
}

// Initialize menu items if they don't exist
function initializeMenuItems() {
    const menuItems = StorageManager.get(StorageManager.keys.MENU_ITEMS);
    if (!menuItems || menuItems.length === 0) {
        const sampleItems = [
            {
                id: 'bruschetta',
                name: 'Classic Bruschetta',
                description: 'Toasted baguette slices topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.',
                price: 350,
                image: 'images/classic.jpeg',
                category: 'starters'
            },
            {
                id: 'calamari',
                name: 'Crispy Calamari',
                description: 'Tender calamari rings lightly coated in seasoned flour and fried to perfection. Served with garlic aioli.',
                price: 550,
                image: 'images/calamari.jpeg',
                category: 'starters'
            },
            {
                id: 'mushrooms',
                name: 'Stuffed Mushrooms',
                description: 'Button mushrooms filled with cream cheese, herbs, and topped with breadcrumbs, baked until golden.',
                price: 450,
                image: 'images/mushrooms.jpeg',
                category: 'starters'
            },
            {
                id: 'salmon',
                name: 'Grilled Salmon',
                description: 'Fresh Atlantic salmon fillet grilled to perfection, served with lemon butter sauce and roasted vegetables.',
                price: 1200,
                image: 'images/salmon.jpeg',
                category: 'mains'
            },
            {
                id: 'ribeye',
                name: 'Ribeye Steak',
                description: 'Prime cut ribeye steak grilled to your preference, accompanied by mashed potatoes and grilled asparagus.',
                price: 1500,
                image: 'images/ribeye.jpg',
                category: 'mains'
            },
            {
                id: 'pasta',
                name: 'Pasta Primavera',
                description: 'Fettuccine pasta tossed with seasonal vegetables in a light cream sauce with Parmesan cheese.',
                price: 850,
                image: 'images/pasta.jpg',
                category: 'mains'
            },
            {
                id: 'cake',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.',
                price: 450,
                image: 'images/cake.jpg',
                category: 'desserts'
            },
            {
                id: 'tiramisu',
                name: 'Classic Tiramisu',
                description: 'Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.',
                price: 400,
                image: 'images/tiramisu.jpeg',
                category: 'desserts'
            },
            {
                id: 'mango',
                name: 'Mango Cheesecake',
                description: 'Creamy cheesecake with a graham cracker crust, topped with fresh mango puree and slices.',
                price: 500,
                image: 'images/mango.jpeg',
                category: 'desserts'
            },
            {
                id: 'juice',
                name: 'Fresh Fruit Juice',
                description: 'Freshly squeezed juice from seasonal fruits. Ask your server for today\'s selections.',
                price: 250,
                image: 'images/juice.jpeg',
                category: 'drinks'
            },
            {
                id: 'coffee',
                name: 'Coffee Selection',
                description: 'Choose from our premium selection of coffee - Espresso, Cappuccino, Latte, or Macchiato.',
                price: 300,
                image: 'images/coffee.jpeg',
                category: 'drinks'
            }
        ];
        StorageManager.set(StorageManager.keys.MENU_ITEMS, sampleItems);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeMenuItems();
    updateCartUI();
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart; 