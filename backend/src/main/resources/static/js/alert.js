document.addEventListener('DOMContentLoaded', function () {
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
                        alert("¡Producto añadido con éxito al carrito!");
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