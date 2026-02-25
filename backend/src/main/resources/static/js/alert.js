document.addEventListener('DOMContentLoaded', function () {
    const toastElement = document.getElementById('cartToast');
    let cartToast = null;
    if (toastElement) {
        cartToast = new bootstrap.Toast(toastElement, { delay: 3000 });
    }

    document.body.addEventListener('submit', function (e) {

        const form = e.target;
        const actionUrl = form.getAttribute("action") || "";

        if (form.classList.contains('add-to-cart-form') || actionUrl.includes("/cart/add/")) {
            e.preventDefault();

            fetch(actionUrl, {
                method: 'POST'
            })
                .then(response => {
                    if (response.ok) {
                        if (cartToast) {
                            cartToast.show();
                        } else {
                            alert("¡Producto añadido con éxito al carrito!");
                        }
                    } else if (response.status === 401) {
                        const authModalElement = document.getElementById('authModal');
                        if (authModalElement) {
                            const authModal = bootstrap.Modal.getOrCreateInstance(authModalElement);
                            authModal.show();

                            if (typeof toggleAuth === "function") toggleAuth('login');

                            const loginErrorDiv = document.getElementById('loginError');
                            if (loginErrorDiv) {
                                loginErrorDiv.textContent = "Necesitas tener cuenta para añadir algo al carrito.";
                                loginErrorDiv.classList.remove('d-none');
                            }
                        } else {
                            alert("Necesitas estar logeado para añadir algo al carrito.");
                        }
                    } else {
                        alert("Error al añadir el producto.");
                    }
                })
                .catch(error => {
                    console.error('Error en la petición:', error);
                });
        }
    });
});