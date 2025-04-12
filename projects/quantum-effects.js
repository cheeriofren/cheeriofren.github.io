// Quantum Mechanics and Advanced Particle Interactions for Perovskite Visualization
class QuantumEffects {
    constructor(scene, crystalStructure) {
        this.scene = scene;
        this.crystalStructure = crystalStructure;
        this.electronClouds = [];
        this.defects = [];
        this.time = 0;
        this.waveFunction = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                amplitude: { value: 0.5 },
                frequency: { value: 2.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float amplitude;
                uniform float frequency;
                varying vec2 vUv;
                
                void main() {
                    float wave = amplitude * sin(frequency * vUv.x * 3.14159 + time);
                    float probability = pow(wave, 2.0);
                    gl_FragColor = vec4(0.5, 0.8, 1.0, probability * 0.5);
                }
            `,
            transparent: true
        });
        
        this.init();
    }

    init() {
        this.createElectronClouds();
        this.createDefects();
        this.setupInteractions();
    }

    createElectronClouds() {
        this.crystalStructure.atoms.forEach(atom => {
            const cloudGeometry = new THREE.SphereGeometry(0.4, 32, 32);
            const cloud = new THREE.Mesh(cloudGeometry, this.waveFunction.clone());
            cloud.scale.set(1.5, 1.5, 1.5);
            cloud.position.copy(atom.position);
            this.scene.add(cloud);
            this.electronClouds.push(cloud);
        });
    }

    createDefects() {
        // Create vacancy defects
        const defectGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const defectMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });

        for (let i = 0; i < 3; i++) {
            const defect = new THREE.Mesh(defectGeometry, defectMaterial);
            const randomAtom = this.crystalStructure.atoms[Math.floor(Math.random() * this.crystalStructure.atoms.length)];
            defect.position.copy(randomAtom.position);
            defect.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ));
            this.scene.add(defect);
            this.defects.push(defect);
        }
    }

    setupInteractions() {
        // Add electron-electron repulsion
        this.electronClouds.forEach((cloud1, i) => {
            this.electronClouds.slice(i + 1).forEach(cloud2 => {
                const distance = cloud1.position.distanceTo(cloud2.position);
                if (distance < 1.0) {
                    const repulsion = 0.1 / (distance * distance);
                    const direction = cloud1.position.clone().sub(cloud2.position).normalize();
                    cloud1.position.add(direction.multiplyScalar(repulsion));
                    cloud2.position.sub(direction.multiplyScalar(repulsion));
                }
            });
        });
    }

    update() {
        this.time += 0.016;

        // Update wave function
        this.electronClouds.forEach(cloud => {
            cloud.material.uniforms.time.value = this.time;
            cloud.rotation.y += 0.01;
            cloud.rotation.z += 0.005;
        });

        // Update defects
        this.defects.forEach(defect => {
            defect.position.add(new THREE.Vector3(
                Math.sin(this.time + defect.position.x) * 0.002,
                Math.cos(this.time + defect.position.y) * 0.002,
                Math.sin(this.time * 0.5) * 0.002
            ));
        });

        // Update electron-defect interactions
        this.electronClouds.forEach(cloud => {
            this.defects.forEach(defect => {
                const distance = cloud.position.distanceTo(defect.position);
                if (distance < 1.0) {
                    cloud.material.uniforms.amplitude.value = 0.8 - distance * 0.3;
                    cloud.material.uniforms.frequency.value = 3.0 + distance;
                }
            });
        });
    }
}

// Export for use in perovskite-research.js
window.QuantumEffects = QuantumEffects;