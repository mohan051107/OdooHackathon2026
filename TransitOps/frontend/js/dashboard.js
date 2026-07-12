document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const dataStore = {
        kpis: {
            activeTrips: 24,
            totalVehicles: 42,
            activeDrivers: 28,
            ontimePerformance: 94,
            maintenanceAlerts: 3,
            fuelEfficiency: 8.7
        },
        trips: [
            { id: 'TR-1024', driver: 'Elena Martinez', vehicle: 'V-842', status: 'in-progress' },
            { id: 'TR-1023', driver: 'James Kowalski', vehicle: 'V-119', status: 'completed' },
            { id: 'TR-1022', driver: 'Sophia Rodriguez', vehicle: 'V-307', status: 'delayed' },
            { id: 'TR-1021', driver: 'Liam O\'Brien', vehicle: 'V-562', status: 'completed' },
            { id: 'TR-1020', driver: 'Olivia Park', vehicle: 'V-903', status: 'in-progress' },
            { id: 'TR-1019', driver: 'Noah Chen', vehicle: 'V-210', status: 'scheduled' }
        ],
        drivers: [
            { name: 'Elena Martinez', vehicle: 'V-842', status: 'on-trip' },
            { name: 'James Kowalski', vehicle: 'V-119', status: 'online' },
            { name: 'Sophia Rodriguez', vehicle: 'V-307', status: 'offline' },
            { name: 'Liam O\'Brien', vehicle: 'V-562', status: 'online' },
            { name: 'Olivia Park', vehicle: 'V-903', status: 'on-trip' },
            { name: 'Noah Chen', vehicle: 'V-210', status: 'offline' },
            { name: 'Mia Johnson', vehicle: 'V-415', status: 'online' },
            { name: 'Ethan Williams', vehicle: 'V-678', status: 'on-trip' }
        ],
        vehicles: [
            { name: 'V-842', utilization: 87 },
            { name: 'V-119', utilization: 64 },
            { name: 'V-307', utilization: 92 },
            { name: 'V-562', utilization: 45 },
            { name: 'V-903', utilization: 78 },
            { name: 'V-210', utilization: 53 },
            { name: 'V-415', utilization: 71 },
            { name: 'V-678', utilization: 39 }
        ],
        maintenance: [
            { vehicle: 'V-307', service: 'Oil Change', date: '2026-07-15', priority: 'high' },
            { vehicle: 'V-842', service: 'Brake Inspection', date: '2026-07-18', priority: 'medium' },
            { vehicle: 'V-119', service: 'Tire Rotation', date: '2026-07-22', priority: 'low' },
            { vehicle: 'V-903', service: 'Engine Diagnostic', date: '2026-07-25', priority: 'high' }
        ]
    };

    function updateKPIs() {
        const kpis = dataStore.kpis;
        document.getElementById('activeTrips').textContent = kpis.activeTrips;
        document.getElementById('totalVehicles').textContent = kpis.totalVehicles;
        document.getElementById('activeDrivers').textContent = kpis.activeDrivers;
        document.getElementById('ontimePerformance').textContent = kpis.ontimePerformance + '%';
        document.getElementById('maintenanceAlerts').textContent = kpis.maintenanceAlerts;
        document.getElementById('fuelEfficiency').textContent = kpis.fuelEfficiency + ' km/L';
    }

    function populateTrips() {
        const tbody = document.getElementById('tripTableBody');
        if (!tbody) return;

        const statusMap = {
            'in-progress': { label: 'In Progress', class: 'in-progress' },
            'completed': { label: 'Completed', class: 'completed' },
            'delayed': { label: 'Delayed', class: 'delayed' },
            'scheduled': { label: 'Scheduled', class: 'scheduled' }
        };

        tbody.innerHTML = dataStore.trips.map(trip => {
            const status = statusMap[trip.status] || statusMap['scheduled'];
            return `
                <tr>
                    <td><strong>${trip.id}</strong></td>
                    <td>${trip.driver}</td>
                    <td>${trip.vehicle}</td>
                    <td><span class="status-badge ${status.class}">${status.label}</span></td>
                    <td>
                        <button class="btn-action">View</button>
                        <button class="btn-action outline">Edit</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function populateDrivers() {
        const container = document.getElementById('driverStatusList');
        if (!container) return;

        const statusMap = {
            'online': { label: 'Online', class: 'online' },
            'offline': { label: 'Offline', class: 'offline' },
            'on-trip': { label: 'On Trip', class: 'on-trip' }
        };

        container.innerHTML = dataStore.drivers.map(driver => {
            const status = statusMap[driver.status] || statusMap['offline'];
            const initials = driver.name.split(' ').map(n => n[0]).join('').toUpperCase();
            return `
                <div class="driver-item">
                    <div class="driver-item-left">
                        <div class="driver-avatar">${initials}</div>
                        <div>
                            <div class="driver-name">${driver.name}</div>
                            <div class="driver-vehicle">${driver.vehicle}</div>
                        </div>
                    </div>
                    <div class="driver-status">
                        <span class="status-dot ${status.class}"></span>
                        ${status.label}
                    </div>
                </div>
            `;
        }).join('');
    }

    function populateUtilization() {
        const container = document.getElementById('utilizationBars');
        if (!container) return;

        container.innerHTML = dataStore.vehicles.map(v => {
            const color = v.utilization > 80 ? '#22c55e' : (v.utilization > 50 ? '#2563eb' : '#f59e0b');
            return `
                <div class="util-item">
                    <span class="util-label">${v.name}</span>
                    <div class="util-track">
                        <div class="util-fill" style="width: ${v.utilization}%; background: ${color};"></div>
                    </div>
                    <span class="util-percent">${v.utilization}%</span>
                </div>
            `;
        }).join('');
    }

    function populateMaintenance() {
        const container = document.getElementById('maintenanceGrid');
        if (!container) return;

        container.innerHTML = dataStore.maintenance.map(item => {
            const priorityClass = item.priority;
            const priorityLabel = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
            return `
                <div class="maintenance-item">
                    <div class="maintenance-vehicle">${item.vehicle}</div>
                    <div class="maintenance-service">${item.service}</div>
                    <div class="maintenance-date">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <span class="maintenance-priority ${priorityClass}">${priorityLabel} Priority</span>
                </div>
            `;
        }).join('');
    }

    function updateDate() {
        const dateDisplay = document.querySelector('.date-display span');
        if (dateDisplay) {
            const now = new Date();
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            dateDisplay.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    let tripChart = null;

    function initChart() {
        const ctx = document.getElementById('tripChart');
        if (!ctx) return;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const tripsData = [12, 19, 15, 22, 18, 14, 20];
        const completedData = [8, 14, 11, 18, 15, 12, 17];

        tripChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Total Trips',
                        data: tripsData,
                        backgroundColor: 'rgba(37, 99, 235, 0.7)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: 'Completed',
                        data: completedData,
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                        borderRadius: 4
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
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: '500' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function setupChartPeriodSwitch() {
        const buttons = document.querySelectorAll('.btn-sm[data-period]');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                if (tripChart) {
                    const newData = {
                        week: [12, 19, 15, 22, 18, 14, 20],
                        month: [45, 52, 48, 58, 50, 47, 55],
                        year: [380, 420, 395, 450, 410, 390, 430]
                    };
                    const period = this.dataset.period;
                    const data = newData[period] || newData.week;
                    tripChart.data.datasets[0].data = data;
                    tripChart.data.datasets[1].data = data.map(d => Math.round(d * 0.75));
                    tripChart.update();
                }
            });
        });
    }

    function setupSidebarToggle() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                const icon = this.querySelector('i');
                if (sidebar.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-right';
                } else {
                    icon.className = 'fas fa-chevron-left';
                }
            });
        }
    }

    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    function setupQuickActions() {
        const buttons = document.querySelectorAll('.quick-action-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('span')?.textContent || 'Action';
                showToast(`🚀 ${action} triggered!`, 'success');
            });
        });
    }

    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            border-left: 4px solid ${type === 'success' ? '#22c55e' : '#2563eb'};
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            animation: slideUp 0.3s ease;
            max-width: 400px;
        `;
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">${type === 'success' ? '✅' : 'ℹ️'}</span>
                <span style="font-size: 14px; color: #1e293b; font-weight: 500;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 0 4px;">×</button>
            </div>
        `;

        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(container);

        setTimeout(() => {
            if (container.parentElement) {
                container.style.opacity = '0';
                container.style.transition = 'opacity 0.3s ease';
                setTimeout(() => container.remove(), 300);
            }
        }, 4000);
    }

    function setupNotifications() {
        const notifBtn = document.querySelector('.btn-icon .fa-bell')?.closest('.btn-icon');
        if (notifBtn) {
            notifBtn.addEventListener('click', function() {
                showToast('📬 You have 3 new notifications', 'info');
                const dot = this.querySelector('.notification-dot');
                if (dot) dot.style.display = 'none';
            });
        }
    }

    function startAutoRefresh() {
        setInterval(() => {
            const kpis = dataStore.kpis;
            kpis.activeTrips = Math.floor(20 + Math.random() * 10);
            kpis.ontimePerformance = Math.floor(88 + Math.random() * 10);
            kpis.fuelEfficiency = (7.8 + Math.random() * 1.8).toFixed(1);
            
            dataStore.drivers.forEach(driver => {
                const statuses = ['online', 'offline', 'on-trip'];
                if (Math.random() > 0.7) {
                    driver.status = statuses[Math.floor(Math.random() * statuses.length)];
                }
            });

            updateKPIs();
            populateDrivers();
            populateUtilization();

            if (tripChart) {
                const currentData = tripChart.data.datasets[0].data;
                const newData = currentData.map(d => Math.max(5, d + Math.floor(Math.random() * 6) - 3));
                tripChart.data.datasets[0].data = newData;
                tripChart.data.datasets[1].data = newData.map(d => Math.round(d * (0.6 + Math.random() * 0.3)));
                tripChart.update('none');
            }
        }, 8000);
    }

    window.showToast = showToast;

    function init() {
        updateKPIs();
        populateTrips();
        populateDrivers();
        populateUtilization();
        populateMaintenance();
        updateDate();
        initChart();
        setupChartPeriodSwitch();
        setupSidebarToggle();
        setupNavigation();
        setupQuickActions();
        setupNotifications();
        startAutoRefresh();

        console.log('🚀 TransitOps Dashboard initialized successfully!');
        console.log('📊 Data loaded:', dataStore);
    }

    init();
});