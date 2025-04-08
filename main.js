// Create Stars
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Quantum Particles Animation
function createQuantumParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Cosmic Text Animation
function animateCosmicText() {
    const elements = document.querySelectorAll('.animate-text');
    elements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.animationDelay = i * 0.1 + 's';
            element.appendChild(span);
        }
    });
}

// Performance optimized initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initializeCore();
    
    // Initialize optional features based on viewport
    if (window.innerWidth > 768) {
        initializeDesktopFeatures();
    }
    
    // Initialize mobile features if needed
    if (window.innerWidth <= 768) {
        initializeMobileFeatures();
    }
});

// Core features that run on all devices
function initializeCore() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Basic animations
    initializeBasicAnimations();
}

// Desktop-only features
function initializeDesktopFeatures() {
    // Parallax effect with throttling
    let ticking = false;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleParallax(e, hero);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Card hover effects with delegation
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsGrid.addEventListener('mousemove', handleCardHover);
    }
}

// Mobile-specific features
function initializeMobileFeatures() {
    // Mobile menu
    const menuButton = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('nav ul');
    
    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}

// Basic animations with minimal impact
function initializeBasicAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Event Handlers
function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (isValid) {
        showFeedback('Message sent successfully!');
        form.reset();
    }
}

function handleParallax(e, element) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    element.style.backgroundPosition = `${x * 50}% ${y * 50}%`;
}

function handleCardHover(e) {
    const card = e.target.closest('.project-card');
    if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }
}

// Utility Functions
function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'cosmic-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Optimized resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-button')) {
                initializeMobileFeatures();
            }
        } else {
            const mobileMenu = document.querySelector('.mobile-menu-button');
            const nav = document.querySelector('nav ul');
            if (mobileMenu) {
                mobileMenu.remove();
            }
            if (nav) {
                nav.classList.remove('active');
            }
        }
    }, 250);
}); 