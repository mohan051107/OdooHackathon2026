document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function updateStats() {
        const trips = data.trips;
        const total = trips.length;
        const active = trips.filter(t => t.status === 'in-progress').length;
        const completed = trips.filter(t => t.status === 'completed').length;
        const delayed = trips.filter(t => t.status === 'delayed').length;

        document.getElementById('totalTripsStat').textContent = total;
        document.getElementById('activeTripsStat').textContent = active;
        document.getElementById('completedTripsStat').textContent = completed;
        document.getElementById('delayedTripsStat').textContent = delayed;
    }

    function renderTrips() {
        const tbody = document.getElementById('tripsTableBody');
        const search = document.getElementById('tripSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('tripStatusFilter')?.value || 'all';

        let filtered = data.trips.filter(t => {
            const matchesSearch = t.id.toLowerCase().includes(search) || t.driver.toLowerCase().includes(search);
            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const statusMap = {
            'in-progress': { label: 'In Progress', class: 'in-progress' },
            'completed': { label: 'Completed', class: 'completed' },
            'delayed': { label: 'Delayed', class: 'delayed' },
            'scheduled': { label: 'Scheduled', class: 'scheduled' }
        };

        tbody.innerHTML = filtered.map(t => {
            const status = statusMap[t.status] || statusMap['scheduled'];
            return `
                <tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${t.driver}</td>
                    <td>${t.vehicle}</td>
                    <td>${new Date(t.date).toLocaleDateString()}</td>
                    <td><span class="status-badge ${status.class}">${status.label}</span></td>
                    <td>
                        <button class="btn-action" onclick="showToast('📋 Viewing ${t.id}', 'info')">View</button>
                        <button class="btn-action outline" onclick="showToast('✏️ Editing ${t.id}', 'info')">Edit</button>
                        <button class="btn-action success" onclick="showToast('✅ Completed ${t.id}', 'success')">Complete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterTrips = function() {
        renderTrips();
    };

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        updateStats();
        renderTrips();

        console.log('📋 Trips page initialized!');
    }

    init();
});