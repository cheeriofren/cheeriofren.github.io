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

// Initialize all animations
window.addEventListener('load', () => {
    // Remove loading screen
    const loading = document.querySelector('.loading');
    loading.style.opacity = '0';
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);

    // Initialize animations
    createStars();
    createQuantumParticles();
    animateCosmicText();
});

// Smooth Scrolling with Cosmic Effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Scroll Animation with Quantum Effect
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-text, .project-card, .timeline-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animate');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Form Validation with Cosmic Feedback
const contactForm = document.querySelector('.contact-form form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if(name && email && message) {
            // Create cosmic feedback effect
            const feedback = document.createElement('div');
            feedback.className = 'cosmic-feedback';
            feedback.textContent = 'Message sent successfully!';
            contactForm.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
                contactForm.reset();
            }, 3000);
        }
    });
}

// Mobile Menu with Cosmic Transition
const createMobileMenu = () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav ul');
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-button');
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    
    header.insertBefore(menuButton, nav);
    
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuButton.classList.toggle('active');
    });
};

// Initialize mobile menu if on mobile device
if(window.innerWidth <= 768) {
    createMobileMenu();
}

// Responsive adjustments with Cosmic Transitions
window.addEventListener('resize', () => {
    if(window.innerWidth <= 768) {
        if(!document.querySelector('.mobile-menu-button')) {
            createMobileMenu();
        }
    } else {
        const mobileMenu = document.querySelector('.mobile-menu-button');
        if(mobileMenu) {
            mobileMenu.remove();
        }
        const nav = document.querySelector('nav ul');
        if(nav) {
            nav.classList.remove('active');
        }
    }
}); 