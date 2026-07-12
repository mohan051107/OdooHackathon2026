const VALID_CREDENTIALS = {
    email: 'admin@transitops.com',
    password: 'admin123'
};

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage') || document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.className = 'error-message show';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);
}

function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleLogin(event) {
    event.preventDefault();
    clearError();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'John Administrator');
        
        const btn = document.querySelector('.login-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        btn.disabled = true;
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    } else {
        showError('Invalid email or password. Please try again.');
        
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
    
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    });
});

window.handleLogin = handleLogin;
window.togglePassword = togglePassword;