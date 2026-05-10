// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Chart.js configuration
const chartConfig = {
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 12,
                    weight: 600
                },
                padding: 20,
                usePointStyle: true
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};

// Time Analysis Chart
const timeChartCtx = document.getElementById('timeChart');
if (timeChartCtx) {
    new Chart(timeChartCtx, {
        type: 'bar',
        data: {
            labels: ['SE 2021', 'GW 2021', 'SE 2024', 'GW 2024'],
            datasets: [
                {
                    label: '자유 실행 RMSE',
                    data: [1.1393, 1.7813, 0.9916, 1.9563],
                    backgroundColor: 'rgba(238, 90, 111, 0.8)',
                    borderColor: 'rgba(238, 90, 111, 1)',
                    borderWidth: 2,
                    borderRadius: 5
                },
                {
                    label: '분석 RMSE',
                    data: [0.9660, 1.5281, 0.8351, 1.6665],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 5
                }
            ]
        },
        options: {
            ...chartConfig,
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'RMSE 비교: 자유 실행 vs 분석',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    });
}

// Spatial Analysis Chart
const spatialChartCtx = document.getElementById('spatialChart');
if (spatialChartCtx) {
    new Chart(spatialChartCtx, {
        type: 'radar',
        data: {
            labels: ['배경 RMSE', '분석 RMSE', 'RMSE 감소', '개선율', '평균 증분'],
            datasets: [
                {
                    label: 'SE 2024',
                    data: [0.9939, 0.7560, 0.2378, 23.93, 0.376],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'GW 2024',
                    data: [1.9557, 1.4927, 0.4630, 23.67, 0.843],
                    borderColor: 'rgba(240, 147, 251, 1)',
                    backgroundColor: 'rgba(240, 147, 251, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(240, 147, 251, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            ...chartConfig,
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: '공간 분석 비교: SE vs GW',
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Comparison Chart (Interactive)
let currentMetric = 'rmse';
const comparisonChartCtx = document.getElementById('comparisonChart');
let comparisonChart = null;

const metricsData = {
    rmse: {
        labels: ['SE 2024', 'GW 2024'],
        datasets: [
            {
                label: '배경 RMSE',
                data: [0.9939, 1.9557],
                backgroundColor: 'rgba(238, 90, 111, 0.8)',
                borderColor: 'rgba(238, 90, 111, 1)',
                borderWidth: 2
            },
            {
                label: '분석 RMSE',
                data: [0.7560, 1.4927],
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }
        ],
        title: 'RMSE 비교'
    },
    improvement: {
        labels: ['SE 2024', 'GW 2024'],
        datasets: [
            {
                label: '개선율 (%)',
                data: [23.93, 23.67],
                backgroundColor: 'rgba(29, 209, 161, 0.8)',
                borderColor: 'rgba(29, 209, 161, 1)',
                borderWidth: 2
            }
        ],
        title: '개선율 비교'
    },
    increment: {
        labels: ['SE 2024', 'GW 2024'],
        datasets: [
            {
                label: '평균 증분',
                data: [-0.219, 0.692],
                backgroundColor: ['rgba(9, 132, 227, 0.8)', 'rgba(240, 147, 251, 0.8)'],
                borderColor: ['rgba(9, 132, 227, 1)', 'rgba(240, 147, 251, 1)'],
                borderWidth: 2
            },
            {
                label: '평균 절대 증분',
                data: [0.376, 0.843],
                backgroundColor: ['rgba(102, 126, 234, 0.5)', 'rgba(240, 147, 251, 0.5)'],
                borderColor: ['rgba(102, 126, 234, 1)', 'rgba(240, 147, 251, 1)'],
                borderWidth: 2,
                borderDash: [5, 5]
            }
        ],
        title: '증분 비교'
    }
};

function updateComparisonChart() {
    const data = metricsData[currentMetric];
    
    if (comparisonChart) {
        comparisonChart.data = {
            labels: data.labels,
            datasets: data.datasets
        };
        comparisonChart.options.plugins.title.text = data.title;
        comparisonChart.update();
    } else if (comparisonChartCtx) {
        comparisonChart = new Chart(comparisonChartCtx, {
            type: currentMetric === 'improvement' ? 'doughnut' : 'bar',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                ...chartConfig,
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: currentMetric === 'improvement' ? undefined : 'y',
                plugins: {
                    ...chartConfig.plugins,
                    title: {
                        display: true,
                        text: data.title,
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
}

// Initialize comparison chart
if (comparisonChartCtx) {
    updateComparisonChart();
}

// Handle metric button clicks
document.querySelectorAll('.comp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.comp-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentMetric = this.dataset.metric;
        updateComparisonChart();
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.2)';
    }
});

// Animate numbers when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            if (element.classList.contains('data-table')) {
                // Table is visible, could add animation here
            }
            observer.unobserve(element);
        }
    });
}, observerOptions);

document.querySelectorAll('.data-table').forEach(table => {
    observer.observe(table);
});

// Responsive navbar collapse on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Console message
console.log('%c🌡️ Heatwave Prediction through Data Assimilation', 
    'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('%cResearch Project - Data Assimilation Team', 
    'font-size: 12px; color: #764ba2;');
