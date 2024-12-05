// main.js
let events = JSON.parse(localStorage.getItem('events')) || [
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



let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let isAdmin = false;

function displayEvents(eventsToDisplay) {
    const eventsContainer = document.getElementById('eventsContainer');
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
            <button onclick="openModal('${event.id}')">Reservar Ticket</button>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

function filterEvents() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayEvents(filteredEvents);
}

function openModal(eventId) {
    const currentUser = userManager.getCurrentUser();
    const eventDetail = events.find(e => e.id === eventId);
    
    if (!userManager.isAuthenticated()) {
        alert('Por favor inicie sesión para reservar');
        return;
    }

    if (!eventDetail) {
        alert('Evento no encontrado');
        return;
    }

    document.getElementById('reservationEventTitle').textContent = eventDetail.title;
    document.getElementById('reservationUserName').textContent = `${currentUser.name} ${currentUser.lastName}`;
    document.getElementById('reservationUserEmail').textContent = currentUser.email;
    document.getElementById('eventId').value = eventId;
    document.getElementById('reservationModal').style.display = 'block';
}

function reserveTicket(event) {
    event.preventDefault();
    const currentUser = userManager.getCurrentUser();
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

    document.getElementById('reservationModal').style.display = 'none';
    document.getElementById('confirmationModal').style.display = 'block';
}

// Modal Functions
function closeModal() {
    document.getElementById('reservationModal').style.display = 'none';
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function authenticateAdmin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (password === "admin") {
        isAdmin = true;
        document.getElementById('adminLink').style.display = 'inline-block';
        closeAdminModal();
    } else {
        alert("Contraseña incorrecta. No tienes acceso a las funciones de administrador.");
    }
}

function openReservationsModal() {
    const reservationsList = document.getElementById('reservationsList');
    reservationsList.innerHTML = '';

    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p>No hay reservas realizadas.</p>';
    } else {
        reservations.forEach(reservation => {
            const event = events.find(e => e.id === reservation.eventId);
            if (event) {
                const reservationItem = document.createElement('div');
                reservationItem.innerHTML = `
                    <p>Nombre: ${reservation.name}</p>
                    <p>Evento: ${event.title}</p>
                    <hr>
                `;
                reservationsList.appendChild(reservationItem);
            }
        });
    }

    document.getElementById('reservationsModal').style.display = 'block';
}

function closeReservationsModal() {
    document.getElementById('reservationsModal').style.display = 'none';
}

function openCreateEventModal() {
    const modal = document.getElementById("createEventModal");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("Modal 'createEventModal' no encontrado.");
    }
}

function closeCreateEventModal() {
    const modal = document.getElementById("createEventModal");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Modal 'createEventModal' no encontrado.");
    }
}

// Initialize
window.onload = function() {
    displayEvents(events);
    userManager.checkLoginStatus();
};
