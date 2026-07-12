document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    const data = window.dataStore;

    function updateKPIs() {
        const kpis = data.kpis;
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

        const recentTrips = data.trips.slice(0, 6);
        tbody.innerHTML = recentTrips.map(trip => {
            const status = statusMap[trip.status] || statusMap['scheduled'];
            return `
                <tr>
                    <td><strong>${trip.id}</strong></td>
                    <td>${trip.driver}</td>
                    <td>${trip.vehicle}</td>
                    <td><span class="status-badge ${status.class}">${status.label}</span></td>
                    <td>
                        <button class="btn-action" onclick="showToast('📋 Viewing ${trip.id}', 'info')">View</button>
                        <button class="btn-action outline" onclick="showToast('✏️ Editing ${trip.id}', 'info')">Edit</button>
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

        container.innerHTML = data.drivers.map(driver => {
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

        container.innerHTML = data.vehicles.map(v => {
            const color = v.utilization > 80 ? '#22c55e' : (v.utilization > 50 ? '#2563eb' : '#f59e0b');
            return `
                <div class="util-item">
                    <span class="util-label">${v.id}</span>
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

        container.innerHTML = data.maintenance.slice(0, 4).map(item => {
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
                        labels: { usePointStyle: true, padding: 20, font: { size: 12, weight: '500' } }
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
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 5 } },
                    x: { grid: { display: false } }
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

    function setupNotifications() {
        const notifBtn = document.getElementById('notificationBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showNotificationModal();
            });
        }
    }

    function showNotificationModal() {
        const existing = document.querySelector('.notification-modal-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        const notifications = [
            { icon: 'fa-route', title: 'Trip TR-1024 is delayed', time: '2 min ago', type: 'warning' },
            { icon: 'fa-tools', title: 'Maintenance due for V-307', time: '15 min ago', type: 'danger' },
            { icon: 'fa-user-check', title: 'Elena Martinez is now online', time: '1 hour ago', type: 'success' },
            { icon: 'fa-gas-pump', title: 'Fuel efficiency below average', time: '2 hours ago', type: 'warning' },
            { icon: 'fa-check-circle', title: 'Trip TR-1023 completed', time: '3 hours ago', type: 'success' },
            { icon: 'fa-exclamation-triangle', title: 'V-842 needs brake inspection', time: '5 hours ago', type: 'danger' }
        ];

        const overlay = document.createElement('div');
        overlay.className = 'notification-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 28px;
                max-width: 480px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <div>
                        <h3 style="font-size:20px;font-weight:700;color:var(--gray-900);">
                            <i class="fas fa-bell" style="color:var(--primary);"></i> Notifications
                        </h3>
                        <span style="font-size:13px;color:var(--gray-500);">${notifications.length} unread</span>
                    </div>
                    <button onclick="this.closest('.notification-modal-overlay').remove()" style="
                        background:none;
                        border:none;
                        font-size:24px;
                        cursor:pointer;
                        color:var(--gray-400);
                        padding:4px 8px;
                        border-radius:8px;
                        transition:all 0.2s;
                    " onmouseover="this.style.background='var(--gray-100)'" onmouseout="this.style.background='transparent'">
                        ×
                    </button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                    ${notifications.map(n => `
                        <div style="
                            display:flex;
                            align-items:flex-start;
                            gap:14px;
                            padding:12px 16px;
                            border-radius:12px;
                            background: var(--gray-50);
                            border-left: 4px solid ${n.type === 'danger' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#22c55e'};
                            transition:all 0.2s;
                            cursor:pointer;
                        " onmouseover="this.style.background='var(--gray-100)'" onmouseout="this.style.background='var(--gray-50)'">
                            <div style="
                                width:36px;
                                height:36px;
                                border-radius:50%;
                                background: ${n.type === 'danger' ? '#fee2e2' : n.type === 'warning' ? '#fef3c7' : '#dcfce7'};
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                flex-shrink:0;
                            ">
                                <i class="fas ${n.icon}" style="color: ${n.type === 'danger' ? '#dc2626' : n.type === 'warning' ? '#b45309' : '#15803d'};"></i>
                            </div>
                            <div style="flex:1;">
                                <div style="font-weight:500;font-size:14px;color:var(--gray-800);">${n.title}</div>
                                <div style="font-size:12px;color:var(--gray-400);margin-top:4px;">
                                    <i class="far fa-clock"></i> ${n.time}
                                </div>
                            </div>
                            <button onclick="event.stopPropagation();showToast('✅ Notification marked as read','success');this.parentElement.style.opacity='0.5';" style="
                                background:none;
                                border:none;
                                color:var(--gray-400);
                                cursor:pointer;
                                padding:4px;
                                font-size:12px;
                            ">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--gray-200);text-align:center;">
                    <button onclick="showToast('📬 Marked all as read','success');this.closest('.notification-modal-overlay').remove();" style="
                        background:none;
                        border:none;
                        color:var(--primary);
                        font-weight:600;
                        cursor:pointer;
                        font-size:14px;
                        transition:all 0.2s;
                    " onmouseover="this.style.color='var(--primary-dark)'" onmouseout="this.style.color='var(--primary)'">
                        Mark all as read
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });

        const dot = document.querySelector('.notification-dot');
        if (dot) dot.style.display = 'none';
    }

    function setupNewTripButton() {
        const newTripBtn = document.getElementById('newTripBtn');
        if (newTripBtn) {
            newTripBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openNewTripModal();
            });
        }

        const scheduleTripBtn = document.querySelector('.quick-action-btn[data-action="schedule-trip"]');
        if (scheduleTripBtn) {
            scheduleTripBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openNewTripModal();
            });
        }
    }

    window.openNewTripModal = function() {
        const existing = document.querySelector('.new-trip-modal-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'new-trip-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 520px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div>
                        <h3 style="font-size:22px;font-weight:700;color:var(--gray-900);">
                            <i class="fas fa-route" style="color:var(--primary);"></i> Schedule New Trip
                        </h3>
                        <span style="font-size:13px;color:var(--gray-500);">Fill in the details below</span>
                    </div>
                    <button onclick="this.closest('.new-trip-modal-overlay').remove()" style="
                        background:none;
                        border:none;
                        font-size:24px;
                        cursor:pointer;
                        color:var(--gray-400);
                        padding:4px 8px;
                        border-radius:8px;
                        transition:all 0.2s;
                    " onmouseover="this.style.background='var(--gray-100)'" onmouseout="this.style.background='transparent'">
                        ×
                    </button>
                </div>
                <form id="newTripForm">
                    <div style="display:grid;gap:18px;">
                        <div>
                            <label style="font-weight:600;font-size:14px;color:var(--gray-700);display:block;margin-bottom:4px;">
                                <i class="fas fa-user" style="color:var(--primary);"></i> Driver
                            </label>
                            <select id="tripDriver" required style="
                                width:100%;
                                padding:10px 14px;
                                border:1px solid var(--gray-200);
                                border-radius:12px;
                                font-family:'Inter',sans-serif;
                                font-size:14px;
                                background:white;
                                transition:all 0.2s;
                            ">
                                <option value="">Select a driver...</option>
                                ${data.drivers.map(d => `<option value="${d.id}">${d.name} (${d.vehicle})</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="font-weight:600;font-size:14px;color:var(--gray-700);display:block;margin-bottom:4px;">
                                <i class="fas fa-truck" style="color:var(--primary);"></i> Vehicle
                            </label>
                            <select id="tripVehicle" required style="
                                width:100%;
                                padding:10px 14px;
                                border:1px solid var(--gray-200);
                                border-radius:12px;
                                font-family:'Inter',sans-serif;
                                font-size:14px;
                                background:white;
                                transition:all 0.2s;
                            ">
                                <option value="">Select a vehicle...</option>
                                ${data.vehicles.filter(v => v.status === 'active').map(v => `<option value="${v.id}">${v.id} - ${v.model}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="font-weight:600;font-size:14px;color:var(--gray-700);display:block;margin-bottom:4px;">
                                <i class="fas fa-calendar-alt" style="color:var(--primary);"></i> Trip Date
                            </label>
                            <input type="date" id="tripDate" required value="${new Date().toISOString().split('T')[0]}" style="
                                width:100%;
                                padding:10px 14px;
                                border:1px solid var(--gray-200);
                                border-radius:12px;
                                font-family:'Inter',sans-serif;
                                font-size:14px;
                                transition:all 0.2s;
                            ">
                        </div>
                        <div>
                            <label style="font-weight:600;font-size:14px;color:var(--gray-700);display:block;margin-bottom:4px;">
                                <i class="fas fa-clock" style="color:var(--primary);"></i> Departure Time
                            </label>
                            <input type="time" id="tripTime" required value="09:00" style="
                                width:100%;
                                padding:10px 14px;
                                border:1px solid var(--gray-200);
                                border-radius:12px;
                                font-family:'Inter',sans-serif;
                                font-size:14px;
                                transition:all 0.2s;
                            ">
                        </div>
                        <div>
                            <label style="font-weight:600;font-size:14px;color:var(--gray-700);display:block;margin-bottom:4px;">
                                <i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> Route
                            </label>
                            <input type="text" id="tripRoute" placeholder="e.g., Downtown to Airport" required style="
                                width:100%;
                                padding:10px 14px;
                                border:1px solid var(--gray-200);
                                border-radius:12px;
                                font-family:'Inter',sans-serif;
                                font-size:14px;
                                transition:all 0.2s;
                            ">
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;margin-top:24px;">
                        <button type="button" id="createTripBtn" style="
                            flex:1;
                            padding:12px;
                            background:var(--primary);
                            color:white;
                            border:none;
                            border-radius:12px;
                            font-weight:600;
                            font-size:15px;
                            cursor:pointer;
                            transition:all 0.2s;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            gap:8px;
                        " onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary)'">
                            <i class="fas fa-plus"></i> Create Trip
                        </button>
                        <button type="button" onclick="this.closest('.new-trip-modal-overlay').remove()" style="
                            padding:12px 24px;
                            background:var(--gray-100);
                            color:var(--gray-700);
                            border:none;
                            border-radius:12px;
                            font-weight:500;
                            font-size:15px;
                            cursor:pointer;
                            transition:all 0.2s;
                        " onmouseover="this.style.background='var(--gray-200)'" onmouseout="this.style.background='var(--gray-100)'">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        const createBtn = overlay.querySelector('#createTripBtn');
        if (createBtn) {
            createBtn.addEventListener('click', function(e) {
                e.preventDefault();
                createNewTrip(overlay);
            });
        }

        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    };

    function createNewTrip(overlay) {
        const driverSelect = document.getElementById('tripDriver');
        const vehicleSelect = document.getElementById('tripVehicle');
        const dateInput = document.getElementById('tripDate');
        const timeInput = document.getElementById('tripTime');
        const routeInput = document.getElementById('tripRoute');

        if (!driverSelect.value) {
            showToast('⚠️ Please select a driver', 'info');
            driverSelect.focus();
            return;
        }
        if (!vehicleSelect.value) {
            showToast('⚠️ Please select a vehicle', 'info');
            vehicleSelect.focus();
            return;
        }
        if (!dateInput.value) {
            showToast('⚠️ Please select a date', 'info');
            dateInput.focus();
            return;
        }
        if (!timeInput.value) {
            showToast('⚠️ Please select a departure time', 'info');
            timeInput.focus();
            return;
        }
        if (!routeInput.value.trim()) {
            showToast('⚠️ Please enter a route', 'info');
            routeInput.focus();
            return;
        }

        const driverName = driverSelect.options[driverSelect.selectedIndex].text.split(' (')[0];
        
        const newTrip = {
            id: `TR-${1000 + data.trips.length + 1}`,
            driver: driverName,
            vehicle: vehicleSelect.value,
            status: 'scheduled',
            date: dateInput.value,
            time: timeInput.value,
            route: routeInput.value.trim()
        };

        data.trips.push(newTrip);
        
        if (overlay) overlay.remove();

        showToast(`✅ New trip ${newTrip.id} scheduled successfully!`, 'success');

        populateTrips();

        data.kpis.activeTrips = data.trips.filter(t => t.status === 'in-progress').length;
        updateKPIs();

        console.log('📋 New trip created:', newTrip);
    }

    function setupQuickActions() {
        const quickActions = document.querySelectorAll('.quick-action-btn');
        quickActions.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                
                switch(action) {
                    case 'add-driver':
                        showAddDriverModal();
                        break;
                    case 'add-vehicle':
                        showAddVehicleModal();
                        break;
                    case 'schedule-trip':
                        openNewTripModal();
                        break;
                    case 'generate-report':
                        showToast('📊 Report generated successfully!', 'success');
                        break;
                    default:
                        showToast(`🚀 Action triggered!`, 'success');
                }
            });
        });
    }

    function showAddDriverModal() {
        const overlay = document.createElement('div');
        overlay.className = 'new-trip-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 480px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div>
                        <h3 style="font-size:22px;font-weight:700;color:var(--gray-900);">
                            <i class="fas fa-user-plus" style="color:var(--primary);"></i> Add New Driver
                        </h3>
                    </div>
                    <button onclick="this.closest('.new-trip-modal-overlay').remove()" style="
                        background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400);
                    ">×</button>
                </div>
                <div style="display:grid;gap:16px;">
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Full Name</label>
                        <input type="text" id="driverNameInput" placeholder="Enter driver name" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                    </div>
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Vehicle</label>
                        <input type="text" id="driverVehicleInput" placeholder="e.g., V-999" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                    </div>
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Phone</label>
                        <input type="tel" id="driverPhoneInput" placeholder="+1 555-0000" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-top:24px;">
                    <button onclick="addNewDriver(this.closest('.new-trip-modal-overlay'))" style="flex:1;padding:12px;background:var(--primary);color:white;border:none;border-radius:12px;font-weight:600;cursor:pointer;">
                        <i class="fas fa-plus"></i> Add Driver
                    </button>
                    <button onclick="this.closest('.new-trip-modal-overlay').remove()" style="padding:12px 24px;background:var(--gray-100);border:none;border-radius:12px;font-weight:500;cursor:pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    window.addNewDriver = function(overlay) {
        const nameInput = document.getElementById('driverNameInput');
        const vehicleInput = document.getElementById('driverVehicleInput');
        const phoneInput = document.getElementById('driverPhoneInput');

        if (!nameInput.value.trim() || !vehicleInput.value.trim() || !phoneInput.value.trim()) {
            showToast('⚠️ Please fill in all fields', 'info');
            return;
        }

        const newDriver = {
            id: `D-${String(data.drivers.length + 1).padStart(3, '0')}`,
            name: nameInput.value.trim(),
            vehicle: vehicleInput.value.trim(),
            status: 'offline',
            phone: phoneInput.value.trim()
        };

        data.drivers.push(newDriver);
        if (overlay) overlay.remove();
        showToast(`✅ Driver ${newDriver.name} added successfully!`, 'success');
        populateDrivers();
        document.getElementById('activeDrivers').textContent = data.drivers.filter(d => d.status === 'online' || d.status === 'on-trip').length;
    };

    function showAddVehicleModal() {
        const overlay = document.createElement('div');
        overlay.className = 'new-trip-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 480px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div>
                        <h3 style="font-size:22px;font-weight:700;color:var(--gray-900);">
                            <i class="fas fa-truck" style="color:var(--primary);"></i> Add New Vehicle
                        </h3>
                    </div>
                    <button onclick="this.closest('.new-trip-modal-overlay').remove()" style="
                        background:none;border:none;font-size:24px;cursor:pointer;color:var(--gray-400);
                    ">×</button>
                </div>
                <div style="display:grid;gap:16px;">
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Vehicle ID</label>
                        <input type="text" id="vehicleIdInput" placeholder="e.g., V-999" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                    </div>
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Model</label>
                        <input type="text" id="vehicleModelInput" placeholder="e.g., Volvo FH" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                    </div>
                    <div>
                        <label style="font-weight:600;font-size:14px;color:var(--gray-700);">Status</label>
                        <select id="vehicleStatusInput" style="
                            width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:12px;font-size:14px;
                        ">
                            <option value="active">Active</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex;gap:12px;margin-top:24px;">
                    <button onclick="addNewVehicle(this.closest('.new-trip-modal-overlay'))" style="flex:1;padding:12px;background:var(--primary);color:white;border:none;border-radius:12px;font-weight:600;cursor:pointer;">
                        <i class="fas fa-plus"></i> Add Vehicle
                    </button>
                    <button onclick="this.closest('.new-trip-modal-overlay').remove()" style="padding:12px 24px;background:var(--gray-100);border:none;border-radius:12px;font-weight:500;cursor:pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    window.addNewVehicle = function(overlay) {
        const idInput = document.getElementById('vehicleIdInput');
        const modelInput = document.getElementById('vehicleModelInput');
        const statusInput = document.getElementById('vehicleStatusInput');

        if (!idInput.value.trim() || !modelInput.value.trim()) {
            showToast('⚠️ Please fill in all fields', 'info');
            return;
        }

        const newVehicle = {
            id: idInput.value.trim(),
            model: modelInput.value.trim(),
            utilization: Math.floor(40 + Math.random() * 50),
            status: statusInput.value,
            lastService: new Date().toISOString().split('T')[0]
        };

        data.vehicles.push(newVehicle);
        if (overlay) overlay.remove();
        showToast(`✅ Vehicle ${newVehicle.id} added successfully!`, 'success');
        populateUtilization();
        document.getElementById('totalVehicles').textContent = data.vehicles.length;
    };

    function startAutoRefresh() {
        setInterval(() => {
            const kpis = data.kpis;
            kpis.activeTrips = Math.floor(20 + Math.random() * 10);
            kpis.ontimePerformance = Math.floor(88 + Math.random() * 10);
            kpis.fuelEfficiency = parseFloat((7.8 + Math.random() * 1.8).toFixed(1));
            
            data.drivers.forEach(driver => {
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

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        setupNotifications();
        setupNewTripButton();
        setupQuickActions();
        
        updateKPIs();
        populateTrips();
        populateDrivers();
        populateUtilization();
        populateMaintenance();
        initChart();
        setupChartPeriodSwitch();
        startAutoRefresh();

        console.log('🚀 TransitOps Dashboard initialized successfully!');
        console.log('📊 Data loaded:', data);
    }

    init();
});