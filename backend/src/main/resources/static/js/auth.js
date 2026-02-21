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