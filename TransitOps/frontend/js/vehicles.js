(function() {
    'use strict';

    const API_BASE = 'http://localhost:8080/api';
    const VEHICLE_ENDPOINT = API_BASE + '/vehicles';

    const tbody = document.getElementById('vehicleTableBody');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');
    const addBtn = document.getElementById('addVehicleBtn');

    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalSub = document.getElementById('modalSub');
    const vehicleForm = document.getElementById('vehicleForm');
    const editId = document.getElementById('editId');
    const fReg = document.getElementById('fRegNumber');
    const fName = document.getElementById('fName');
    const fType = document.getElementById('fType');
    const fCapacity = document.getElementById('fCapacity');
    const fOdometer = document.getElementById('fOdometer');
    const fCost = document.getElementById('fCost');
    const fStatus = document.getElementById('fStatus');
    const regError = document.getElementById('regError');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function showToast(msg, isError) {
        toastEl.textContent = msg;
        toastEl.className = 'toast show';
        if (isError) toastEl.classList.add('error');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toastEl.classList.remove('show');
        }, 3000);
    }

    function getAuthHeader() {
        const token = sessionStorage.getItem('token');
        return token ? { 'Authorization': 'Bearer ' + token } : {};
    }

    async function fetchVehicles() {
        try {
            const res = await fetch(VEHICLE_ENDPOINT, {
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
            });
            if (!res.ok) throw new Error('Failed to fetch vehicles');
            return await res.json();
        } catch (err) {
            showToast('Error loading vehicles: ' + err.message, true);
            return [];
        }
    }

    async function createVehicle(data) {
        try {
            const res = await fetch(VEHICLE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create vehicle');
            return await res.json();
        } catch (err) {
            showToast('Error creating vehicle: ' + err.message, true);
            return null;
        }
    }

    async function updateVehicle(id, data) {
        try {
            const res = await fetch(VEHICLE_ENDPOINT + '/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to update vehicle');
            return await res.json();
        } catch (err) {
            showToast('Error updating vehicle: ' + err.message, true);
            return null;
        }
    }

    async function deleteVehicle(id) {
        try {
            const res = await fetch(VEHICLE_ENDPOINT + '/' + id, {
                method: 'DELETE',
                headers: { ...getAuthHeader() }
            });
            if (!res.ok) throw new Error('Failed to delete vehicle');
            return true;
        } catch (err) {
            showToast('Error deleting vehicle: ' + err.message, true);
            return false;
        }
    }

    function render(vehicles) {
        var search = searchInput.value.toLowerCase().trim();
        var statusFilter = filterStatus.value;
        var typeFilter = filterType.value;

        var filtered = vehicles.filter(function(v) {
            var matchSearch = v.regNumber.toLowerCase().includes(search) ||
                v.name.toLowerCase().includes(search) ||
                v.type.toLowerCase().includes(search);
            var matchStatus = statusFilter === 'all' || v.status === statusFilter;
            var matchType = typeFilter === 'all' || v.type === typeFilter;
            return matchSearch && matchStatus && matchType;
        });

        var total = vehicles.length;
        var avail = vehicles.filter(function(v) { return v.status === 'available'; }).length;
        var ontrip = vehicles.filter(function(v) { return v.status === 'ontrip'; }).length;
        var inshop = vehicles.filter(function(v) { return v.status === 'inshop'; }).length;
        var retired = vehicles.filter(function(v) { return v.status === 'retired'; }).length;
        document.getElementById('statTotal').textContent = total;
        document.getElementById('statAvailable').textContent = avail;
        document.getElementById('statOnTrip').textContent = ontrip;
        document.getElementById('statInShop').textContent = inshop;
        document.getElementById('statRetired').textContent = retired;

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';

        var html = '';
        filtered.forEach(function(v) {
            var statusClass = v.status || 'available';
            var statusLabel = statusClass === 'available' ? 'Available' :
                statusClass === 'ontrip' ? 'On Trip' :
                statusClass === 'inshop' ? 'In Shop' : 'Retired';
            html += '<tr>' +
                '<td><strong>' + v.regNumber + '</strong></td>' +
                '<td>' + v.name + '</td>' +
                '<td>' + v.type + '</td>' +
                '<td>' + v.capacity + ' kg</td>' +
                '<td>' + (v.odometer || 0) + ' km</td>' +
                '<td><span class="status-badge ' + statusClass + '">' + statusLabel + '</span></td>' +
                '<td style="text-align:right;"><div class="action-icons" style="justify-content:flex-end;">' +
                '<button class="btn-edit" data-id="' + v.id + '"><i class="fas fa-pen"></i> Edit</button>' +
                '<button class="btn-danger" data-id="' + v.id + '"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        });
        tbody.innerHTML = html;

        tbody.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openEditModal(btn.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-danger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleDelete(btn.dataset.id);
            });
        });
    }

    function openModal(title, sub, id) {
        modalTitle.textContent = title;
        modalSub.textContent = sub;
        editId.value = id || '';
        regError.classList.remove('show');
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        vehicleForm.reset();
        editId.value = '';
        regError.classList.remove('show');
        fStatus.value = 'available';
        fOdometer.value = 0;
        fCost.value = 0;
    }

    function openAddModal() {
        vehicleForm.reset();
        fStatus.value = 'available';
        fOdometer.value = 0;
        fCost.value = 0;
        openModal('Register Vehicle', 'Enter the vehicle details below.');
    }

    async function openEditModal(id) {
        try {
            var res = await fetch(VEHICLE_ENDPOINT + '/' + id, {
                headers: { ...getAuthHeader() }
            });
            if (!res.ok) throw new Error('Failed to fetch vehicle');
            var v = await res.json();
            fReg.value = v.regNumber;
            fName.value = v.name;
            fType.value = v.type;
            fCapacity.value = v.capacity;
            fOdometer.value = v.odometer || 0;
            fCost.value = v.cost || 0;
            fStatus.value = v.status || 'available';
            openModal('Edit Vehicle', 'Update the vehicle details below.', id);
        } catch (err) {
            showToast('Error loading vehicle details: ' + err.message, true);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        var success = await deleteVehicle(id);
        if (success) {
            showToast('Vehicle deleted successfully');
            loadAndRender();
        }
    }

    vehicleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        var id = editId.value;
        var reg = fReg.value.trim();
        var name = fName.value.trim();
        var type = fType.value;
        var capacity = parseInt(fCapacity.value);
        var odometer = parseInt(fOdometer.value) || 0;
        var cost = parseInt(fCost.value) || 0;
        var status = fStatus.value;

        if (!reg || !name || !capacity || capacity < 1) {
            showToast('Please fill in all required fields.', true);
            return;
        }

        var vehicleData = { regNumber: reg, name: name, type: type, capacity: capacity, odometer: odometer, cost: cost,
            status: status };

        if (!id) {
            var all = await fetchVehicles();
            var duplicate = all.some(function(v) {
                return v.regNumber.toLowerCase() === reg.toLowerCase();
            });
            if (duplicate) {
                regError.classList.add('show');
                return;
            }
        }
        regError.classList.remove('show');

        var result;
        if (id) {
            result = await updateVehicle(id, vehicleData);
        } else {
            result = await createVehicle(vehicleData);
        }

        if (result) {
            closeModal();
            showToast(id ? 'Vehicle updated successfully' : 'Vehicle registered successfully');
            loadAndRender();
        }
    });

    async function loadAndRender() {
        var vehicles = await fetchVehicles();
        render(vehicles);
    }

    searchInput.addEventListener('input', loadAndRender);
    filterStatus.addEventListener('change', loadAndRender);
    filterType.addEventListener('change', loadAndRender);

    addBtn.addEventListener('click', openAddModal);
    cancelModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    function setUser() {
        try {
            var raw = sessionStorage.getItem('transitops_user');
            if (raw) {
                var user = JSON.parse(raw);
                if (user && user.name) {
                    document.getElementById('userName').textContent = user.name;
                    document.getElementById('sidebarUser').textContent = user.name;
                }
                if (user && user.role) {
                    var roleMap = {
                        'fleet_manager': 'Fleet Manager',
                        'driver': 'Driver',
                        'safety_officer': 'Safety Officer',
                        'financial_analyst': 'Financial Analyst'
                    };
                    document.getElementById('userRole').textContent = roleMap[user.role] || 'User';
                }
            }
        } catch (_) {}
    }
    setUser();

    loadAndRender();
})();