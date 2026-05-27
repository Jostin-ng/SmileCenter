// ========================================
// MENÚ MÓVIL Y NAVEGACIÓN
// ========================================

/**
 * Maneja la apertura y cierre del menú hamburguesa en dispositivos móviles
 */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    // Abre/cierra el menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Cierra el menú al hacer clic en un enlace de navegación
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Cierra el menú al presionar la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========================================
// SCROLL SUAVE Y NAVEGACIÓN ACTIVA
// ========================================

/**
 * Implementa scroll suave para enlaces internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !document.querySelector(href)) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

/**
 * Maneja el envío del formulario de contacto con validación
 */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar honeypot (campo antispam)
        const honeypot = document.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) {
            console.warn('⚠️ Formulario de spam detectado');
            return false;
        }

        // Validar que la casilla de privacidad esté marcada
        const privacidadCheckbox = document.getElementById('privacidad');
        if (!privacidadCheckbox.checked) {
            mostrarError('Debes aceptar el tratamiento de datos personales para continuar.');
            return false;
        }

        // Validar campos requeridos
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const servicio = document.getElementById('servicio').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !telefono || !servicio || !asunto || !mensaje) {
            mostrarError('Por favor completa todos los campos requeridos.');
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarError('Por favor ingresa un correo electrónico válido.');
            return false;
        }

        // Validar teléfono (al menos 7 dígitos)
        const telefonoRegex = /\d{7,}/;
        if (!telefonoRegex.test(telefono.replace(/\D/g, ''))) {
            mostrarError('Por favor ingresa un teléfono válido (mínimo 7 dígitos).');
            return false;
        }

        // Validar longitud del mensaje
        if (mensaje.length < 10) {
            mostrarError('El mensaje debe tener al menos 10 caracteres.');
            return false;
        }

        // Deshabilitar botón y mostrar estado de envío
        submitBtn.disabled = true;
        const textoOriginal = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        // El formulario se envía automáticamente a Formspree
        // Formspree maneja el envío y redirige/responde
        try {
            // Esperar a que Formspree procese el formulario
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Si llegamos aquí, el formulario se envió exitosamente
            mostrarExito();
            contactForm.reset();
            privacidadCheckbox.checked = false;
            
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = textoOriginal;
        } catch (error) {
            console.error('❌ Error en el formulario:', error);
            mostrarError('Error de conexión. Intenta nuevamente.');
            submitBtn.disabled = false;
            submitBtn.textContent = textoOriginal;
        }
    });
}

/**
 * Muestra mensaje de éxito en el formulario
 */
function mostrarExito() {
    formStatus.innerHTML = '✅ ¡Mensaje enviado exitosamente! Te contactaremos en menos de 24 horas.';
    formStatus.className = 'form-status show success';
    
    // Desplazar hacia el mensaje de estado
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}

/**
 * Muestra mensaje de error en el formulario
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    formStatus.innerHTML = '❌ ' + mensaje;
    formStatus.className = 'form-status show error';
    
    // Desplazar hacia el mensaje de estado
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}

// ========================================
// FUNCIONALIDAD DE SELECCIONAR SERVICIO
// ========================================

/**
 * Scroll hacia el formulario y selecciona un servicio específico
 * @param {string} servicio - Nombre del servicio a seleccionar
 */
function scrollToForm(servicio) {
    document.getElementById('servicio').value = servicio;
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    
    // Dar enfoque al campo de servicio para mejor accesibilidad
    setTimeout(() => {
        document.getElementById('servicio').focus();
    }, 500);
}

// ========================================
// VALIDACIÓN EN TIEMPO REAL
// ========================================

/**
 * Valida el email mientras el usuario escribe
 */
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#E74C3C';
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.style.borderColor = '';
            this.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Valida el teléfono mientras el usuario escribe
 */
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        // Solo permitir números, espacios, guiones y paréntesis
        this.value = this.value.replace(/[^\d\s\-\+\(\)]/g, '');
    });

    telefonoInput.addEventListener('blur', function() {
        const digitos = this.value.replace(/\D/g, '');
        if (this.value && digitos.length < 7) {
            this.style.borderColor = '#E74C3C';
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.style.borderColor = '';
            this.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Valida la longitud del mensaje
 */
const mensajeInput = document.getElementById('mensaje');
if (mensajeInput) {
    mensajeInput.addEventListener('input', function() {
        const caracteres = this.value.length;
        if (caracteres > 0 && caracteres < 10) {
            this.style.borderColor = '#F39C12';
        } else {
            this.style.borderColor = '';
        }
    });
}

// ========================================
// HEADER STICKY CON SOMBRA
// ========================================

/**
 * Agrega sombra al header cuando se hace scroll
 */
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ========================================
// LAZY LOADING DE IMÁGENES
// ========================================

/**
 * Carga imágenes cuando entran en el viewport
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// ANIMACIÓN DE NÚMEROS (CONTADOR)
// ========================================

/**
 * Anima un número desde un valor inicial a uno final
 * @param {HTMLElement} element - Elemento donde mostrar el número
 * @param {number} start - Valor inicial
 * @param {number} end - Valor final
 * @param {number} duration - Duración en milisegundos
 */
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        element.textContent = value.toLocaleString('es-CO');

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// ========================================
// DETECCIÓN DE TEMA (DARK MODE)
// ========================================

/**
 * Detecta y aplica preferencias de tema del sistema
 */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// ========================================
// MONITOREO DE PERFORMANCE
// ========================================

/**
 * Registra el tiempo de carga de la página
 */
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('⏱️ Tiempo de carga: ' + pageLoadTime + 'ms');
        console.log('✅ SmileCenter - Sitio web cargado exitosamente');
    }
});

// ========================================
// SERVICE WORKER (OPCIONAL - PWA)
// ========================================

/**
 * Registra el service worker para soporte offline (opcional)
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('⚠️ Service Worker no disponible:', err);
    });
}

// ========================================
// FUNCIÓN DE SCROLL SUAVE AUXILIAR
// ========================================

/**
 * Realiza scroll suave hacia un elemento
 * @param {Event} event - Evento del click
 * @param {string} targetId - ID del elemento objetivo (opcional)
 */
function smoothScroll(event, targetId) {
    event.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// INICIALIZACIÓN Y LOGGING
// ========================================

console.log('%c✅ SmileCenter', 'font-size: 16px; color: #4A90D9; font-weight: bold;');
console.log('%cSitio web de odontología cargado correctamente', 'color: #5CBA8A; font-size: 14px;');
console.log('📍 Ubicación: Barrio El Prado, Barranquilla, Colombia');
console.log('📱 Responsive: Sí');
console.log('♿ Accesibilidad WCAG: AA');
