/**
 * ELEVATE MEDIA LABS
 * JavaScript Principal
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Elevate Media Labs - Inicializado');
  
  // Inicializar funcionalidades
  initParticles();
  initNavigation();
  initSmoothScroll();
  initScrollAnimations();
  initParallaxScroll();
  initContactForm();
});


/**
 * Inicializar tsParticles
 */
function initParticles() {
  if (typeof tsParticles === 'undefined') {
    console.warn('tsParticles no está cargado');
    return;
  }

  // Configurar el contenedor antes de cargar
  const container = document.getElementById('tsparticles');
  if (container) {
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 0 !important;
      pointer-events: none !important;
    `;
  }

  tsParticles.load("tsparticles", {
    fullScreen: {
      enable: false
    },
    background: {
      color: {
        value: "transparent"
      }
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push"
        },
        onHover: {
          enable: true,
          mode: "grab"
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 3
        },
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
            color: "#22d3ee"
          }
        }
      }
    },
    particles: {
      color: {
        value: ["#a855f7", "#8b5cf6", "#22d3ee"]
      },
      links: {
        color: "#a855f7",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: false,
        speed: 0.8,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 60
      },
      opacity: {
        value: 0.3,
        random: true,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
          sync: false
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 },
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false
        }
      }
    },
    detectRetina: true
  }).then(container => {
    console.log('✨ tsParticles cargado correctamente');
  }).catch(error => {
    console.error('Error al cargar tsParticles:', error);
  });
}


/**
 * Inicializar navegación (Header scroll & Mobile menu)
 */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Scroll Effect - Cambiar fondo del header
  let lastScroll = 0;
  
  window.addEventListener('scroll', debounce(function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, 10));
  
  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    // Crear overlay para móvil
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    overlay.id = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menú
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en el overlay
    overlay.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Cerrar menú al hacer clic en un link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}


/**
 * Scroll suave para enlaces internos
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const header = document.getElementById('header');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calcular el offset del header (con margen adicional)
        const headerHeight = header ? header.offsetHeight : 80;
        const offset = 20; // Espacio adicional
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/**
 * Animaciones al hacer scroll (Intersection Observer)
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos con la clase 'animate-on-scroll'
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
}


/**
 * Efecto Parallax en Scroll (para service cards)
 */
function initParallaxScroll() {
  const serviceCards = document.querySelectorAll('.service-card[data-scroll-speed]');
  
  if (serviceCards.length === 0) return;
  
  window.addEventListener('scroll', debounce(function() {
    const scrolled = window.pageYOffset;
    
    serviceCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top + scrolled;
      const cardVisible = card.getBoundingClientRect().top < window.innerHeight;
      
      if (cardVisible) {
        const speed = parseFloat(card.getAttribute('data-scroll-speed')) || 1;
        const yPos = -(scrolled - cardTop) * (1 - speed) * 0.1;
        card.style.transform = `translateY(${yPos}px)`;
      }
    });
  }, 10));
}


/**
 * Inicializar formulario de contacto
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      message: document.getElementById('message').value
    };
    
    // Simular envío (aquí conectarías con tu backend o servicio de email)
    showFormMessage('success', '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    
    // Limpiar formulario
    form.reset();
    
    // Para implementación real, descomenta esto:
    /*
    fetch('tu-endpoint-aqui', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      showFormMessage('success', '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
      form.reset();
    })
    .catch(error => {
      showFormMessage('error', 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    });
    */
  });
}


/**
 * Mostrar mensaje del formulario
 */
function showFormMessage(type, message) {
  const formMessage = document.getElementById('formMessage');
  if (!formMessage) return;
  
  formMessage.textContent = message;
  formMessage.className = 'form-message ' + type;
  
  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    formMessage.className = 'form-message';
  }, 5000);
}


/**
 * Utilidad: Debounce para optimizar eventos
 */
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

