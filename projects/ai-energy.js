// AI Energy Solutions Visualization

// Initialize canvas and context
const canvas = document.querySelector('.visualization-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;
}

// Initial resize
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Generate sample energy consumption data
function generateData(points = 100) {
    const data = [];
    for (let i = 0; i < points; i++) {
        const baseValue = Math.sin(i * 0.1) * 50 + 100;
        const noise = Math.random() * 20 - 10;
        data.push(baseValue + noise);
    }
    return data;
}

// Animation state
let animationFrame;
let showPrediction = false;
let showPatterns = false;

// Colors
const colors = {
    actual: '#3498db',
    predicted: '#2ecc71',
    pattern: 'rgba(231, 76, 60, 0.3)'
};

// Draw energy consumption graph
function drawGraph(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw actual consumption
    ctx.beginPath();
    ctx.strokeStyle = colors.actual;
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = (index / data.length) * canvas.width;
        const y = canvas.height - (value / 200) * canvas.height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();

    // Draw prediction if enabled
    if (showPrediction) {
        const prediction = data.map(v => v * 0.9 + Math.random() * 10);
        
        ctx.beginPath();
        ctx.strokeStyle = colors.predicted;
        ctx.setLineDash([5, 5]);
        
        prediction.forEach((value, index) => {
            const x = (index / prediction.length) * canvas.width;
            const y = canvas.height - (value / 200) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw patterns if enabled
    if (showPatterns) {
        const patterns = [
            { start: 20, end: 30, label: 'Peak' },
            { start: 50, end: 60, label: 'Valley' }
        ];

        patterns.forEach(pattern => {
            const startX = (pattern.start / data.length) * canvas.width;
            const endX = (pattern.end / data.length) * canvas.width;
            
            ctx.fillStyle = colors.pattern;
            ctx.fillRect(startX, 0, endX - startX, canvas.height);
            
            ctx.fillStyle = '#e74c3c';
            ctx.font = '14px Inter';
            ctx.fillText(pattern.label, startX + 5, 20);
        });
    }
}

// Animation loop
function animate() {
    const data = generateData();
    drawGraph(data);
    animationFrame = requestAnimationFrame(animate);
}

// Initialize controls
document.getElementById('togglePrediction').addEventListener('click', () => {
    showPrediction = !showPrediction;
});

document.getElementById('showPatterns').addEventListener('click', () => {
    showPatterns = !showPatterns;
});

// Initialize metrics display
function updateMetrics() {
    const efficiencyMetric = document.getElementById('efficiencyMetric');
    const savingsMetric = document.getElementById('savingsMetric');

    if (efficiencyMetric) {
        efficiencyMetric.innerHTML = `
            <div class="metric-value">20%</div>
            <div class="metric-label">Efficiency Increase</div>
        `;
    }

    if (savingsMetric) {
        savingsMetric.innerHTML = `
            <div class="metric-value">$1.2M</div>
            <div class="metric-label">Annual Savings</div>
        `;
    }
}

// Start visualization
document.addEventListener('DOMContentLoaded', () => {
    animate();
    updateMetrics();
});