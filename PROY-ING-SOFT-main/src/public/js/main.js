// main.js

// Default data
const defaultEvents = [
    {
        "id": "event1",
        "title": "Concierto de Rock",
        "date": "2024-05-20",
        "location": "Madrid",
        "category": "Music",
        "image": "https://shorturl.at/OQ5dJ"
    },
    {
        "id": "event2",
        "title": "Exposición de Arte Moderno",
        "date": "2024-06-15",
        "location": "Barcelona",
        "category": "Art",
        "image": "https://shorturl.at/hcfBO"
    },
    {
        "id": "event3",
        "title": "Festival Gastronómico",
        "date": "2024-07-10",
        "location": "Sevilla",
        "category": "Food",
        "image": "https://shorturl.at/m5dwN"
    },
    {
        "id": "event4",
        "title": "Espectáculo de Magia",
        "date": "2024-08-05",
        "location": "Valencia",
        "category": "Entertainment",
        "image": "https://shorturl.at/PsY7D"
    },
    {
        "id": "event5",
        "title": "Feria de Libros",
        "date": "2024-09-12",
        "location": "Bilbao",
        "category": "Other",
        "image": "https://shorturl.at/dHUx8"
    }
];

// Global state
let events = JSON.parse(localStorage.getItem('events')) || defaultEvents;
let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let isAdmin = false;

// Event Display Functions
function displayEvents(eventsToDisplay) {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '';
    eventsToDisplay.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <h3>${event.title}</h3>
            <p>Fecha: ${event.date}</p>
            <p>Ubicación: ${event.location}</p>
            <p>Categoría: ${event.category}</p>
            <button onclick="openModal('reservationModal', '${event.id}')">Reservar Ticket</button>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

function validateEventForm() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value;

    if (!title || !date || !location) {
        alert('Por favor complete todos los campos requeridos');
        return false;
    }

    if (new Date(date) <= new Date()) {
        alert('La fecha del evento debe ser futura');
        return false;
    }

    return true;
}

function createEvent(event) {
    event.preventDefault(); // Prevent the default form submission
    if (!validateEventForm()) return;

    const formData = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        category: document.getElementById('eventCategory').value,
        image: document.getElementById('eventImage').value || 'https://shorturl.at/dHUx8'
    };

    events.push(formData);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents(events);
    closeModal('createEventModal');
    document.getElementById('createEventForm').reset();
    alert('Evento creado exitosamente!');
}

function reserveTicket(event) {
    event.preventDefault();
    
    const currentUser = userManager.getCurrentUser();
    if (!currentUser) {
        alert('Debe iniciar sesión para reservar un evento.');
        return;
    }

    const eventId = document.getElementById('eventId').value;
    const eventDetail = events.find(e => e.id === eventId);

    if (!eventDetail) {
        alert('Evento no encontrado');
        return;
    }

    const reservation = {
        id: Date.now().toString(),
        eventId: eventId,
        userId: currentUser.userId,
        name: `${currentUser.name} ${currentUser.lastName}`,
        idNumber: currentUser.idNumber,
        email: currentUser.email,
        eventTitle: eventDetail.title,
        eventDate: eventDetail.date,
        reservationDate: new Date().toISOString()
    };

    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    document.getElementById('confirmationMessage').innerHTML = `
        <div class="confirmation-details">
            <h3>¡Reserva Confirmada!</h3>
            <p><strong>Evento:</strong> ${eventDetail.title}</p>
            <p><strong>Fecha:</strong> ${eventDetail.date}</p>
            <p><strong>Reservado por:</strong> ${reservation.name}</p>
            <p><strong>ID Reserva:</strong> ${reservation.id}</p>
        </div>
    `;

    closeModal('reservationModal');
    openModal('confirmationModal');
}

// Generic Modal Management Functions
function openModal(modalId, eventId = null) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (eventId) {
            const eventDetail = events.find(e => e.id === eventId);
            if (eventDetail) {
                document.getElementById('reservationEventTitle').textContent = eventDetail.title;
                const currentUser = userManager.getCurrentUser();
                document.getElementById('reservationUserName').textContent = `${currentUser.name} ${currentUser.lastName}`;
                document.getElementById('reservationUserEmail').textContent = currentUser.email;
                document.getElementById('eventId').value = eventId;
            }
        }
    } else {
        console.error(`Modal '${modalId}' no encontrado.`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal '${modalId}' no encontrado.`);
    }
}

function displayReservations() {
    const reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) return;

    reservationsList.innerHTML = '';
    reservations.forEach(reservation => {
        const reservationItem = document.createElement('div');
        reservationItem.classList.add('reservation-item');
        reservationItem.innerHTML = `
            <p><strong>Evento:</strong> ${reservation.eventTitle}</p>
            <p><strong>Fecha:</strong> ${reservation.eventDate}</p>
            <p><strong>Reservado por:</strong> ${reservation.name}</p>
            <p><strong>ID Reserva:</strong> ${reservation.id}</p>
        `;
        reservationsList.appendChild(reservationItem);
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    userManager.checkLoginStatus();
    displayEvents(events);

    // Attach event listener to the create event button
    document.getElementById('createEventButton').addEventListener('click', () => openModal('createEventModal'));

    // Attach event listener to the create event form
    document.getElementById('createEventForm').addEventListener('submit', createEvent);
});