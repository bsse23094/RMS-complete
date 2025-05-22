// cart.js - Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.load();
        this.updateCartCount();
    }
    
    // Load cart from local storage
    load() {
        try {
            const stored = localStorage.getItem('cart');
            if (stored) {
                this.items = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading cart', e);
            this.items = [];
            localStorage.setItem('cart', JSON.stringify(this.items));
        }
    }
    
    // Save cart to local storage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }
    
    // Add item to cart
    addItem(item) {
        if (!item || !item.id) return false;
        
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        this.save();
        return true;
    }
    
    // Remove item from cart
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.save();
    }
    
    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeItem(itemId);
            }
            this.save();
        }
    }
    
    // Clear the cart
    clear() {
        this.items = [];
        this.save();
    }
    
    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
    }
    
    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + (item.quantity || 1), 0);
    }
    
    // Update cart counter in UI
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Function to add item to cart from button click
function addToCartHandler(event) {
    const button = event.currentTarget;
    const itemId = button.getAttribute('data-item-id');
    const itemName = button.getAttribute('data-item-name');
    const itemPrice = parseFloat(button.getAttribute('data-item-price'));
    const itemImg = button.getAttribute('data-item-img');
    
    cart.addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImg
    });
    
    // Show notification
    showNotification(`Added ${itemName} to cart`);
}

// Setup event listeners for all add-to-cart buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', addToCartHandler);
    });
}); 