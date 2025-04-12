// Conference Database Simulation
let conferences = [];

// Initialize sample conference data
function initializeConferences() {
    conferences = [
        {
            title: 'Global Renewable Energy Summit',
            date: '2024-06-15',
            duration: 3,
            location: 'London, UK',
            audience: ['academic', 'industry', 'investor'],
            price: 1200,
            attendees: 500,
            topics: ['solar', 'wind', 'storage']
        },
        {
            title: 'Climate Innovation Forum',
            date: '2024-07-20',
            duration: 2,
            location: 'Berlin, Germany',
            audience: ['entrepreneur', 'investor'],
            price: 800,
            attendees: 300,
            topics: ['climate-tech', 'sustainability']
        },
        // Add more sample conferences
    ];
}

// Filter Functionality
function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const audience = Array.from(document.getElementById('audience').selectedOptions).map(option => option.value);
    const location = document.getElementById('location').value.toLowerCase();
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);

    const filteredConferences = conferences.filter(conf => {
        const dateMatch = (!startDate || conf.date >= startDate) && (!endDate || conf.date <= endDate);
        const audienceMatch = audience.length === 0 || audience.some(a => conf.audience.includes(a));
        const locationMatch = !location || conf.location.toLowerCase().includes(location);
        const priceMatch = conf.price >= minPrice && conf.price <= maxPrice;

        return dateMatch && audienceMatch && locationMatch && priceMatch;
    });

    displayResults(filteredConferences);
}

// Display Conference Results
function displayResults(results) {
    const container = document.getElementById('conferenceResults');
    container.innerHTML = '';

    results.forEach(conf => {
        const card = document.createElement('div');
        card.className = 'conference-card';
        card.innerHTML = `
            <h3>${conf.title}</h3>
            <p><i class="fas fa-calendar"></i> ${conf.date}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${conf.location}</p>
            <p><i class="fas fa-users"></i> ${conf.attendees} attendees</p>
            <p><i class="fas fa-tag"></i> $${conf.price}</p>
            <div class="topics">
                ${conf.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });
}

// Create Global Distribution Map
function createGlobalMap() {
    const width = document.getElementById('globalMap').clientWidth;
    const height = 400;

    const svg = d3.select('#globalMap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add world map visualization using D3.js
    // This is a simplified version - implement full map visualization as needed
}

// Create Topic Distribution Chart
function createTopicChart() {
    const topics = conferences.reduce((acc, conf) => {
        conf.topics.forEach(topic => {
            acc[topic] = (acc[topic] || 0) + 1;
        });
        return acc;
    }, {});

    const data = [{
        values: Object.values(topics),
        labels: Object.keys(topics),
        type: 'pie'
    }];

    const layout = {
        height: 400,
        showlegend: true,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot('topicChart', data, layout);
}

// Conference Matchmaking Algorithm
function findMatches(profile) {
    const matches = conferences.map(conf => {
        let score = 0;
        
        // Role matching
        if (conf.audience.includes(profile.role)) score += 2;
        
        // Interest matching
        const interests = profile.interests.toLowerCase().split(',').map(i => i.trim());
        const interestMatch = conf.topics.filter(topic =>
            interests.some(interest => topic.includes(interest)));
        score += interestMatch.length;

        return { conference: conf, score };
    });

    return matches
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeConferences();
    
    // Initialize filters
    document.querySelectorAll('.search-filters input, .search-filters select')
        .forEach(element => element.addEventListener('change', applyFilters));

    // Initialize visualizations
    createGlobalMap();
    createTopicChart();

    // Handle profile form submission
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const profile = {
            role: document.getElementById('role').value,
            interests: document.getElementById('interests').value,
            goals: document.getElementById('goals').value
        };

        const matches = findMatches(profile);
        displayMatches(matches);
    });

    // Initial display
    applyFilters();
});

// Display Matchmaking Results
function displayMatches(matches) {
    const container = document.getElementById('matchResults');
    container.innerHTML = '<h3>Recommended Conferences</h3>';

    matches.forEach(match => {
        const conf = match.conference;
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <h4>${conf.title}</h4>
            <p>Match Score: ${match.score}</p>
            <p>${conf.location} | ${conf.date}</p>
            <div class="match-topics">
                ${conf.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
        `;
        container.appendChild(matchCard);
    });
}