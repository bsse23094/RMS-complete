// Storage Management System for RMS
class StorageManager {
    static VERSION = '1.0';
    static PREFIX = 'rms_';
    static MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

    static keys = {
        CART: 'cart',
        RESERVATIONS: 'reservations',
        ORDERS: 'orders',
        MENU_ITEMS: 'menuItems',
        USERS: 'users',
        ORDER_TYPE: 'orderType',
        VERSION: 'version'
    };

    static initialize() {
        // Check version and perform migrations if needed
        const storedVersion = localStorage.getItem(this.PREFIX + 'version');
        if (storedVersion !== this.VERSION) {
            this.migrateData(storedVersion);
        }

        // Initialize storage with default values if empty
        Object.values(this.keys).forEach(key => {
            const prefixedKey = this.PREFIX + key;
            if (!localStorage.getItem(prefixedKey)) {
                switch (key) {
                    case this.keys.CART:
                    case this.keys.ORDERS:
                    case this.keys.MENU_ITEMS:
                    case this.keys.USERS:
                        localStorage.setItem(prefixedKey, JSON.stringify([]));
                        break;
                    case this.keys.ORDER_TYPE:
                        localStorage.setItem(prefixedKey, 'delivery');
                        break;
                }
            }
        });
    }

    static get(key) {
        try {
            const value = localStorage.getItem(this.PREFIX + key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error retrieving ${key} from storage:`, error);
            return null;
        }
    }

    static set(key, value) {
        try {
            // Check storage limit
            const serializedValue = JSON.stringify(value);
            if (this.getStorageSize() + serializedValue.length > this.MAX_STORAGE_SIZE) {
                throw new Error('Storage quota exceeded');
            }

            localStorage.setItem(this.PREFIX + key, serializedValue);
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to storage:`, error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
            return false;
        }
    }

    static clear() {
        try {
            Object.values(this.keys).forEach(key => {
                localStorage.removeItem(this.PREFIX + key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    static getStorageSize() {
        let size = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.PREFIX)) {
                size += localStorage.getItem(key).length;
            }
        }
        return size;
    }

    static migrateData(oldVersion) {
        // Handle data migrations between versions
        // For now, just update the version
        localStorage.setItem(this.PREFIX + 'version', this.VERSION);
    }

    static validateData(key, data) {
        // Add validation rules for different data types
        switch (key) {
            case this.keys.CART:
                return Array.isArray(data) && data.every(item => 
                    item.name && typeof item.price === 'number' && item.quantity > 0);
            case this.keys.ORDERS:
                return Array.isArray(data) && data.every(order => 
                    order.id && order.date && Array.isArray(order.items));
            case this.keys.RESERVATIONS:
                return Array.isArray(data) && data.every(reservation => 
                    reservation.name && reservation.date && reservation.status);
            default:
                return true;
        }
    }

    static cleanup() {
        // Remove expired or stale data
        const now = new Date();
        
        // Clean up completed/cancelled orders older than 30 days
        const orders = this.get(this.keys.ORDERS) || [];
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 30 || order.status === 'pending' || order.status === 'confirmed';
        });
        this.set(this.keys.ORDERS, filteredOrders);

        // Clean up old reservations
        const reservations = this.get(this.keys.RESERVATIONS) || [];
        const filteredReservations = reservations.filter(reservation => {
            const reservationDate = new Date(reservation.date);
            return reservationDate >= now || reservation.status === 'pending';
        });
        this.set(this.keys.RESERVATIONS, filteredReservations);
    }
} 

function initializeSampleMenuData() {
    const sampleMenuItems = [
        {
            id: 1,
            name: "Signature Dish",
            description: "Our chef's special creation",
            price: 12.99,
            image: "images/dish1.jpg",
            featured: true,
            category: "main"
        },
        {
            id: 2,
            name: "Gourmet Pizza",
            description: "Artisan pizza with premium toppings",
            price: 14.99,
            image: "images/dish2.jpg",
            featured: true,
            category: "main"
        }
        // Add more items as needed
    ];

    // Only set if no menu items exist
    if (!StorageManager.get(StorageManager.keys.MENU_ITEMS) || 
        StorageManager.get(StorageManager.keys.MENU_ITEMS).length === 0) {
        StorageManager.set(StorageManager.keys.MENU_ITEMS, sampleMenuItems);
    }
}