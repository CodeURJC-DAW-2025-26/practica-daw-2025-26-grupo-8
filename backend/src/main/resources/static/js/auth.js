function toggleAuth(action) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (action === 'register') {
        loginForm.classList.add('fade-out-left');
        setTimeout(() => {
            loginForm.classList.add('d-none');
            loginForm.classList.remove('fade-out-left');
            registerForm.classList.remove('d-none');
            registerForm.classList.add('fade-in-right');
        }, 300);
    } else {
        registerForm.classList.add('fade-out-right');
        setTimeout(() => {
            registerForm.classList.add('d-none');
            registerForm.classList.remove('fade-out-right');
            loginForm.classList.remove('d-none');
            loginForm.classList.add('fade-in-left');
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if there is an authentication error OR if login is required
    if (urlParams.has('error') || urlParams.has('auth_required')) {

        const authModalElement = document.getElementById('authModal');

        if (authModalElement) {
            const authModal = bootstrap.Modal.getOrCreateInstance(authModalElement);
            authModal.show();

            if (typeof toggleAuth === 'function') {
                toggleAuth('login');
            }

            const loginErrorDiv = document.getElementById('loginError');
            if (loginErrorDiv) {
                loginErrorDiv.classList.remove('d-none', 'alert-danger', 'alert-warning');

                // Set the correct message based on the URL parameter
                if (urlParams.has('error')) {
                    loginErrorDiv.textContent = "Correo o contraseña incorrectos.";
                    loginErrorDiv.classList.add('alert-danger');
                } else if (urlParams.has('auth_required')) {
                    loginErrorDiv.textContent = "Tienes que iniciar sesión para acceder a esta página.";
                    loginErrorDiv.classList.add('alert-warning');
                }
            }

            // Clean the URL silently so the modal doesn't re-trigger if closed
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
    }
});