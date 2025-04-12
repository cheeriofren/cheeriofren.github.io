// Pumped Hydro Energy Storage Visualization
let scene, camera, renderer;
let terrain = { mesh: null, heightData: [] };
let waterSystem = { reservoirs: [], pipelines: [] };
let animationSpeed = 1.0;

function initVisualization() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('hydroModel');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create terrain
    createTerrain();
    
    // Create water system
    createWaterSystem();
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    animate();
}

function createTerrain() {
    const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3d5a3d,
        wireframe: false,
        side: THREE.DoubleSide
    });

    // Generate height data
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        const height = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
        vertices[i + 1] = height;
        terrain.heightData.push(height);
    }

    terrain.mesh = new THREE.Mesh(geometry, material);
    terrain.mesh.rotation.x = -Math.PI / 2;
    scene.add(terrain.mesh);
}

function createWaterSystem() {
    // Create upper reservoir
    const upperGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077be,
        transparent: true,
        opacity: 0.8
    });
    const upperReservoir = new THREE.Mesh(upperGeometry, waterMaterial);
    upperReservoir.position.set(2, 2, 2);
    scene.add(upperReservoir);
    waterSystem.reservoirs.push(upperReservoir);

    // Create lower reservoir
    const lowerGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const lowerReservoir = new THREE.Mesh(lowerGeometry, waterMaterial);
    lowerReservoir.position.set(-2, -1, -2);
    scene.add(lowerReservoir);
    waterSystem.reservoirs.push(lowerReservoir);

    // Create pipeline
    const pipelinePoints = [
        upperReservoir.position,
        new THREE.Vector3(0, 0, 0),
        lowerReservoir.position
    ];

    const curve = new THREE.CatmullRomCurve3(pipelinePoints);
    const pipeGeometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
    const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const pipeline = new THREE.Mesh(pipeGeometry, pipeMaterial);
    scene.add(pipeline);
    waterSystem.pipelines.push(pipeline);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate water flow
    waterSystem.reservoirs.forEach(reservoir => {
        reservoir.scale.y = 0.8 + Math.sin(Date.now() * 0.001 * animationSpeed) * 0.2;
    });
    
    renderer.render(scene, camera);
}

// Create Energy Production Plot
function createEnergyPlot() {
    const timeData = Array.from({length: 24}, (_, i) => i);
    const energyData = timeData.map(t => {
        const baseLoad = 50;
        const peakDemand = 30 * Math.sin((t - 12) * Math.PI / 12);
        return baseLoad + peakDemand + Math.random() * 5;
    });

    const trace = {
        x: timeData,
        y: energyData,
        mode: 'lines',
        name: 'Energy Production',
        line: { shape: 'spline', color: '#2ecc71' }
    };

    const layout = {
        title: 'Daily Energy Production Profile',
        xaxis: { title: 'Hour of Day' },
        yaxis: { title: 'Energy Output (MW)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('energyPlot', [trace], layout);
}

// Create Water Level Plot
function createWaterLevelPlot() {
    const timeData = Array.from({length: 24}, (_, i) => i);
    const upperLevelData = timeData.map(t => {
        const baseLevel = 80;
        return baseLevel - 20 * Math.sin((t - 12) * Math.PI / 12) + Math.random() * 2;
    });

    const lowerLevelData = timeData.map(t => {
        const baseLevel = 20;
        return baseLevel + 20 * Math.sin((t - 12) * Math.PI / 12) + Math.random() * 2;
    });

    const trace1 = {
        x: timeData,
        y: upperLevelData,
        mode: 'lines',
        name: 'Upper Reservoir',
        line: { shape: 'spline', color: '#3498db' }
    };

    const trace2 = {
        x: timeData,
        y: lowerLevelData,
        mode: 'lines',
        name: 'Lower Reservoir',
        line: { shape: 'spline', color: '#e74c3c' }
    };

    const layout = {
        title: 'Reservoir Water Levels',
        xaxis: { title: 'Hour of Day' },
        yaxis: { title: 'Water Level (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('waterLevelPlot', [trace1, trace2], layout);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
    createEnergyPlot();
    createWaterLevelPlot();

    // Add control buttons event listeners
    document.getElementById('toggleTerrain').addEventListener('click', () => {
        terrain.mesh.material.wireframe = !terrain.mesh.material.wireframe;
    });

    document.getElementById('toggleFlow').addEventListener('click', () => {
        animationSpeed = animationSpeed === 1.0 ? 0.0 : 1.0;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('hydroModel');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});