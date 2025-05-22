import { StorageManager } from './storage.js';

// Initialize storage manager
const storageManager = new StorageManager('reservations', {
    version: 1,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    validator: (data) => {
        return data && typeof data === 'object' &&
            typeof data.date === 'string' &&
            typeof data.startTime === 'string' &&
            typeof data.endTime === 'string' &&
            typeof data.guests === 'number' &&
            typeof data.name === 'string' &&
            typeof data.email === 'string' &&
            typeof data.phone === 'string' &&
            typeof data.specialRequests === 'string';
    }
});

// Guest selector functionality
const guestIndicators = document.querySelectorAll('.guest-indicator');
const guestsInput = document.getElementById('guests');

guestIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const value = parseInt(indicator.getAttribute('data-value'));
        guestsInput.value = value;
        
        // Update active state
        guestIndicators.forEach(ind => ind.classList.remove('active'));
        indicator.classList.add('active');
    });
});

// Form submission handler
const reservationForm = document.getElementById('reservationForm');

reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(reservationForm);
    const reservationData = {
        id: Date.now().toString(),
        date: formData.get('date'),
        startTime: formData.get('start_time'),
        endTime: formData.get('end_time'),
        guests: parseInt(formData.get('guests')),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialRequests: formData.get('special_requests') || '',
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    try {
        // Get existing reservations
        const existingReservations = await storageManager.get() || [];
        
        // Check for time conflicts
        const hasConflict = existingReservations.some(reservation => {
            return reservation.date === reservationData.date &&
                ((reservationData.startTime >= reservation.startTime && reservationData.startTime < reservation.endTime) ||
                (reservationData.endTime > reservation.startTime && reservationData.endTime <= reservation.endTime));
        });

        if (hasConflict) {
            alert('Sorry, this time slot is already booked. Please choose a different time.');
            return;
        }

        // Add new reservation
        existingReservations.push(reservationData);
        await storageManager.set(existingReservations);

        // Show success message
        alert('Reservation submitted successfully!');
        reservationForm.reset();
        
        // Redirect to list page
        window.location.href = 'list.html';
    } catch (error) {
        console.error('Error saving reservation:', error);
        alert('There was an error saving your reservation. Please try again.');
    }
}); 