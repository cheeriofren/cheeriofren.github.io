// Initialize Three.js scene for material modeling
function initMaterialModel() {
    const container = document.getElementById('materialModel');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a crystalline structure
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });

    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        crystal.rotation.x += 0.01;
        crystal.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// Initialize energy visualization
function initEnergyVisualization() {
    const canvas = document.querySelector('.visualization-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Create energy flow visualization
    function drawEnergyFlow() {
        ctx.clearRect(0, 0, width, height);

        // Draw flowing particles
        const time = Date.now() * 0.001;
        for (let i = 0; i < 50; i++) {
            const x = Math.sin(time + i) * width/4 + width/2;
            const y = Math.cos(time + i) * height/4 + height/2;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${time * 50 + i * 10}, 70%, 50%)`;
            ctx.fill();
        }

        requestAnimationFrame(drawEnergyFlow);
    }

    drawEnergyFlow();
}

// Initialize climate simulation
function initClimateSimulation() {
    const container = document.querySelector('.simulation-container');
    if (!container) return;

    // Create particle system for climate visualization
    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * container.clientWidth,
            y: Math.random() * container.clientHeight,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
        });
    }

    function animateParticles() {
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    animateParticles();
}

// Initialize all visualizations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initMaterialModel();
    initEnergyVisualization();
    initClimateSimulation();

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});