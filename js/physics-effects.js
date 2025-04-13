// Enhanced Physics Animation System
class PhysicsSystem {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        this.wavePhase = 0;
        this.quantumStates = new Map();
        this.init();
    }

    init() {
        // Initialize WebGL context with proper settings
        this.initWebGLContext();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
        this.initMagneticElements();
    }

    initWebGLContext() {
        // Create and configure WebGL context
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        document.body.appendChild(canvas);

        // Set canvas size to match display size
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;

        // Initialize WebGL context with anti-aliasing and alpha
        const gl = canvas.getContext('webgl', {
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false
        });

        if (!gl) {
            console.warn('WebGL not supported, falling back to canvas 2D');
            return;
        }

        // Configure WebGL viewport and initial state
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        this.gl = gl;
        this.canvas = canvas;

        // Handle window resize
        window.addEventListener('resize', () => {
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;
            gl.viewport(0, 0, canvas.width, canvas.height);
        });
    }

    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.id = 'particle-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '0';
        document.body.appendChild(particleContainer);
 and 
        // Create quantum field visualization
        const quantumField = document.createElement('canvas');
        quantumField.id = 'quantum-field';
        quantumField.style.position = 'fixed';
        quantumField.style.top = '0';
        quantumField.style.left = '0';
        quantumField.style.width = '100%';
        quantumField.style.height = '100%';
        quantumField.style.pointerEvents = 'none';
        quantumField.style.zIndex = '-1';
        quantumField.style.opacity = '0.3';
        document.body.appendChild(quantumField);
        this.quantumField = quantumField;
        this.quantumCtx = quantumField.getContext('2d');

        // Initialize quantum field
        this.initQuantumField();

        for (let i = 0; i < 150; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 12 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = `radial-gradient(circle at center, rgba(97, 218, 251, ${Math.random() * 0.3 + 0.7}), rgba(74, 144, 226, ${Math.random() * 0.2 + 0.3})`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            particle.style.boxShadow = `0 0 ${size * 2}px rgba(97, 218, 251, ${particle.style.opacity})`;
            particle.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
            particleContainer.appendChild(particle);
            const quantumState = {
                energy: Math.random(),
                phase: Math.random() * Math.PI * 2,
                wavelength: Math.random() * 20 + 10,
                probability: Math.random()
            };
            
            this.particles.push({
                element: particle,
                x: parseFloat(particle.style.left),
                y: parseFloat(particle.style.top),
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                scale: Math.random() * 0.5 + 0.5,
                quantumState: quantumState,
                superposition: Math.random() > 0.5
            });
            
            this.quantumStates.set(particle, quantumState);
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Initialize magnetic elements
        const magneticElements = document.querySelectorAll('.magnetic-element');
        magneticElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => this.handleMagneticEffect(e, elem));
            elem.addEventListener('mouseleave', () => this.resetMagneticEffect(elem));
        });
    }

    handleMagneticEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.max(rect.width, rect.height);
        const force = (maxDistance - distance) / maxDistance;

        if (force > 0) {
            const moveX = deltaX * force * 0.3;
            const moveY = deltaY * force * 0.3;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    resetMagneticEffect(element) {
        element.style.transform = 'translate(0, 0)';
    }

    initQuantumField() {
        this.quantumField.width = window.innerWidth;
        this.quantumField.height = window.innerHeight;
        this.wavePoints = [];
        
        // Create wave points
        for (let i = 0; i < 5; i++) {
            this.wavePoints.push({
                x: Math.random() * this.quantumField.width,
                y: Math.random() * this.quantumField.height,
                phase: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 50 + 25
            });
        }
    }

    drawQuantumField() {
        this.quantumCtx.clearRect(0, 0, this.quantumField.width, this.quantumField.height);
        
        // Create interference pattern
        const imageData = this.quantumCtx.createImageData(this.quantumField.width, this.quantumField.height);
        const data = imageData.data;
        
        for (let x = 0; x < this.quantumField.width; x += 4) {
            for (let y = 0; y < this.quantumField.height; y += 4) {
                let interference = 0;
                
                this.wavePoints.forEach(point => {
                    const dx = x - point.x;
                    const dy = y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    interference += Math.sin(distance * point.frequency + point.phase) * point.amplitude;
                });
                
                const index = (y * this.quantumField.width + x) * 4;
                const intensity = Math.abs(interference) / 200;
                
                data[index] = 97;     // R
                data[index + 1] = 218; // G
                data[index + 2] = 251; // B
                data[index + 3] = intensity * 255;
            }
        }
        
        this.quantumCtx.putImageData(imageData, 0, 0);
        
        // Update wave points
        this.wavePoints.forEach(point => {
            point.phase += 0.02;
            point.x += Math.sin(this.time) * 0.5;
            point.y += Math.cos(this.time) * 0.5;
            
            // Wrap around edges
            point.x = (point.x + this.quantumField.width) % this.quantumField.width;
            point.y = (point.y + this.quantumField.height) % this.quantumField.height;
        });
    }

    animate() {
        this.time += 0.016; // Assuming 60fps
        this.wavePhase += 0.02;
        
        // Update quantum field
        this.drawQuantumField();

        this.particles.forEach(particle => {
            const quantum = particle.quantumState;
            
            // Quantum wave function influence
            const waveFunction = Math.sin(this.time * quantum.energy + quantum.phase);
            const probabilityField = Math.cos(this.wavePhase) * quantum.probability;
            
            // Update particle position with quantum effects
            if (particle.superposition) {
                particle.x += particle.vx * (1 + waveFunction * 0.5);
                particle.y += particle.vy * (1 + probabilityField * 0.5);
            } else {
                particle.x += particle.vx;
                particle.y += particle.vy;
            }

            // Quantum tunneling effect
            if (particle.x <= 0 || particle.x >= 100) {
                if (Math.random() < 0.1) { // Tunneling probability
                    particle.x = particle.x <= 0 ? 100 : 0;
                } else {
                    particle.vx *= -1;
                }
            }
            if (particle.y <= 0 || particle.y >= 100) {
                if (Math.random() < 0.1) {
                    particle.y = particle.y <= 0 ? 100 : 0;
                } else {
                    particle.vy *= -1;
                }
            }

            // Quantum entanglement with mouse position
            const dx = (this.mouseX / window.innerWidth) * 100 - particle.x;
            const dy = (this.mouseY / window.innerHeight) * 100 - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                const entanglementStrength = (1 - distance / 30) * waveFunction;
                particle.vx += dx * 0.002 * entanglementStrength;
                particle.vy += dy * 0.002 * entanglementStrength;
                
                // Visual quantum state collapse
                particle.element.style.transform = `scale(${1 + Math.abs(entanglementStrength) * 0.3})`;
                particle.element.style.opacity = 0.8 + Math.abs(entanglementStrength) * 0.2;
            } else {
                particle.element.style.transform = 'scale(1)';
                particle.element.style.opacity = 0.5;
            }

            // Update particle position with wave function influence
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
        });

        requestAnimationFrame(() => this.animate());
    }

    initMagneticElements() {
        const elements = document.querySelectorAll('.magnetic-element');
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'magneticPull 1s ease-in-out infinite';
            });
            element.addEventListener('mouseleave', () => {
                element.style.animation = 'none';
            });
        });
    }
}

// Initialize the physics system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const physicsSystem = new PhysicsSystem();

    // Add wave effect to interactive elements
    const interactiveElements = document.querySelectorAll('button, .card, .project-item');
    interactiveElements.forEach(element => {
        element.classList.add('wave-effect');
    });

    // Initialize quantum buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('quantum-btn');
    });
});