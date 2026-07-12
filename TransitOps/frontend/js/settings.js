document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    window.checkAuth();
    window.setUserName();

    function initToggles() {
        document.querySelectorAll('.setting-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                showToast(
                    isActive ? '✅ Setting enabled' : '⛔ Setting disabled',
                    isActive ? 'success' : 'info'
                );
            });
        });
    }

    function initSaveSettings() {
        const saveBtn = document.querySelector('.btn-primary .fa-save')?.closest('.btn-primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                showToast('💾 Settings saved successfully!', 'success');
            });
        }
    }

    function init() {
        window.updateDate();
        window.setupSidebarToggle();
        window.setupNotifications();
        initToggles();
        initSaveSettings();

        console.log('⚙️ Settings page initialized!');
    }

    init();
});