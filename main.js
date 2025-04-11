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

// Optimized JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initializeCore();
    
    // Load non-critical features after initial render
    requestIdleCallback(() => {
        initializeNonCriticalFeatures();
    });
});

// Core features that run immediately
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
}

// Non-critical features that load after initial render
function initializeNonCriticalFeatures() {
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Load images lazily
    initializeLazyLoading();
}

// Optimized scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Optimized hover effects
function initializeHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-3px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow)';
        });
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
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

// Initialize Particles.js
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for timeline items
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Particles.js configuration
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                resize: true
            }
        },
        retina_detect: true
    });

    // Handle loading screen
    window.addEventListener('load', () => {
        // Optimized Loading Screen
        document.addEventListener('DOMContentLoaded', () => {
            const loader = document.querySelector('.loading');
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 500);
            }, 800);
        });
        
        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('counter-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Optimized Particle Configuration
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: { enable: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 }
                }
            },
            retina_detect: true
        });
        
        // Form Validation with Feedback
        const validateForm = (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const feedback = document.createElement('div');
            
            try {
                // Add your form submission logic here
                feedback.className = 'form-feedback success';
                feedback.textContent = 'Message sent successfully!';
                form.reset();
            } catch (error) {
                feedback.className = 'form-feedback error';
                feedback.textContent = 'Something went wrong. Please try again.';
            }
            
            form.appendChild(feedback);
            setTimeout(() => feedback.remove(), 3000);
        };
    });
    
    // Dark Mode Toggle
    const toggleTheme = () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    
    // Skills Animation
    const animateSkills = () => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = `${progress}%`;
        });
    };
    
    // Project Filtering
    const filterProjects = (category) => {
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
            const shouldShow = category === 'all' || project.dataset.category === category;
            project.style.display = shouldShow ? 'block' : 'none';
        });
    };
    
    // Form Validation
    const validateForm = (event) => {
        event.preventDefault();
        const form = event.target;
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
    
        inputs.forEach(input => {
            const errorMessage = input.nextElementSibling;
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(input, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(input);
            }
        });
    
        if (isValid) {
            showSuccessMessage();
            form.reset();
        }
    };
    
    // Mobile Navigation
    const toggleMobileNav = () => {
        const nav = document.querySelector('nav ul');
        const hamburger = document.querySelector('.hamburger');
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    };