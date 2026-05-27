// ========================================
// APP MÓVIL SMILECENTER - JavaScript
// ========================================

/**
 * Navega entre páginas de la aplicación
 * @param {string} pageId - ID de la página a mostrar
 */
function goToPage(pageId) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar la página seleccionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // Scroll al top de la página
        targetPage.scrollTop = 0;
    }

    // Cerrar menú si está abierto
    closeSideMenu();
}

/**
 * Alterna la visibilidad del menú lateral
 */
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.querySelector('.menu-overlay');
    
    if (sideMenu.classList.contains('active')) {
        closeSideMenu();
    } else {
        openSideMenu();
    }
}

/**
 * Abre el menú lateral
 */
function openSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.querySelector('.menu-overlay');
    
    sideMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el menú lateral
 */
function closeSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.querySelector('.menu-overlay');
    
    sideMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Crea el overlay del menú si no existe
 */
function createMenuOverlay() {
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.addEventListener('click', closeSideMenu);
        document.body.appendChild(overlay);
    }
}

// Crear overlay al cargar
document.addEventListener('DOMContentLoaded', createMenuOverlay);

// ========================================
// FORMULARIO DE LOGIN
// ========================================

/**
 * Maneja el envío del formulario de login
 */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;

        // Validaciones básicas
        if (!email || !password) {
            showAlert('Por favor completa todos los campos', 'error');
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Por favor ingresa un correo válido', 'error');
            return false;
        }

        // Simular login (en producción, conectar con backend)
        console.log('✅ Login:', { email, password, remember });
        
        // Guardar preferencia si está marcado
        if (remember) {
            localStorage.setItem('userEmail', email);
        }

        // Ir a página de inicio
        goToPage('homePage');
        loginForm.reset();
        showAlert('¡Bienvenido!', 'success');
    });
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

/**
 * Maneja el envío del formulario de contacto
 */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const service = document.getElementById('contactService').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        // Validaciones
        if (!name || !email || !service || !message) {
            showAlert('Por favor completa todos los campos requeridos', 'error');
            return false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Por favor ingresa un correo válido', 'error');
            return false;
        }

        // Validar mensaje mínimo
        if (message.length < 10) {
            showAlert('El mensaje debe tener al menos 10 caracteres', 'error');
            return false;
        }

        // Deshabilitar botón
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // Simular envío (en producción usar fetch o axios)
            console.log('📨 Mensaje de contacto:', { name, email, phone, service, message });
            
            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 1500));

            // En producción:
            // const response = await fetch('https://api.smilecenter.com/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, phone, service, message })
            // });

            showAlert('✅ Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
            contactForm.reset();

            // Redirigir después de 2 segundos
            setTimeout(() => {
                goToPage('homePage');
            }, 2000);

        } catch (error) {
            console.error('❌ Error al enviar:', error);
            showAlert('Error al enviar el mensaje. Intenta nuevamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ========================================
// NOTIFICACIONES Y ALERTAS
// ========================================

/**
 * Muestra un alert en la app
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta: 'success', 'error', 'warning', 'info'
 */
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${getAlertColor(type)};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 90%;
        text-align: center;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;

    alert.textContent = message;
    document.body.appendChild(alert);

    // Remover después de 3 segundos
    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

/**
 * Retorna el color según el tipo de alerta
 */
function getAlertColor(type) {
    const colors = {
        success: '#27AE60',
        error: '#E74C3C',
        warning: '#F39C12',
        info: '#4A90D9'
    };
    return colors[type] || colors.info;
}

// ========================================
// SINCRONIZACIÓN CON GMAIL
// ========================================

/**
 * Abre Gmail para enviar un email
 * @param {string} email - Email destino
 */
function openGmail(email = 'delahozjostin6@gmail.com') {
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    window.open(mailtoLink, '_blank');
}

/**
 * Envía un email a través de Gmail
 * (Requiere autenticación del usuario)
 */
function sendEmailViaGmail(subject, body, email = 'delahozjostin6@gmail.com') {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// ========================================
// FUNCIONALIDADES DE WHATSAPP
// ========================================

/**
 * Envía un mensaje predefinido a WhatsApp
 * @param {string} message - Mensaje a enviar
 */
function sendWhatsAppMessage(message = '¡Hola! Me gustaría agendar una cita.') {
    const phone = '573106594378';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ========================================
// ALMACENAMIENTO LOCAL
// ========================================

/**
 * Guarda datos en localStorage
 */
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error leyendo localStorage:', error);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removiendo de localStorage:', error);
            return false;
        }
    },

    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
            return false;
        }
    }
};

// ========================================
// CITAS Y CALENDARIO
// ========================================

/**
 * Clase para manejar citas
 */
class Appointment {
    constructor(name, service, date, time, notes = '') {
        this.id = Date.now();
        this.name = name;
        this.service = service;
        this.date = date;
        this.time = time;
        this.notes = notes;
        this.created = new Date();
    }
}

/**
 * Gestor de citas
 */
const AppointmentManager = {
    getAll: () => {
        return Storage.get('appointments') || [];
    },

    add: (appointment) => {
        const appointments = AppointmentManager.getAll();
        appointments.push(appointment);
        return Storage.set('appointments', appointments);
    },

    delete: (appointmentId) => {
        const appointments = AppointmentManager.getAll();
        const filtered = appointments.filter(a => a.id !== appointmentId);
        return Storage.set('appointments', filtered);
    },

    getById: (appointmentId) => {
        const appointments = AppointmentManager.getAll();
        return appointments.find(a => a.id === appointmentId);
    }
};

// ========================================
// UTILIDADES DE UBICACIÓN
// ========================================

/**
 * Obtiene la ubicación actual del usuario
 */
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocalización no disponible'));
        }
    });
}

/**
 * Abre Google Maps con la clínica
 */
function openClinicLocation() {
    const clinicAddress = 'Calle+72+58-23+Barrio+El+Prado+Barranquilla+Colombia';
    const mapsUrl = `https://maps.google.com/?q=${clinicAddress}`;
    window.open(mapsUrl, '_blank');
}

// ========================================
// VALIDACIONES
// ========================================

/**
 * Validador de formularios
 */
const Validator = {
    isEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    isPhone: (phone) => {
        const digitos = phone.replace(/\D/g, '');
        return digitos.length >= 7;
    },

    isMinLength: (string, length) => {
        return string.trim().length >= length;
    },

    isEmpty: (string) => {
        return string.trim().length === 0;
    }
};

// ========================================
// TEMAS Y PERSONALIZACIÓN
// ========================================

/**
 * Gestor de temas
 */
const ThemeManager = {
    setDarkMode: (enabled) => {
        if (enabled) {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#e0e0e0';
        } else {
            document.body.style.backgroundColor = '#FFFFFF';
            document.body.style.color = '#2F3D4A';
        }
        Storage.set('darkMode', enabled);
    },

    isDarkMode: () => {
        return Storage.get('darkMode') || false;
    },

    toggleDarkMode: () => {
        const isDark = ThemeManager.isDarkMode();
        ThemeManager.setDarkMode(!isDark);
    }
};

// ========================================
// SERVICIOS DE NOTIFICACIÓN
// ========================================

/**
 * Solicita permiso para notificaciones push
 */
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            return;
        }
        if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('¡Bienvenido a SmileCenter!', {
                        body: 'Recibe recordatorios de tus citas',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%234A90D9" d="M12 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
                    });
                }
            });
        }
    }
}

/**
 * Muestra una notificación
 */
function showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}

// ========================================
// ESTADÍSTICAS Y ANALYTICS
// ========================================

/**
 * Registra eventos de la aplicación
 */
const Analytics = {
    trackEvent: (eventName, eventData = {}) => {
        console.log(`📊 Evento: ${eventName}`, eventData);
        // En producción, enviar a Google Analytics o similar
    },

    trackPageView: (pageName) => {
        Analytics.trackEvent('page_view', { page: pageName });
    }
};

// Rastrear cambio de página
const originalGoToPage = goToPage;
window.goToPage = function(pageId) {
    Analytics.trackPageView(pageId);
    originalGoToPage(pageId);
};

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    console.log('%c✅ SmileCenter Mobile App', 'font-size: 16px; color: #4A90D9; font-weight: bold;');
    console.log('%cAplicación cargada correctamente', 'color: #5CBA8A; font-size: 14px;');
    
    // Cargar preferencias guardadas
    const userEmail = Storage.get('userEmail');
    if (userEmail) {
        document.getElementById('email').value = userEmail;
    }

    // Solicitar permisos de notificación
    requestNotificationPermission();

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('⚠️ Service Worker no disponible:', err);
        });
    }

    // Detectar cambios en online/offline
    window.addEventListener('online', () => {
        showAlert('¡Conectado nuevamente!', 'success');
    });

    window.addEventListener('offline', () => {
        showAlert('Sin conexión a internet', 'warning');
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// ========================================
// SOPORTE PARA IPHONE (NOTCH Y SAFE AREAS)
// ========================================

/**
 * Ajusta la aplicación para notch de iPhone
 */
function adjustForNotch() {
    const header = document.querySelector('.mobile-header');
    const pageContent = document.querySelector('.page-content');

    if (header) {
        const safeTop = getComputedStyle(document.documentElement).getPropertyValue('--safe-top');
        if (safeTop) {
            header.style.paddingTop = `calc(1rem + ${safeTop})`;
        }
    }
}

// Ejecutar al cargar
window.addEventListener('load', adjustForNotch);

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Formatea una fecha al formato amigable
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-CO', options);
}

/**
 * Formatea una hora
 */
function formatTime(time) {
    return time;
}

/**
 * Copia texto al portapapeles
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('¡Copiado al portapapeles!', 'success');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

console.log('🏥 SmileCenter - Versión Mobile | iPhone 14 Optimizado');
console.log('📱 App cargada correctamente');
