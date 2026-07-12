document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function updateStats() {
        const vehicles = data.vehicles;
        const total = vehicles.length;
        const active = vehicles.filter(v => v.status === 'active').length;
        const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
        const avgUtil = Math.round(vehicles.reduce((sum, v) => sum + v.utilization, 0) / total);

        document.getElementById('totalVehiclesStat').textContent = total;
        document.getElementById('activeVehiclesStat').textContent = active;
        document.getElementById('maintenanceVehiclesStat').textContent = maintenance;
        document.getElementById('avgUtilizationStat').textContent = avgUtil + '%';
    }

    function renderVehicles() {
        const tbody = document.getElementById('vehiclesTableBody');
        const search = document.getElementById('vehicleSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('vehicleStatusFilter')?.value || 'all';

        let filtered = data.vehicles.filter(v => {
            const matchesSearch = v.id.toLowerCase().includes(search) || v.model.toLowerCase().includes(search);
            const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const statusMap = {
            'active': { label: 'Active', class: 'completed' },
            'maintenance': { label: 'Maintenance', class: 'delayed' },
            'inactive': { label: 'Inactive', class: 'scheduled' }
        };

        tbody.innerHTML = filtered.map(v => {
            const status = statusMap[v.status] || statusMap['inactive'];
            const color = v.utilization > 80 ? '#22c55e' : (v.utilization > 50 ? '#2563eb' : '#f59e0b');
            return `
                <tr>
                    <td><strong>${v.id}</strong></td>
                    <td>${v.model}</td>
                    <td><span class="status-badge ${status.class}">${status.label}</span></td>
                    <td>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div class="util-track" style="width:100px;">
                                <div class="util-fill" style="width:${v.utilization}%;background:${color};"></div>
                            </div>
                            <span>${v.utilization}%</span>
                        </div>
                    </td>
                    <td>${new Date(v.lastService).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-action" onclick="showToast('📋 Viewing ${v.id}', 'info')">View</button>
                        <button class="btn-action outline" onclick="showToast('✏️ Editing ${v.id}', 'info')">Edit</button>
                        <button class="btn-action danger" onclick="showToast('⚠️ Removing ${v.id}', 'info')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterVehicles = function() {
        renderVehicles();
    };

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        updateStats();
        renderVehicles();

        console.log('🚛 Vehicles page initialized!');
    }

    init();
});