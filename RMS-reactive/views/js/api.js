// api.js - API communication layer
const BASE_URL = '';  // Empty base for relative URLs

// Generic API request function with authentication
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Add JWT token if authenticated request
    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        credentials: 'same-origin'
    };
    
    // Add body for POST, PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Menu API functions
const menuApi = {
    getAllItems: () => apiRequest('/api/menu'),
    getItemById: (id) => apiRequest(`/api/menu/${id}`),
    getItemsByCategory: (category) => apiRequest(`/api/menu/category/${category}`),
    createItem: (data) => apiRequest('/api/menu', 'POST', data, true),
    updateItem: (id, data) => apiRequest(`/api/menu/${id}`, 'PUT', data, true),
    deleteItem: (id) => apiRequest(`/api/menu/${id}`, 'DELETE', null, true)
};

// Reservation API functions
const reservationApi = {
    getAllReservations: () => apiRequest('/api/reservations', 'GET', null, true),
    getReservationById: (id) => apiRequest(`/api/reservations/${id}`, 'GET', null, true),
    getUserReservations: () => apiRequest('/api/reservations/user', 'GET', null, true),
    createReservation: (data) => apiRequest('/api/reservations', 'POST', data, true),
    updateReservation: (id, data) => apiRequest(`/api/reservations/${id}`, 'PUT', data, true),
    deleteReservation: (id) => apiRequest(`/api/reservations/${id}`, 'DELETE', null, true)
};

// Order API functions
const orderApi = {
    getAllOrders: () => apiRequest('/api/orders', 'GET', null, true),
    getOrderById: (id) => apiRequest(`/api/orders/${id}`, 'GET', null, true),
    getUserOrders: () => apiRequest('/api/orders/user', 'GET', null, true),
    createOrder: (data) => apiRequest('/api/orders', 'POST', data, true),
    updateOrder: (id, data) => apiRequest(`/api/orders/${id}`, 'PUT', data, true),
    deleteOrder: (id) => apiRequest(`/api/orders/${id}`, 'DELETE', null, true)
};

// User API functions
const userApi = {
    register: (data) => apiRequest('/api/users/register', 'POST', data),
    login: (data) => apiRequest('/api/users/login', 'POST', data),
    getProfile: () => apiRequest('/api/users/profile', 'GET', null, true),
    updateProfile: (data) => apiRequest('/api/users/profile', 'PUT', data, true)
}; 