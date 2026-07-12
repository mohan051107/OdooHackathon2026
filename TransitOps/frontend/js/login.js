(function() {
    'use strict';
    var form = document.getElementById('loginForm');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var toggleBtn = document.getElementById('togglePassword');
    var loginBtn = document.getElementById('loginBtn');
    var alertBox = document.getElementById('formAlert');
    var alertMsg = document.getElementById('alertMessage');
    var roleRadios = document.querySelectorAll('input[name="role"]');

    function showAlert(message, type) {
        alertBox.className = 'form-alert show';
        if (type === 'success') alertBox.classList.add('success');
        else alertBox.classList.remove('success');
        alertMsg.textContent = message;
    }

    function hideAlert() {
        alertBox.className = 'form-alert';
    }

    function setLoading(state) {
        if (state) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    toggleBtn.addEventListener('click', function() {
        var isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        this.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    });

    var users = [{
        email: 'fleet@transitops.com',
        password: 'password123',
        role: 'fleet_manager',
        name: 'Fleet Manager'
    }, {
        email: 'driver@transitops.com',
        password: 'password123',
        role: 'driver',
        name: 'Driver'
    }, {
        email: 'safety@transitops.com',
        password: 'password123',
        role: 'safety_officer',
        name: 'Safety Officer'
    }, {
        email: 'finance@transitops.com',
        password: 'password123',
        role: 'financial_analyst',
        name: 'Financial Analyst'
    }];

    function handleLogin(e) {
        e.preventDefault();
        hideAlert();
        var email = emailInput.value.trim();
        var password = passwordInput.value.trim();
        if (!email || !password) {
            showAlert('Please fill in both email and password.', 'error');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }
        var selectedRole = 'fleet_manager';
        for (var i = 0; i < roleRadios.length; i++) {
            if (roleRadios[i].checked) {
                selectedRole = roleRadios[i].value;
                break;
            }
        }
        setLoading(true);
        setTimeout(function() {
            var user = null;
            for (var j = 0; j < users.length; j++) {
                if (users[j].email.toLowerCase() === email.toLowerCase() &&
                    users[j].password === password) {
                    user = users[j];
                    break;
                }
            }
            if (!user) {
                setLoading(false);
                showAlert('Invalid email or password. Please try again.', 'error');
                return;
            }
            if (user.role !== selectedRole) {
                setLoading(false);
                showAlert(
                    'You signed in as "' + user.role.replace('_', ' ') + '" but selected "' +
                    selectedRole.replace('_', ' ') + '". Please choose the correct role.',
                    'error'
                );
                return;
            }
            showAlert('Welcome back, ' + user.name + '! Redirecting…', 'success');
            try {
                sessionStorage.setItem('transitops_user', JSON.stringify({
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    loggedIn: true
                }));
            } catch (_) {}
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 800);
        }, 900);
    }

    form.addEventListener('submit', handleLogin);

    var roleOptions = document.querySelectorAll('.role-option');
    for (var k = 0; k < roleOptions.length; k++) {
        roleOptions[k].addEventListener('click', function() {
            var radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    }

    emailInput.addEventListener('input', hideAlert);
    passwordInput.addEventListener('input', hideAlert);
})();