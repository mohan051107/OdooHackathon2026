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
        { id: 'TR-1024', driver: 'Elena Martinez', vehicle: 'V-842', status: 'in-progress', date: '2026-07-12' },
        { id: 'TR-1023', driver: 'James Kowalski', vehicle: 'V-119', status: 'completed', date: '2026-07-12' },
        { id: 'TR-1022', driver: 'Sophia Rodriguez', vehicle: 'V-307', status: 'delayed', date: '2026-07-11' },
        { id: 'TR-1021', driver: 'Liam O\'Brien', vehicle: 'V-562', status: 'completed', date: '2026-07-11' },
        { id: 'TR-1020', driver: 'Olivia Park', vehicle: 'V-903', status: 'in-progress', date: '2026-07-10' },
        { id: 'TR-1019', driver: 'Noah Chen', vehicle: 'V-210', status: 'scheduled', date: '2026-07-13' },
        { id: 'TR-1018', driver: 'Mia Johnson', vehicle: 'V-415', status: 'completed', date: '2026-07-10' },
        { id: 'TR-1017', driver: 'Ethan Williams', vehicle: 'V-678', status: 'scheduled', date: '2026-07-14' }
    ],
    drivers: [
        { id: 'D-001', name: 'Elena Martinez', vehicle: 'V-842', status: 'on-trip', phone: '+1 555-0101' },
        { id: 'D-002', name: 'James Kowalski', vehicle: 'V-119', status: 'online', phone: '+1 555-0102' },
        { id: 'D-003', name: 'Sophia Rodriguez', vehicle: 'V-307', status: 'offline', phone: '+1 555-0103' },
        { id: 'D-004', name: 'Liam O\'Brien', vehicle: 'V-562', status: 'online', phone: '+1 555-0104' },
        { id: 'D-005', name: 'Olivia Park', vehicle: 'V-903', status: 'on-trip', phone: '+1 555-0105' },
        { id: 'D-006', name: 'Noah Chen', vehicle: 'V-210', status: 'offline', phone: '+1 555-0106' },
        { id: 'D-007', name: 'Mia Johnson', vehicle: 'V-415', status: 'online', phone: '+1 555-0107' },
        { id: 'D-008', name: 'Ethan Williams', vehicle: 'V-678', status: 'on-trip', phone: '+1 555-0108' }
    ],
    vehicles: [
        { id: 'V-842', model: 'Volvo FH', utilization: 87, status: 'active', lastService: '2026-06-15' },
        { id: 'V-119', model: 'Scania R', utilization: 64, status: 'active', lastService: '2026-06-20' },
        { id: 'V-307', model: 'Mercedes Actros', utilization: 92, status: 'maintenance', lastService: '2026-05-10' },
        { id: 'V-562', model: 'DAF XF', utilization: 45, status: 'active', lastService: '2026-07-01' },
        { id: 'V-903', model: 'MAN TGX', utilization: 78, status: 'active', lastService: '2026-06-28' },
        { id: 'V-210', model: 'Volvo FH', utilization: 53, status: 'active', lastService: '2026-06-10' },
        { id: 'V-415', model: 'Scania R', utilization: 71, status: 'active', lastService: '2026-07-05' },
        { id: 'V-678', model: 'Mercedes Actros', utilization: 39, status: 'inactive', lastService: '2026-05-25' }
    ],
    maintenance: [
        { id: 'M-001', vehicle: 'V-307', service: 'Oil Change', date: '2026-07-15', priority: 'high', status: 'scheduled' },
        { id: 'M-002', vehicle: 'V-842', service: 'Brake Inspection', date: '2026-07-18', priority: 'medium', status: 'scheduled' },
        { id: 'M-003', vehicle: 'V-119', service: 'Tire Rotation', date: '2026-07-22', priority: 'low', status: 'scheduled' },
        { id: 'M-004', vehicle: 'V-903', service: 'Engine Diagnostic', date: '2026-07-25', priority: 'high', status: 'scheduled' },
        { id: 'M-005', vehicle: 'V-210', service: 'Transmission Check', date: '2026-07-28', priority: 'medium', status: 'scheduled' }
    ],
    analytics: {
        totalTrips: 1247,
        avgDailyTrips: 42,
        totalDistance: 28450,
        avgFuelConsumption: 8.7,
        onTimeRate: 94,
        revenue: 284500,
        expenses: 189200
    }
};

function updateDate() {
    const dateDisplay = document.querySelector('.date-display span');
    if (dateDisplay) {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
}

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.borderLeftColor = type === 'success' ? '#22c55e' : '#2563eb';
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span style="font-size: 14px; color: #1e293b; font-weight: 500;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 0 4px;">×</button>
        </div>
    `;
    document.body.appendChild(container);

    setTimeout(() => {
        if (container.parentElement) {
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.3s ease';
            setTimeout(() => container.remove(), 300);
        }
    }, 4000);
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

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    }
}

function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
}

function setUserName() {
    const nameEl = document.getElementById('userName');
    if (nameEl) {
        const name = localStorage.getItem('userName') || 'John Admin';
        nameEl.textContent = name;
    }
}

window.dataStore = dataStore;
window.showToast = showToast;
window.updateDate = updateDate;
window.setupSidebarToggle = setupSidebarToggle;
window.setupNotifications = setupNotifications;
window.handleLogout = handleLogout;
window.checkAuth = checkAuth;
window.setUserName = setUserName;