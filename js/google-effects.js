// Google x NASA x CERN Interactive Effects

// Create dynamic data points
function createDataPoints() {
    const container = document.body;
    for (let i = 0; i < 20; i++) {
        const point = document.createElement('div');
        point.className = 'data-points';
        point.style.top = `${Math.random() * 100}%`;
        point.style.left = `${Math.random() * 100}%`;
        point.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(point);
    }
}

// Initialize search functionality
function initSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchButtons = document.querySelectorAll('.search-btn');
    
    searchBox.addEventListener('focus', () => {
        document.querySelector('.search-container').classList.add('focused');
    });

    searchBox.addEventListener('blur', () => {
        document.querySelector('.search-container').classList.remove('focused');
    });

    // Add hover effects to search buttons
    searchButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Create particle effect
function createParticles() {
    const particleCount = 50;
    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
    const container = document.querySelector('.particle-background');

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(particle);
    }
}

// Initialize all effects
function initEffects() {
    createDataPoints();
    initSearch();
    createParticles();

    // Add scroll animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const dataPoints = document.querySelectorAll('.data-points');
        
        dataPoints.forEach(point => {
            point.style.transform = `translateY(${scrolled * 0.2}px)`;
        });
    });
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initEffects);