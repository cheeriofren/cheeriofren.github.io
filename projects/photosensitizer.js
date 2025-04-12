// Natural Photosensitizer Visualization
let scene, camera, renderer;
let molecule = { atoms: [], bonds: [] };
let electronFlow = [];
let isElectronFlowEnabled = false;

function initVisualization() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = document.getElementById('moleculeModel');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create molecule structure
    createMoleculeStructure();
    
    // Create electron flow visualization
    createElectronFlow();
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 15;

    animate();
}

function createMoleculeStructure() {
    // Define atom positions for Caesalpinia sappan structure
    const atomPositions = [
        { pos: [0, 0, 0], type: 'C' },
        { pos: [1.2, 0.8, 0], type: 'C' },
        { pos: [-1.2, 0.8, 0], type: 'C' },
        { pos: [0, -1.6, 0], type: 'O' },
        { pos: [2.4, 0, 0], type: 'O' },
        { pos: [-2.4, 0, 0], type: 'O' }
    ];

    // Create atoms
    atomPositions.forEach(atom => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: atom.type === 'O' ? 0xff0000 : 0x444444
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...atom.pos);
        scene.add(mesh);
        molecule.atoms.push(mesh);
    });

    // Create bonds
    for(let i = 0; i < atomPositions.length - 1; i++) {
        for(let j = i + 1; j < atomPositions.length; j++) {
            const distance = Math.sqrt(
                Math.pow(atomPositions[i].pos[0] - atomPositions[j].pos[0], 2) +
                Math.pow(atomPositions[i].pos[1] - atomPositions[j].pos[1], 2) +
                Math.pow(atomPositions[i].pos[2] - atomPositions[j].pos[2], 2)
            );

            if(distance < 2) {
                const points = [];
                points.push(new THREE.Vector3(...atomPositions[i].pos));
                points.push(new THREE.Vector3(...atomPositions[j].pos));

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ color: 0x888888 });
                const bond = new THREE.Line(geometry, material);
                scene.add(bond);
                molecule.bonds.push(bond);
            }
        }
    }
}

function createElectronFlow() {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    electronFlow.push(particles);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate molecule
    molecule.atoms.forEach(atom => {
        atom.rotation.y += 0.01;
    });
    
    // Animate electron flow
    if(isElectronFlowEnabled) {
        electronFlow.forEach(particles => {
            const positions = particles.geometry.attributes.position.array;
            for(let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.02;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    renderer.render(scene, camera);
}

// Create Absorption Spectrum Plot
function createAbsorptionPlot() {
    const wavelengthData = Array.from({length: 50}, (_, i) => 400 + i * 10);
    const absorptionData = wavelengthData.map(w => {
        const peak1 = Math.exp(-Math.pow((w - 550) / 50, 2));
        const peak2 = 0.7 * Math.exp(-Math.pow((w - 650) / 30, 2));
        return peak1 + peak2;
    });

    const trace = {
        x: wavelengthData,
        y: absorptionData,
        mode: 'lines',
        name: 'Absorption Spectrum',
        line: { shape: 'spline', color: '#9c27b0' }
    };

    const layout = {
        title: 'Absorption Spectrum of Caesalpinia sappan',
        xaxis: { title: 'Wavelength (nm)' },
        yaxis: { title: 'Absorption (a.u.)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('absorptionPlot', [trace], layout);
}

// Create Efficiency Plot
function createEfficiencyPlot() {
    const concentrationData = Array.from({length: 20}, (_, i) => i * 0.5);
    const efficiencyData = concentrationData.map(c => {
        const maxEff = 8;
        return maxEff * (1 - Math.exp(-c/2)) * Math.exp(-c/10);
    });

    const trace = {
        x: concentrationData,
        y: efficiencyData,
        mode: 'lines+markers',
        name: 'DSSC Efficiency',
        line: { shape: 'spline', color: '#ff9800' }
    };

    const layout = {
        title: 'DSSC Efficiency vs Dye Concentration',
        xaxis: { title: 'Dye Concentration (mg/mL)' },
        yaxis: { title: 'Efficiency (%)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('efficiencyPlot', [trace], layout);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
    createAbsorptionPlot();
    createEfficiencyPlot();

    // Add visualization controls
    document.getElementById('toggleMolecule').addEventListener('click', () => {
        molecule.atoms.forEach(atom => {
            atom.material.wireframe = !atom.material.wireframe;
        });
    });

    document.getElementById('toggleElectrons').addEventListener('click', () => {
        isElectronFlowEnabled = !isElectronFlowEnabled;
        electronFlow.forEach(particles => {
            particles.visible = isElectronFlowEnabled;
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('moleculeModel');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});