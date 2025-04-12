// StressCare Visualization and Dashboard
let scene, camera, renderer;
let brainModel = { mesh: null };
let stressIndicators = [];
let bioMetrics = {
    heartRate: 75,
    stressLevel: 50,
    sleepQuality: 85
};

function initVisualization() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('stressModel');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create brain visualization
    createBrainModel();
    
    // Create stress indicators
    createStressIndicators();
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 5;

    animate();
}

function createBrainModel() {
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xe91e63,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    brainModel.mesh = new THREE.Mesh(geometry, material);
    scene.add(brainModel.mesh);

    // Add neural network visualization
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.02
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createStressIndicators() {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const colors = [0x4CAF50, 0xFFC107, 0xFF5722];

    for(let i = 0; i < 3; i++) {
        const material = new THREE.MeshPhongMaterial({ color: colors[i] });
        const indicator = new THREE.Mesh(geometry, material);
        indicator.position.set(Math.cos(i * Math.PI * 2/3) * 3, Math.sin(i * Math.PI * 2/3) * 3, 0);
        scene.add(indicator);
        stressIndicators.push(indicator);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate brain model
    brainModel.mesh.rotation.y += 0.005;
    
    // Pulse stress indicators
    stressIndicators.forEach((indicator, index) => {
        indicator.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + index) * 0.2);
    });
    
    // Update biometrics
    updateBiometrics();
    
    renderer.render(scene, camera);
}

function updateBiometrics() {
    bioMetrics.heartRate = 75 + Math.sin(Date.now() * 0.001) * 5;
    bioMetrics.stressLevel = 50 + Math.sin(Date.now() * 0.0005) * 20;
    bioMetrics.sleepQuality = 85 + Math.sin(Date.now() * 0.0003) * 10;

    updateBioMetricsDisplay();
}

function updateBioMetricsDisplay() {
    document.getElementById('heartRate').textContent = Math.round(bioMetrics.heartRate);
    document.getElementById('stressLevel').textContent = Math.round(bioMetrics.stressLevel);
    document.getElementById('sleepQuality').textContent = Math.round(bioMetrics.sleepQuality);
}

// Create Stress Level Timeline
function createStressTimeline() {
    const timeData = Array.from({length: 24}, (_, i) => i);
    const stressData = timeData.map(t => {
        const baseStress = 50;
        const workStress = 30 * Math.sin((t - 12) * Math.PI / 12);
        return baseStress + workStress + Math.random() * 10;
    });

    const trace = {
        x: timeData,
        y: stressData,
        mode: 'lines',
        name: 'Stress Level',
        line: { shape: 'spline', color: '#e91e63' }
    };

    const layout = {
        title: 'Daily Stress Level Pattern',
        xaxis: { title: 'Hour of Day' },
        yaxis: { title: 'Stress Level' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('stressTimeline', [trace], layout);
}

// Create Sleep Quality Chart
function createSleepChart() {
    const weekData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sleepData = weekData.map(() => 70 + Math.random() * 20);

    const trace = {
        x: weekData,
        y: sleepData,
        type: 'bar',
        marker: {
            color: '#2196F3'
        }
    };

    const layout = {
        title: 'Weekly Sleep Quality',
        xaxis: { title: 'Day of Week' },
        yaxis: { title: 'Sleep Quality (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('sleepChart', [trace], layout);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
    createStressTimeline();
    createSleepChart();

    // Add visualization controls
    document.getElementById('toggleBrain').addEventListener('click', () => {
        brainModel.mesh.material.wireframe = !brainModel.mesh.material.wireframe;
    });

    document.getElementById('toggleIndicators').addEventListener('click', () => {
        stressIndicators.forEach(indicator => {
            indicator.visible = !indicator.visible;
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('stressModel');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});