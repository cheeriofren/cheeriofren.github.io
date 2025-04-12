// Material Modeling Visualization and Calculations

// Initialize the 3D crystal structure visualization
let crystal, scene, camera, renderer;

function initCrystalVisualization() {
    const container = document.getElementById('materialModel');
    if (!container) return;

    // Setup scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create crystal structure
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        specular: 0x444444
    });

    crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    // Add lattice structure
    createLatticeStructure();

    // Start animation
    animate();
}

// Create lattice structure
function createLatticeStructure() {
    const latticeGeometry = new THREE.BufferGeometry();
    const positions = [];
    const size = 2;

    // Create lattice points
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            for (let z = -size; z <= size; z++) {
                positions.push(x * 0.5, y * 0.5, z * 0.5);
            }
        }
    }

    latticeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const latticeMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.05
    });

    const latticePoints = new THREE.Points(latticeGeometry, latticeMaterial);
    scene.add(latticePoints);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    crystal.rotation.x += 0.01;
    crystal.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// Initialize band gap plot
function initBandGapPlot() {
    const bandGapData = {
        x: Array.from({length: 100}, (_, i) => i * 0.1),
        y: Array.from({length: 100}, (_, i) => Math.sin(i * 0.1) * Math.exp(-i * 0.05) + 1),
        type: 'scatter',
        mode: 'lines',
        line: {color: '#3498db'}
    };

    const layout = {
        title: 'Band Gap Energy vs. Temperature',
        xaxis: {title: 'Temperature (K)'},
        yaxis: {title: 'Band Gap (eV)'},
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: {color: '#333'}
    };

    Plotly.newPlot('bandGapPlot', [bandGapData], layout);
}

// Initialize density of states plot
function initDOSPlot() {
    const dosData = {
        x: Array.from({length: 100}, (_, i) => i * 0.1 - 5),
        y: Array.from({length: 100}, (_, i) => {
            const x = i * 0.1 - 5;
            return Math.exp(-x*x/2) / Math.sqrt(2 * Math.PI);
        }),
        type: 'scatter',
        mode: 'lines',
        line: {color: '#e74c3c'}
    };

    const layout = {
        title: 'Density of States',
        xaxis: {title: 'Energy (eV)'},
        yaxis: {title: 'DOS (states/eV)'},
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: {color: '#333'}
    };

    Plotly.newPlot('dosPlot', [dosData], layout);
}

// Event listeners for controls
function initControls() {
    const rotateButton = document.getElementById('rotateModel');
    const latticeButton = document.getElementById('showLattice');
    const bondsButton = document.getElementById('showBonds');

    if (rotateButton) {
        rotateButton.addEventListener('click', () => {
            crystal.rotation.y += Math.PI / 2;
        });
    }

    if (latticeButton) {
        latticeButton.addEventListener('click', () => {
            scene.traverse((object) => {
                if (object instanceof THREE.Points) {
                    object.visible = !object.visible;
                }
            });
        });
    }
}

// Handle window resize
function handleResize() {
    const container = document.getElementById('materialModel');
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initCrystalVisualization();
    initBandGapPlot();
    initDOSPlot();
    initControls();

    window.addEventListener('resize', handleResize);
});