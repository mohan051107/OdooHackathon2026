document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenue = [18500, 22000, 19500, 28000, 26000, 31000, 29000, 34000, 32000, 38000, 36500, 42500];
        const expenses = [12000, 14000, 13500, 18000, 17000, 21000, 19500, 23000, 21500, 26000, 24500, 28500];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenue,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#2563eb'
                    },
                    {
                        label: 'Expenses',
                        data: expenses,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#ef4444'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { callback: v => '$' + v.toLocaleString() }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function initStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const trips = data.trips;
        const statusCounts = {
            'in-progress': trips.filter(t => t.status === 'in-progress').length,
            'completed': trips.filter(t => t.status === 'completed').length,
            'delayed': trips.filter(t => t.status === 'delayed').length,
            'scheduled': trips.filter(t => t.status === 'scheduled').length
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['In Progress', 'Completed', 'Delayed', 'Scheduled'],
                datasets: [{
                    data: [statusCounts['in-progress'], statusCounts['completed'], statusCounts['delayed'], statusCounts['scheduled']],
                    backgroundColor: ['#2563eb', '#22c55e', '#ef4444', '#eab308'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { usePointStyle: true, padding: 15, font: { size: 13 } }
                    }
                },
                cutout: '65%'
            }
        });
    }

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        initRevenueChart();
        initStatusChart();

        console.log('📊 Analytics page initialized!');
    }

    init();
});