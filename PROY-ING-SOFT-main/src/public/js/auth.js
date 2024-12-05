// auth.js
const userManager = {
    users: JSON.parse(localStorage.getItem('users')) || [],

    registerUser(userData) {
        if (this.users.find(u => u.email === userData.email)) {
            throw new Error('Email ya registrado');
        }
        if (this.users.find(u => u.idNumber === userData.idNumber)) {
            throw new Error('Cédula ya registrada');
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return newUser;
    },

    loginUser(email, password) {
        const user = this.users.find(u => 
            u.email === email && u.password === password
        );
        if (!user) throw new Error('Credenciales inválidas');

        const session = {
            userId: user.id,
            name: user.name,
            lastName: user.lastName,
            idNumber: user.idNumber,
            email: user.email,
            token: Math.random().toString(36).substring(2),
            expires: new Date(Date.now() + 24*60*60*1000)
        };

        localStorage.setItem('currentSession', JSON.stringify(session));
        return session;
    },

    getCurrentUser() {
        const session = JSON.parse(localStorage.getItem('currentSession'));
        if (!session || new Date(session.expires) <= new Date()) {
            localStorage.removeItem('currentSession');
            return null;
        }
        return session;
    },

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    logout() {
        localStorage.removeItem('currentSession');
        localStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    },

    checkLoginStatus() {
        const currentUser = this.getCurrentUser();
        const loginButton = document.getElementById('loginButton');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const adminLink = document.getElementById('adminLink');
        
        if (currentUser) {
            loginButton.style.display = 'none';
            userInfo.style.display = 'flex';
            userName.textContent = `${currentUser.name} ${currentUser.lastName}`;
            if (localStorage.getItem('isAdmin') === 'true') {
                adminLink.style.display = 'inline-block';
            }
        } else {
            loginButton.style.display = 'inline-block';
            userInfo.style.display = 'none';
            adminLink.style.display = 'none';
        }
    }
};

// Auth helper functions
function loginUser(event) {
    event.preventDefault();
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        userManager.loginUser(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        const messageBox = document.getElementById('loginMessage');
        messageBox.innerHTML = error.message;
        messageBox.className = 'message-box error';
    }
}

function registerUser(event) {
    event.preventDefault();
    try {
        const userData = {
            name: document.getElementById('registerName').value,
            lastName: document.getElementById('registerLastName').value,
            idNumber: document.getElementById('registerIdNumber').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        };

        userManager.registerUser(userData);
        window.location.href = 'login.html';
    } catch (error) {
        const messageBox = document.getElementById('registerMessage');
        messageBox.innerHTML = error.message;
        messageBox.className = 'message-box error';
    }
}

function logoutUser() {
    userManager.logout();
}

// Initialize auth check
window.addEventListener('load', () => {
    if (userManager && typeof userManager.checkLoginStatus === 'function') {
        userManager.checkLoginStatus();
    }
});