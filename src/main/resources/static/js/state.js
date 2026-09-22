// ============================================================
// state.js — Estado global compartido por TODAS las páginas HTML.
//
// Traducción de src/context/AppContext.tsx, adaptada a un sitio
// multi-página real. Aquí cada página SÍ es una carga de documento 
// nueva, así que:
//   La navegación usa <a href> reales.
//   - window.history.back() (equivalente nativo
//     del navegador a los intentos de "volver").
//   - selectedEventId pasa a viajar por la URL (?id=...) hacia
//     event-detail.html, en vez de guardarse en memoria.
// Todo lo que en el original ya se guardaba en localStorage
// (usuario, intentos fallidos, bloqueo, favoritos, agenda,
// notificaciones) se conserva EXACTAMENTE igual, con las mismas
// claves y valores por defecto.
// ============================================================

// Convierte caracteres especiales para evitar que valores dinámicos se interpreten como HTML.
function escapeHtml(str) {
    if (str === null || str === undefined)
        return '';
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// Obtiene un parámetro específico de la URL actual.
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const AppState = {
    user: null,
    failedLoginAttempts: 0,
    lockoutUntil: null,

    events: [],
    favorites: [],
    agenda: [],
    notifications: [],

    // ------------------------------------------------------------
    // Inicialización — se llama en CADA página al cargar el documento
    // ------------------------------------------------------------
    init() {
        const savedUser = localStorage.getItem('culturatech_user');

        this.user = savedUser
                ? JSON.parse(savedUser)
                : null;

        const paginaActual = window.location.pathname
                .split('/')
                .pop()
                .toLowerCase();

        const paginasPublicas = [
            'login.html',
            'register.html'
        ];

        if (!this.user && !paginasPublicas.includes(paginaActual)) {
            window.location.replace('login.html');
            return;
        }

        const savedAttempts = localStorage.getItem('culturatech_failed_attempts');
        this.failedLoginAttempts = savedAttempts ? parseInt(savedAttempts, 10) : 0;

        const savedLockout = localStorage.getItem('culturatech_lockout_until');
        this.lockoutUntil = savedLockout ? parseInt(savedLockout, 10) : null;

        const savedFavorites = localStorage.getItem('culturatech_favorites');

        this.favorites = savedFavorites
                ? JSON.parse(savedFavorites).map(Number).filter(Number.isFinite)
                : [6, 5, 8];

        const savedAgenda = localStorage.getItem('culturatech_agenda');
        this.agenda = savedAgenda ? JSON.parse(savedAgenda) : [];

        const savedNotifications = localStorage.getItem('culturatech_notifications');
        this.notifications = savedNotifications
                ? JSON.parse(savedNotifications).map(n =>
            n.eventId !== undefined && typeof n.eventId !== 'number'
                    ? {...n, eventId: undefined}
            : n
        )
                : [];
    },

    // -------------  Auth  -----------------------------------------
    // Actualiza el usuario autenticado y guarda sus datos en localStorage.
    setUser(user) {
        if (user) {
            this.user = {
                ...user,
                id: user.id ?? user.idUsuario,
                name: user.name ?? user.nombres,
                lastname: user.lastname ?? user.apellidos,
                email: user.email ?? user.correo,
                cedula: user.cedula ?? user.documento,
                birthdate: user.birthdate ?? user.fechaNacimiento,
                rol: user.rol
            };

            localStorage.setItem(
                    'culturatech_user',
                    JSON.stringify(this.user)
                    );
        } else {
            this.user = null;
            localStorage.removeItem('culturatech_user');
        }
    },
    
    // Actualiza y almacena el número de intentos fallidos de inicio de sesión.
            setFailedLoginAttempts(value) {
        this.failedLoginAttempts = typeof value === 'function' ? value(this.failedLoginAttempts) : value;
        localStorage.setItem('culturatech_failed_attempts', this.failedLoginAttempts.toString());
    },
    
    // Actualiza y almacena el momento hasta el cual permanece activo el bloqueo.
    setLockoutUntil(ts) {
        this.lockoutUntil = ts;
        if (ts) {
            localStorage.setItem('culturatech_lockout_until', ts.toString());
        } else {
            localStorage.removeItem('culturatech_lockout_until');
        }
    },
    
    // Cierra la sesión del usuario y elimina los datos almacenados localmente.
    async logout() {
        try {
            await fetch('../LogoutServlet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            });

        } catch (error) {
            console.error('Error al cerrar la sesión del servidor:', error);
        } finally {
            this.setUser(null);
            window.location.replace('login.html');
        }
    },

    // ------------------------------------------------------------
    // Favoritos
    // ------------------------------------------------------------
    toggleFavorite(eventId) {
        const id = Number(eventId);

        this.favorites = this.favorites.includes(id)
                ? this.favorites.filter(item => item !== id)
                : [...this.favorites, id];

        localStorage.setItem(
                'culturatech_favorites',
                JSON.stringify(this.favorites)
                );
    },

    isFavorite(eventId) {
        return this.favorites.includes(Number(eventId));
    },

    // ------------------------------------------------------------
    // Agenda
    // ------------------------------------------------------------
    addToAgenda(eventId, note = '') {
        if (!this.isInAgenda(eventId)) {
            this.agenda = [
                ...this.agenda,
                {
                    eventId,
                    addedAt: new Date().toISOString().split('T')[0],
                    dateBadge: 'Programado',
                    note
                }
            ];
            localStorage.setItem('culturatech_agenda', JSON.stringify(this.agenda));
    }
    },

    removeFromAgenda(eventId) {
        this.agenda = this.agenda.filter(item => item.eventId !== eventId);
        localStorage.setItem('culturatech_agenda', JSON.stringify(this.agenda));
    },

    updateAgendaNote(eventId, note) {
        const id = Number(eventId);

        this.agenda = this.agenda.map(item =>
            item.eventId === id
                    ? {...item, note}
            : item
        );

        localStorage.setItem(
                'culturatech_agenda',
                JSON.stringify(this.agenda)
                );
    },

    isInAgenda(eventId) {
        return this.agenda.some(item => item.eventId === eventId);
    },

    // ------------------------------------------------------------
    // Notificaciones
    // ------------------------------------------------------------
    markNotificationAsRead(id) {
        this.notifications = this.notifications.map(item => (item.id === id ? {...item, isRead: true} : item));
        localStorage.setItem('culturatech_notifications', JSON.stringify(this.notifications));
    },

    markAllNotificationsAsRead() {
        this.notifications = this.notifications.map(item => ({...item, isRead: true}));
        localStorage.setItem('culturatech_notifications', JSON.stringify(this.notifications));
    },

    getUnreadNotificationsCount() {
        return this.notifications.filter(n => !n.isRead).length;
    }
};
