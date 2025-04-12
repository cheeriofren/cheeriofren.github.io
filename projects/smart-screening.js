// Three.js Material Visualization
let scene, camera, renderer, material;

function initMaterialVisualization() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    const container = document.getElementById('materialScreening');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create material lattice visualization
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Property Distribution Plot
function createPropertyPlot() {
    const bandgapData = {
        x: Array.from({length: 50}, (_, i) => i/10),
        y: Array.from({length: 50}, () => Math.random()),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Bandgap Distribution'
    };

    const layout = {
        title: 'Material Property Distribution',
        xaxis: { title: 'Bandgap (eV)' },
        yaxis: { title: 'Frequency' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('propertyPlot', [bandgapData], layout);
}

// Sustainability Metrics Plot
function createSustainabilityPlot() {
    const data = [{
        type: 'scatterpolar',
        r: [8, 7, 9, 6, 5, 8],
        theta: ['Abundance', 'Cost', 'Toxicity', 'Stability', 'Efficiency', 'Recyclability'],
        fill: 'toself'
    }];

    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 10]
            }
        },
        showlegend: false,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('sustainabilityPlot', data, layout);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initMaterialVisualization();
    createPropertyPlot();
    createSustainabilityPlot();

    // Add button event listeners
    document.getElementById('toggleView').addEventListener('click', () => {
        material.wireframe = !material.wireframe;
    });

    document.getElementById('showProperties').addEventListener('click', () => {
        createPropertyPlot();
        createSustainabilityPlot();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('materialScreening');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});