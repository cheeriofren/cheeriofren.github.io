 // Three.js Crystal Structure Visualization
let scene, camera, renderer;
let crystalStructure = { atoms: [], bonds: [] };
let quantumEffects;
let isQuantumEnabled = false;

function initVisualization() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('perovskiteModel');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create perovskite structure
    createPerovskiteStructure();
    
    // Initialize quantum effects
    quantumEffects = new QuantumEffects(scene, crystalStructure);
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 5;

    animate();
}

function createPerovskiteStructure() {
    // Create corner atoms (B-site)
    const cornerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const cornerMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });

    // Create face-centered atoms (X-site)
    const faceGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const faceMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    // Create center atom (A-site)
    const centerGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // Add atoms to structure
    const positions = [
        [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]
    ];

    positions.forEach(pos => {
        const atom = new THREE.Mesh(cornerGeometry, cornerMaterial);
        atom.position.set(pos[0], pos[1], pos[2]);
        scene.add(atom);
        crystalStructure.atoms.push(atom);
    });

    // Add center atom
    const centerAtom = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(centerAtom);
    crystalStructure.atoms.push(centerAtom);

    // Add bonds
    createBonds();
}

function createBonds() {
    const material = new THREE.LineBasicMaterial({ color: 0x888888 });

    for (let i = 0; i < crystalStructure.atoms.length - 1; i++) {
        for (let j = i + 1; j < crystalStructure.atoms.length; j++) {
            const points = [];
            points.push(crystalStructure.atoms[i].position);
            points.push(crystalStructure.atoms[j].position);

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            crystalStructure.bonds.push(line);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update crystal structure
    crystalStructure.atoms.forEach(atom => {
        atom.rotation.x += 0.01;
        atom.rotation.y += 0.01;
    });
    
    // Update quantum effects if enabled
    if (isQuantumEnabled && quantumEffects) {
        quantumEffects.update();
    }
    
    renderer.render(scene, camera);
}

// Create Efficiency Plot
function createEfficiencyPlot() {
    const timeData = Array.from({length: 20}, (_, i) => i);
    const efficiencyData = timeData.map(t => 15 + 5 * Math.sin(t/10) + Math.random());

    const trace = {
        x: timeData,
        y: efficiencyData,
        mode: 'lines+markers',
        name: 'Device Efficiency',
        line: { shape: 'spline' }
    };

    const layout = {
        title: 'Device Efficiency Over Time',
        xaxis: { title: 'Time (hours)' },
        yaxis: { title: 'Efficiency (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('efficiencyPlot', [trace], layout);
}

// Create Stability Plot
function createStabilityPlot() {
    const timeData = Array.from({length: 30}, (_, i) => i * 24);
    const stabilityData = timeData.map(t => 100 * Math.exp(-t/500));

    const trace = {
        x: timeData,
        y: stabilityData,
        mode: 'lines',
        name: 'Device Stability',
        line: { shape: 'spline' }
    };

    const layout = {
        title: 'Stability Analysis',
        xaxis: { title: 'Time (hours)' },
        yaxis: { title: 'Normalized Performance (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('stabilityPlot', [trace], layout);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
    createEfficiencyPlot();
    createStabilityPlot();

    // Add button event listeners
    document.getElementById('showDefects').addEventListener('click', () => {
        crystalStructure.atoms.forEach(atom => {
            atom.material.wireframe = !atom.material.wireframe;
        });
    });

    document.getElementById('rotateStructure').addEventListener('click', () => {
        crystalStructure.atoms.forEach(atom => {
            atom.rotation.x += Math.PI / 4;
            atom.rotation.y += Math.PI / 4;
        });
    });

    document.getElementById('showBonds').addEventListener('click', () => {
        crystalStructure.bonds.forEach(bond => {
            bond.visible = !bond.visible;
        });
    });
    
    document.getElementById('toggleQuantum').addEventListener('click', () => {
        isQuantumEnabled = !isQuantumEnabled;
        if (isQuantumEnabled) {
            quantumEffects.electronClouds.forEach(cloud => cloud.visible = true);
        } else {
            quantumEffects.electronClouds.forEach(cloud => cloud.visible = false);
        }
    });
    
    document.getElementById('showElectronCloud').addEventListener('click', () => {
        if (quantumEffects) {
            quantumEffects.electronClouds.forEach(cloud => {
                cloud.visible = !cloud.visible;
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('perovskiteModel');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});