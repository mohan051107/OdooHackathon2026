document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function updateStats() {
        const maintenance = data.maintenance;
        const total = maintenance.length;
        const high = maintenance.filter(m => m.priority === 'high').length;
        const medium = maintenance.filter(m => m.priority === 'medium').length;
        const low = maintenance.filter(m => m.priority === 'low').length;

        document.getElementById('totalMaintenanceStat').textContent = total;
        document.getElementById('highPriorityStat').textContent = high;
        document.getElementById('mediumPriorityStat').textContent = medium;
        document.getElementById('lowPriorityStat').textContent = low;
    }

    function renderMaintenance() {
        const tbody = document.getElementById('maintenanceTableBody');
        const search = document.getElementById('maintenanceSearch')?.value.toLowerCase() || '';
        const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';

        let filtered = data.maintenance.filter(m => {
            const matchesSearch = m.vehicle.toLowerCase().includes(search) || m.service.toLowerCase().includes(search);
            const matchesPriority = priorityFilter === 'all' || m.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });

        const priorityMap = {
            'high': { label: 'High', class: 'high' },
            'medium': { label: 'Medium', class: 'medium' },
            'low': { label: 'Low', class: 'low' }
        };

        tbody.innerHTML = filtered.map(m => {
            const priority = priorityMap[m.priority] || priorityMap['low'];
            return `
                <tr>
                    <td><strong>${m.id}</strong></td>
                    <td>${m.vehicle}</td>
                    <td>${m.service}</td>
                    <td>${new Date(m.date).toLocaleDateString()}</td>
                    <td><span class="maintenance-priority ${priority.class}">${priority.label}</span></td>
                    <td><span class="status-badge scheduled">${m.status}</span></td>
                    <td>
                        <button class="btn-action" onclick="showToast('📋 Viewing ${m.id}', 'info')">View</button>
                        <button class="btn-action outline" onclick="showToast('✏️ Editing ${m.id}', 'info')">Edit</button>
                        <button class="btn-action success" onclick="showToast('✅ Completed ${m.id}', 'success')">Complete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterMaintenance = function() {
        renderMaintenance();
    };

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        updateStats();
        renderMaintenance();

        console.log('🔧 Maintenance page initialized!');
    }

    init();
});