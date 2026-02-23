document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que la página se recargue o redirija

        const url = this.action;

        fetch(url, {
            method: 'POST'
        })
            .then(response => {
                if (response.ok) {
                    alert("¡Producto añadido con éxito!");
                } else {
                    alert("Error al añadir el producto.");
                }
            })
            .catch(error => {
                console.error('Error en la petición:', error);
            });
    });
});