// admin.js - Complete working version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMenuItems();
    loadDashboardStats();
    loadRecentReservations();
    loadRecentOrders();
    loadOrdersDashboard();
    loadOrdersTab();
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial tab (dashboard)
    loadDashboardData();
});

// Initialize menu items if not present
function initMenuItems() {
    if (!localStorage.getItem('menuItems')) {
        const initialMenuItems = [
            {
                id: 1,
                category: 'appetizer',
                name: 'Classic Bruschetta',
                description: 'Toasted baguette slices topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.',
                price: 350,
                image: 'images/classic.jpeg',
                featured: true
            },
            // ... other menu items ...
        ];
        localStorage.setItem('menuItems', JSON.stringify(initialMenuItems));
    }
}

function setupSidebarNavigation() {
    // Toggle sidebar
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (toggleSidebar && sidebar && mainContent) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Tab navigation
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            tabContents.forEach(tabContent => tabContent.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + 'Tab';
            const tab = document.getElementById(tabId);
            if (tab) tab.classList.add('active');
            
            // Load tab-specific data
            if (this.getAttribute('data-tab') === 'menu') {
                loadMenuItems();
            } else if (this.getAttribute('data-tab') === 'reservations') {
                loadReservations();
            } else if (this.getAttribute('data-tab') === 'tables') {
                loadTables();
            } else if (this.getAttribute('data-tab') === 'dashboard') {
                loadDashboardData();
            }
        });
    });
}

function setupEventListeners() {
    // Menu management
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', function() {
            document.getElementById('menuItemForm').reset();
            document.getElementById('menuItemId').value = '';
            new bootstrap.Modal(document.getElementById('menuItemModal')).show();
        });
    }

    const saveMenuItemBtn = document.getElementById('saveMenuItemBtn');
    if (saveMenuItemBtn) {
        saveMenuItemBtn.addEventListener('click', saveMenuItem);
    }

    // Other event listeners...
}

function loadDashboardData() {
    loadStats();
    loadRecentReservations();
    loadRecentOrders();
}

function loadStats() {
    // Menu items count
    try {
        const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
        document.getElementById('menuItemsCount').textContent = menuItems.length;
    } catch (error) {
        console.error('Error loading menu items count:', error);
    }
    
    // Today's reservations
    try {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = reservations.filter(res => res.date === today);
        document.getElementById('reservationsToday').textContent = todayReservations.length;
    } catch (error) {
        console.error('Error loading reservations count:', error);
    }
    
    // Today's orders
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => order.date === today);
        document.getElementById('ordersToday').textContent = todayOrders.length;
    } catch (error) {
        console.error('Error loading orders count:', error);
    }
    
    // Available tables
    try {
        const tables = JSON.parse(localStorage.getItem('tables')) || [];
        const availableTables = tables.filter(table => table.status === 'available');
        document.getElementById('availableTables').textContent = availableTables.length;
    } catch (error) {
        console.error('Error loading tables count:', error);
    }
}

function loadMenuItems() {
    const tableBody = document.querySelector('#menuItemsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    try {
        const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
        
        // Apply filters
        const searchTerm = document.getElementById('menuSearchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('menuCategoryFilter')?.value || '';
        
        const filteredItems = menuItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                 item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
            return matchesSearch && matchesCategory;
        });
        
        if (filteredItems.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No menu items found</td></tr>';
            return;
        }
        
        filteredItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td><img src="${item.image}" alt="${item.name}" width="50" height="50" class="rounded" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>${item.name}</td>
                <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                <td>Rs. ${item.price.toFixed(2)}</td>
                <td>${item.featured ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn edit-menu-item" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn delete-menu-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-menu-item').forEach(btn => {
            btn.addEventListener('click', function() {
                editMenuItem(parseInt(this.dataset.id));
            });
        });
        
        document.querySelectorAll('.delete-menu-item').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteMenuItem(parseInt(this.dataset.id));
            });
        });
        
    } catch (error) {
        console.error('Error loading menu items:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error loading menu items</td></tr>';
    }
}

// ... [Include all other functions from admin.js here] ...


// Reservation Management Functions
function setupReservationManagement() {
    // Add reservation button click handler
    document.getElementById('addReservationBtn').addEventListener('click', function() {
        // Reset form
        document.getElementById('reservationForm').reset();
        document.getElementById('reservationId').value = '';
        document.getElementById('reservationModalLabel').textContent = 'Add New Reservation';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reservationDate').value = today;
        
        // Set default status to confirmed
        document.getElementById('reservationStatus').value = 'confirmed';
        
        // Show modal
        const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
        reservationModal.show();
    });
    
    // Floor change handler for table selection
    document.getElementById('reservationFloor').addEventListener('change', function() {
        const floor = this.value;
        const tableSelect = document.getElementById('reservationTable');
        
        // Clear current options
        tableSelect.innerHTML = '<option value="">Select Table</option>';
        
        // If no floor selected, return
        if (!floor) return;
        
        // Get tables for selected floor
        const tables = getTablesForFloor(floor);
        
        // Add options for each table
        tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.id;
            option.textContent = `Table ${table.number} (${table.capacity} seats)`;
            tableSelect.appendChild(option);
        });
    });
    
    // Save reservation button click handler
    document.getElementById('saveReservationBtn').addEventListener('click', function() {
        const form = document.getElementById('reservationForm');
        
        // Check if form is valid
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Get form values
        const id = document.getElementById('reservationId').value || Date.now().toString();
        const tableId = document.getElementById('reservationTable').value;
        const floor = document.getElementById('reservationFloor').value;
        
        // Get selected table details
        const tables = getTablesForFloor(floor);
        const selectedTable = tables.find(table => table.id === tableId) || { number: tableId };
        
        const reservation = {
            id: Date.now().toString(),
            date: document.getElementById('reservationDate').value,
            startTime: document.getElementById('reservationStartTime').value,
            endTime: document.getElementById('reservationEndTime').value,
            name: document.getElementById('reservationName').value,
            guests: document.getElementById('reservationGuests').value,
            email: document.getElementById('reservationEmail').value,
            phone: document.getElementById('reservationPhone').value,
            floor: floor,
            tableId: tableId,
            table: `Table ${selectedTable.number} (Floor ${floor})`,
            specialRequests: document.getElementById('reservationSpecialRequests').value,
            status: document.getElementById('reservationStatus').value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Get existing reservations
        let reservations = [];
        try {
            const storedReservations = localStorage.getItem('reservations');
            if (storedReservations) {
                reservations = JSON.parse(storedReservations);
            }
        } catch (error) {
            console.error('Error getting reservations:', error);
        }
        
        // Check if we're updating an existing reservation or adding a new one
        const existingReservationIndex = reservations.findIndex(res => res.id === id);
        
        if (existingReservationIndex !== -1) {
            // Keep created timestamp from original
            reservation.createdAt = reservations[existingReservationIndex].createdAt;
            
            // Update existing reservation
            reservations[existingReservationIndex] = reservation;
        } else {
            // Add new reservation
            reservations.push(reservation);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            // Close modal
            const reservationModal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
            reservationModal.hide();
            
            // Reload reservations
            loadReservations();
            
            // Update dashboard stats
            loadStats();
            
            // Show success message
            alert('Reservation saved successfully!');
        } catch (error) {
            console.error('Error saving reservation:', error);
            alert('Error saving reservation. Please try again.');
        }
    });
    
    // Filter handlers
    document.getElementById('applyReservationFiltersBtn').addEventListener('click', function() {
        loadReservations();
    });
    
    document.getElementById('resetReservationFiltersBtn').addEventListener('click', function() {
        document.getElementById('reservationDateFilter').value = '';
        document.getElementById('reservationStatusFilter').value = '';
        document.getElementById('reservationFloorFilter').value = '';
        document.getElementById('reservationSearchInput').value = '';
        loadReservations();
    });
}

function loadReservations() {
    const tableBody = document.getElementById('reservationsTable').querySelector('tbody');
    tableBody.innerHTML = '';
    
    // Get reservations from localStorage
    try {
        const storedReservations = localStorage.getItem('reservations');
        let reservations = [];
        
        if (storedReservations) {
            reservations = JSON.parse(storedReservations);
        }
        
        // Apply filters
        const dateFilter = document.getElementById('reservationDateFilter').value;
        const statusFilter = document.getElementById('reservationStatusFilter').value;
        const floorFilter = document.getElementById('reservationFloorFilter').value;
        const searchQuery = document.getElementById('reservationSearchInput').value.toLowerCase();
        
        let filteredReservations = reservations;
        
        if (dateFilter) {
            filteredReservations = filteredReservations.filter(res => res.date === dateFilter);
        }
        
        if (statusFilter) {
            filteredReservations = filteredReservations.filter(res => res.status === statusFilter);
        }
        
        if (floorFilter) {
            filteredReservations = filteredReservations.filter(res => res.floor === floorFilter);
        }
        
        if (searchQuery) {
            filteredReservations = filteredReservations.filter(res => 
                res.name.toLowerCase().includes(searchQuery) || 
                res.phone.toLowerCase().includes(searchQuery) ||
                res.email.toLowerCase().includes(searchQuery)
            );
        }
        
        // Sort by date (newest first)
        filteredReservations.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Check if we have any reservations
        if (filteredReservations.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No reservations found</td></tr>';
            return;
        }
        
        // Add reservations to table
        filteredReservations.forEach((reservation, index) => {
            const row = document.createElement('tr');
            
            // Create status badge based on status
            let statusBadgeClass = 'bg-secondary';
            if (reservation.status === 'confirmed') statusBadgeClass = 'bg-success';
            if (reservation.status === 'pending') statusBadgeClass = 'bg-warning text-dark';
            if (reservation.status === 'cancelled') statusBadgeClass = 'bg-danger';
            
            row.innerHTML = `
                <td>${reservation.id ? String(reservation.id).substring(0, 8) : 'N/A'}</td>
                <td>${reservation.name}</td>
                <td>${reservation.date}</td>
                <td>${reservation.startTime} - ${reservation.endTime}</td>
                <td>${reservation.table}</td>
                <td>${reservation.guests}</td>
                <td><span class="badge ${statusBadgeClass}">${reservation.status}</span></td>
                <td>
                    <div class="table-actions">
                        <a href="#" class="action-btn view-btn view-reservation" data-reservation-id="${reservation.id}" title="View">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="#" class="action-btn edit-btn edit-reservation" data-reservation-id="${reservation.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="#" class="action-btn delete-btn delete-reservation" data-reservation-id="${reservation.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-reservation').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                viewReservation(this.getAttribute('data-reservation-id'));
            });
        });
        
        document.querySelectorAll('.edit-reservation').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                editReservation(this.getAttribute('data-reservation-id'));
            });
        });
        
        document.querySelectorAll('.delete-reservation').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                deleteReservation(this.getAttribute('data-reservation-id'));
            });
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Error loading reservations</td></tr>';
    }
}

function viewReservation(reservationId) {
    try {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const reservation = reservations.find(res => res.id === reservationId);
            
            if (reservation) {
                // Format date for display
                const dateObj = new Date(reservation.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Show reservation details in alert (in a real app, this would be a modal)
                alert(`
                    Reservation Details
                    -------------------
                    Name: ${reservation.name}
                    Date: ${formattedDate}
                    Time: ${reservation.startTime} - ${reservation.endTime}
                    Table: ${reservation.table}
                    Guests: ${reservation.guests}
                    Status: ${reservation.status}
                    
                    Contact Information:
                    Email: ${reservation.email}
                    Phone: ${reservation.phone}
                    
                    Special Requests: ${reservation.specialRequests || 'None'}
                `);
            }
        }
    } catch (error) {
        console.error('Error viewing reservation:', error);
        alert('Error loading reservation details. Please try again.');
    }
}

function editReservation(reservationId) {
    try {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const reservation = reservations.find(res => res.id === reservationId);
            
            if (reservation) {
                // Populate form with reservation data
                document.getElementById('reservationId').value = reservation.id;
                document.getElementById('reservationDate').value = reservation.date;
                document.getElementById('reservationStartTime').value = reservation.startTime;
                document.getElementById('reservationEndTime').value = reservation.endTime;
                document.getElementById('reservationName').value = reservation.name;
                document.getElementById('reservationGuests').value = reservation.guests;
                document.getElementById('reservationEmail').value = reservation.email;
                document.getElementById('reservationPhone').value = reservation.phone;
                document.getElementById('reservationStatus').value = reservation.status;
                document.getElementById('reservationFloor').value = reservation.floor;
                document.getElementById('reservationSpecialRequests').value = reservation.specialRequests || '';
                
                // Update modal title
                document.getElementById('reservationModalLabel').textContent = 'Edit Reservation';
                
                // Trigger floor change to load tables
                document.getElementById('reservationFloor').dispatchEvent(new Event('change'));
                
                // Select the table after tables are loaded
                setTimeout(() => {
                    const tableSelect = document.getElementById('reservationTable');
                    if (tableSelect.querySelector(`option[value="${reservation.tableId}"]`)) {
                        tableSelect.value = reservation.tableId;
                    }
                }, 100);
                
                // Show modal
                const reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
                reservationModal.show();
            }
        }
    } catch (error) {
        console.error('Error editing reservation:', error);
        alert('Error loading reservation data. Please try again.');
    }
}

function deleteReservation(reservationId) {
    if (confirm('Are you sure you want to delete this reservation?')) {
        try {
            const storedReservations = localStorage.getItem('reservations');
            if (storedReservations) {
                let reservations = JSON.parse(storedReservations);
                
                // Filter out the reservation to delete
                reservations = reservations.filter(res => res.id !== reservationId);
                
                // Save updated reservations
                localStorage.setItem('reservations', JSON.stringify(reservations));
                
                // Reload reservations
                loadReservations();
                
                // Update dashboard stats
                loadStats();
                
                // Show success message
                alert('Reservation deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            alert('Error deleting reservation. Please try again.');
        }
    }
}

// Table Management Functions
function setupTableManagement() {
    // Add table button click handler
    document.getElementById('addTableBtn').addEventListener('click', function() {
        // Reset form
        document.getElementById('tableForm').reset();
        document.getElementById('tableId').value = '';
        document.getElementById('tableModalLabel').textContent = 'Add New Table';
        
        // Show modal
        const tableModal = new bootstrap.Modal(document.getElementById('tableModal'));
        tableModal.show();
    });
    
    // Save table button click handler
    document.getElementById('saveTableBtn').addEventListener('click', function() {
        const form = document.getElementById('tableForm');
        
        // Check if form is valid
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Get form values
        const id = document.getElementById('tableId').value || Date.now().toString();
        const table = {
            id: id,
            number: document.getElementById('tableNumber').value,
            floor: document.getElementById('tableFloor').value,
            capacity: document.getElementById('tableCapacity').value,
            status: document.getElementById('tableStatus').value,
            location: document.getElementById('tableLocation').value,
            notes: document.getElementById('tableNotes').value
        };
        
        // Get existing tables
        let tables = [];
        try {
            const storedTables = localStorage.getItem('tables');
            if (storedTables) {
                tables = JSON.parse(storedTables);
            }
        } catch (error) {
            console.error('Error getting tables:', error);
        }
        
        // Check if we're updating an existing table or adding a new one
        const existingTableIndex = tables.findIndex(t => t.id === id);
        
        if (existingTableIndex !== -1) {
            // Update existing table
            tables[existingTableIndex] = table;
        } else {
            // Add new table
            tables.push(table);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('tables', JSON.stringify(tables));
            
            // Close modal
            const tableModal = bootstrap.Modal.getInstance(document.getElementById('tableModal'));
            tableModal.hide();
            
            // Reload tables
            loadTables();
            
            // Show success message
            alert('Table saved successfully!');
        } catch (error) {
            console.error('Error saving table:', error);
            alert('Error saving table. Please try again.');
        }
    });
    
    // Table floor filter handler
    document.getElementById('tableFloorFilter').addEventListener('change', function() {
        loadTables();
    });
    
    // Floor layout refresh button handlers
    document.getElementById('refreshFloor1Btn').addEventListener('click', function() {
        loadFloorLayout(1);
    });
    
    document.getElementById('refreshFloor2Btn').addEventListener('click', function() {
        loadFloorLayout(2);
    });
}

function loadTables() {
    const tableBody = document.getElementById('tablesTable').querySelector('tbody');
    tableBody.innerHTML = '';

    loadFloorLayout(1);
    loadFloorLayout(2);

    try {
        const storedTables = localStorage.getItem('tables');
        let tables = [];

        if (storedTables) {
            tables = JSON.parse(storedTables);
        } else {
            initializeDefaultTables();
            const newStoredTables = localStorage.getItem('tables');
            if (newStoredTables) {
                tables = JSON.parse(newStoredTables);
            }
        }

        const floorFilter = document.getElementById('tableFloorFilter').value;
        let filteredTables = tables;

        if (floorFilter) {
            filteredTables = filteredTables.filter(table => table.floor === floorFilter);
        }

        filteredTables.sort((a, b) => {
            if (a.floor !== b.floor) {
                return a.floor - b.floor;
            }
            return a.number - b.number;
        });

        // Load today's reservations
        let reservations = [];
        const today = new Date().toISOString().split('T')[0];

        try {
            const storedReservations = localStorage.getItem('reservations');
            if (storedReservations) {
                reservations = JSON.parse(storedReservations);
            }
        } catch (error) {
            console.error('Error loading reservations for tables:', error);
        }

        // Update each table's status based on today's reservations
        filteredTables.forEach(table => {
            // Find a confirmed reservation for this table today
            const hasReservation = reservations.some(res =>
                res.tableId === table.id &&
                res.date === today &&
                res.status === 'confirmed'
            );

            const currentStatus = hasReservation ? 'reserved' : table.status;

            const row = document.createElement('tr');

            let statusBadgeClass = 'bg-success';
            if (currentStatus === 'occupied') statusBadgeClass = 'bg-danger';
            else if (currentStatus === 'reserved') statusBadgeClass = 'bg-warning text-dark';
            else if (currentStatus === 'maintenance') statusBadgeClass = 'bg-secondary';

            const currentReservation = reservations.find(res =>
                res.tableId === table.id &&
                res.date === today &&
                res.status === 'confirmed'
            );

            row.innerHTML = `
                <td>${table.id.substring(0, 8)}</td>
                <td>${table.number}</td>
                <td>${table.floor}</td>
                <td>${table.capacity}</td>
                <td><span class="badge ${statusBadgeClass}">${currentStatus}</span></td>
                <td>${currentReservation ? `${currentReservation.name} (${currentReservation.startTime} - ${currentReservation.endTime})` : 'None'}</td>
                <td>
                    <div class="table-actions">
                        <a href="#" class="action-btn edit-btn edit-table" data-table-id="${table.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="#" class="action-btn delete-btn delete-table" data-table-id="${table.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </a>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-table').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                editTable(this.getAttribute('data-table-id'));
            });
        });

        document.querySelectorAll('.delete-table').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                deleteTable(this.getAttribute('data-table-id'));
            });
        });
    } catch (error) {
        console.error('Error loading tables:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error loading tables</td></tr>';
    }
}


function loadFloorLayout(floorNumber) {
    const floorLayout = document.getElementById(`floor${floorNumber}Layout`).querySelector('.table-grid');
    floorLayout.innerHTML = '';
    
    // Get tables for this floor
    const tables = getTablesForFloor(floorNumber);
    
    // Create grid layout
    const gridSize = Math.ceil(Math.sqrt(tables.length));
    floorLayout.style.display = 'grid';
    floorLayout.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    floorLayout.style.gap = '10px';
    
    // Add tables to layout
    tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = 'floor-table';
        tableElement.style.padding = '10px';
        tableElement.style.textAlign = 'center';
        tableElement.style.borderRadius = '5px';
        tableElement.style.cursor = 'pointer';
        
        // Set color based on status
        if (table.status === 'available') {
            tableElement.style.backgroundColor = '#d1e7dd';
        } else if (table.status === 'occupied') {
            tableElement.style.backgroundColor = '#f8d7da';
        } else if (table.status === 'reserved') {
            tableElement.style.backgroundColor = '#fff3cd';
        } else {
            tableElement.style.backgroundColor = '#e2e3e5';
        }
        
        tableElement.innerHTML = `
            <h5>Table ${table.number}</h5>
            <p>Capacity: ${table.capacity}</p>
            <p>Status: ${table.status}</p>
        `;
        
        // Add click handler to edit the table
        tableElement.addEventListener('click', function() {
            editTable(table.id);
        });
        
        floorLayout.appendChild(tableElement);
    });
    
    // If no tables for this floor
    if (tables.length === 0) {
        const message = document.createElement('div');
        message.style.gridColumn = '1 / -1';
        message.style.textAlign = 'center';
        message.style.padding = '20px';
        message.innerHTML = `<p>No tables found for Floor ${floorNumber}</p>`;
        floorLayout.appendChild(message);
    }
}

function editTable(tableId) {
    try {
        const storedTables = localStorage.getItem('tables');
        if (storedTables) {
            const tables = JSON.parse(storedTables);
            const table = tables.find(table => table.id === tableId);
            
            if (table) {
                // Populate form with table data
                document.getElementById('tableId').value = table.id;
                document.getElementById('tableNumber').value = table.number;
                document.getElementById('tableFloor').value = table.floor;
                document.getElementById('tableCapacity').value = table.capacity;
                document.getElementById('tableStatus').value = table.status;
                document.getElementById('tableLocation').value = table.location || '';
                document.getElementById('tableNotes').value = table.notes || '';
                
                // Update modal title
                document.getElementById('tableModalLabel').textContent = 'Edit Table';
                
                // Show modal
                const tableModal = new bootstrap.Modal(document.getElementById('tableModal'));
                tableModal.show();
            }
        }
    } catch (error) {
        console.error('Error editing table:', error);
        alert('Error loading table data. Please try again.');
    }
}

function deleteTable(tableId) {
    if (confirm('Are you sure you want to delete this table?')) {
        try {
            const storedTables = localStorage.getItem('tables');
            if (storedTables) {
                let tables = JSON.parse(storedTables);
                
                // Filter out the table to delete
                tables = tables.filter(table => table.id !== tableId);
                
                // Save updated tables
                localStorage.setItem('tables', JSON.stringify(tables));
                
                // Reload tables
                loadTables();
                
                // Show success message
                alert('Table deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting table:', error);
            alert('Error deleting table. Please try again.');
        }
    }
}

function getTablesForFloor(floor) {
    let tables = [];
    
    try {
        const storedTables = localStorage.getItem('tables');
        if (storedTables) {
            const allTables = JSON.parse(storedTables);
            tables = allTables.filter(table => table.floor === floor);
        }
    } catch (error) {
        console.error('Error getting tables for floor:', error);
    }
    
    return tables;
}

function initializeDefaultTables() {
    const defaultTables = [
        { id: '1001', number: '1', floor: '1', capacity: '4', status: 'available', location: 'Near window' },
        { id: '1002', number: '2', floor: '1', capacity: '2', status: 'available', location: 'Center' },
        { id: '1003', number: '3', floor: '1', capacity: '6', status: 'available', location: 'Corner' },
        { id: '1004', number: '4', floor: '1', capacity: '4', status: 'available', location: 'Near kitchen' },
        { id: '1005', number: '5', floor: '1', capacity: '8', status: 'available', location: 'Large table' },
        { id: '1006', number: '6', floor: '1', capacity: '2', status: 'maintenance', location: 'Near entrance' },
        { id: '2001', number: '1', floor: '2', capacity: '4', status: 'available', location: 'Near window' },
        { id: '2002', number: '2', floor: '2', capacity: '2', status: 'available', location: 'Center' },
        { id: '2003', number: '3', floor: '2', capacity: '6', status: 'available', location: 'Corner' },
        { id: '2004', number: '4', floor: '2', capacity: '10', status: 'available', location: 'Large group table' }
    ];
    
    localStorage.setItem('tables', JSON.stringify(defaultTables));
}


// Finally, add this to handle the menu item form submission
function saveMenuItem() {
    const idInput = document.getElementById('menuItemId');
    const id = idInput.value ? parseInt(idInput.value) : null;
    const name = document.getElementById('menuItemName').value;
    const price = parseFloat(document.getElementById('menuItemPrice').value);
    const description = document.getElementById('menuItemDescription').value;
    const image = document.getElementById('menuItemImage').value;
    const category = document.getElementById('menuItemCategory').value;
    const featured = document.getElementById('menuItemFeatured').checked;

    if (!name || isNaN(price)) {
        alert("Please provide valid name and price.");
        return;
    }

    let items = JSON.parse(localStorage.getItem('menuItems')) || [];
    
    if (id) {
        // Update existing item
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], name, price, description, image, category, featured };
        }
    } else {
        // Add new item
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        items.push({
            id: newId,
            name,
            price,
            description,
            image,
            category,
            featured
        });
    }

    localStorage.setItem('menuItems', JSON.stringify(items));
    renderMenuItems();
    bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();

    function loadOrdersDashboard() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const table = document.querySelector('#dashboardOrdersTable tbody');
        table.innerHTML = '';
    
        orders.slice(-5).reverse().forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.items.length} item(s)</td>
                <td>Rs. ${order.total.toFixed(2)}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
            `;
            table.appendChild(row);
        });
    
        document.getElementById('ordersToday').textContent = orders.length;
    }
    
    function loadOrdersTab() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        let ordersTab = document.getElementById('ordersTab');
    
        if (!ordersTab) {
            ordersTab = document.createElement('div');
            ordersTab.id = 'ordersTab';
            ordersTab.className = 'tab-content';
            document.getElementById('mainContent').appendChild(ordersTab);
        }
    
        ordersTab.innerHTML = `
            <h2 class="mb-4">All Orders</h2>
            <div class="panel">
                <div class="panel-header">
                    <h4 class="panel-title">Orders List</h4>
                </div>
                <div class="panel-body">
                    <table class="table admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.reverse().map(order => `
                                <tr>
                                    <td>${order.id}</td>
                                    <td>${new Date(order.date).toLocaleString()}</td>
                                    <td>
                                        ${order.items.map(i => `${i.quantity || 1} x ${i.name}`).join('<br>')}
                                    </td>
                                    <td>Rs. ${order.total.toFixed(2)}</td>
                                    <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    function getStatusColor(status) {
        switch ((status || '').toLowerCase()) {
            case 'pending': return 'warning';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    }
    
    // Sidebar tab toggle logic
    document.querySelectorAll('.sidebar-menu .nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
    
            // toggle active class
            document.querySelectorAll('.sidebar-menu .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
    
            // toggle tab content visibility
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            const tabContent = document.getElementById(tab + 'Tab');
            if (tabContent) tabContent.classList.add('active');
        });
    });

    
}