document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function updateStats() {
        const drivers = data.drivers;
        const total = drivers.length;
        const online = drivers.filter(d => d.status === 'online').length;
        const onTrip = drivers.filter(d => d.status === 'on-trip').length;
        const offline = drivers.filter(d => d.status === 'offline').length;

        document.getElementById('totalDriversStat').textContent = total;
        document.getElementById('onlineDriversStat').textContent = online;
        document.getElementById('onTripDriversStat').textContent = onTrip;
        document.getElementById('offlineDriversStat').textContent = offline;
    }

    function renderDrivers() {
        const tbody = document.getElementById('driversTableBody');
        const search = document.getElementById('driverSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('driverStatusFilter')?.value || 'all';

        let filtered = data.drivers.filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(search) || d.id.toLowerCase().includes(search);
            const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const statusMap = {
            'online': { label: 'Online', class: 'completed' },
            'offline': { label: 'Offline', class: 'scheduled' },
            'on-trip': { label: 'On Trip', class: 'in-progress' }
        };

        tbody.innerHTML = filtered.map(d => {
            const status = statusMap[d.status] || statusMap['offline'];
            return `
                <tr>
                    <td><strong>${d.id}</strong></td>
                    <td>${d.name}</td>
                    <td>${d.vehicle}</td>
                    <td><span class="status-badge ${status.class}">${status.label}</span></td>
                    <td>${d.phone}</td>
                    <td>
                        <button class="btn-action" onclick="showToast('📋 Viewing ${d.id}', 'info')">View</button>
                        <button class="btn-action outline" onclick="showToast('✏️ Editing ${d.id}', 'info')">Edit</button>
                        <button class="btn-action danger" onclick="showToast('⚠️ Removing ${d.id}', 'info')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterDrivers = function() {
        renderDrivers();
    };

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        updateStats();
        renderDrivers();

        console.log('👤 Drivers page initialized!');
    }

    init();
});