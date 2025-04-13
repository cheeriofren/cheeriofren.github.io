// Quantum Effects System for 3D Space-time Visualization
class QuantumEffects {
    constructor() {
        this.particles = [];
        this.waveFunction = null;
        this.spaceTimeGrid = null;
        this.quantumStates = new Map();
        this.init();
    }

    init() {
        this.initThreeJS();
        this.createSpaceTimeGrid();
        this.createQuantumParticles();
        this.setupWaveFunction();
        this.animate();
    }

    initThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 50;
        
        // Add ambient and directional light
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    createSpaceTimeGrid() {
        const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // Create curved space-time visualization
        const geometry = new THREE.ParametricGeometry((u, v, target) => {
            const x = u * 100 - 50;
            const z = v * 100 - 50;
            const y = Math.sin(Math.sqrt(x * x + z * z) * 0.05) * 5;
            target.set(x, y, z);
        }, 50, 50);

        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        this.spaceTimeGrid = new THREE.Mesh(geometry, material);
        this.scene.add(this.spaceTimeGrid);
    }

    createQuantumParticles() {
        const particleCount = 100;
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        
        for (let i = 0; i < particleCount; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
                transparent: true,
                opacity: 0.7
            });

            const particle = new THREE.Mesh(geometry, material);
            
            // Random position in a sphere
            const radius = Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );

            this.particles.push(particle);
            this.scene.add(particle);
        }
    }

    setupWaveFunction() {
        const points = [];
        const segmentCount = 100;
        
        for (let i = 0; i <= segmentCount; i++) {
            const t = (i / segmentCount) * Math.PI * 4;
            points.push(new THREE.Vector3(
                t * Math.cos(t) * 0.5,
                Math.sin(t * 2) * 2,
                t * Math.sin(t) * 0.5
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5
        });

        this.waveFunction = new THREE.Line(geometry, material);
        this.scene.add(this.waveFunction);
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position based on velocity
            particle.position.add(particle.userData.velocity);
            
            // Apply quantum tunneling effect
            if (Math.random() < 0.01) {
                particle.position.multiplyScalar(-0.8);
            }
            
            // Contain particles within bounds
            if (particle.position.length() > 40) {
                particle.position.normalize().multiplyScalar(40);
                particle.userData.velocity.multiplyScalar(-1);
            }
            
            // Update particle color based on position
            const hue = (particle.position.y + 40) / 80;
            particle.material.color.setHSL(hue, 0.7, 0.5);
        });
    }

    updateWaveFunction() {
        const time = Date.now() * 0.001;
        const positions = this.waveFunction.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const t = (i / positions.length) * Math.PI * 4;
            positions[i] = t * Math.cos(t + time) * 0.5;
            positions[i + 1] = Math.sin(t * 2 + time) * 2;
            positions[i + 2] = t * Math.sin(t + time) * 0.5;
        }
        
        this.waveFunction.geometry.attributes.position.needsUpdate = true;
    }

    updateSpaceTimeGrid() {
        const time = Date.now() * 0.0005;
        const positions = this.spaceTimeGrid.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            positions[i + 1] = Math.sin(Math.sqrt(x * x + z * z) * 0.05 + time) * 5;
        }
        
        this.spaceTimeGrid.geometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateParticles();
        this.updateWaveFunction();
        this.updateSpaceTimeGrid();
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // Handle window resize
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize quantum effects when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const quantumEffects = new QuantumEffects();
    
    // Handle window resize
    window.addEventListener('resize', () => quantumEffects.onWindowResize());
});