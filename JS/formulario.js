document.addEventListener('DOMContentLoaded', function () {
    const formularioCompra = document.getElementById('formulario-compra');

    formularioCompra.addEventListener('submit', async function (event) {
        event.preventDefault();

        const exito = await enviarFormulario();

        if (exito) {
            // Vacío el carrito y reinicio el contador
            vaciarCarritoYContador();

            // Muestro un Sweet Alert con el mensaje de agradecimiento
            Swal.fire({
                title: 'Gracias por su compra',
                text: 'Su compra ha sido exitosa.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirijo a HOME
                    window.location.href = '../index.html';
                }
            });
        }
    });

    async function enviarFormulario() {
        // Aquí puedes agregar lógica para enviar el formulario. Siempre retorna true en tu ejemplo.
        return true;
    }

    function vaciarCarritoYContador() {
        // Limpio el carrito
        productosEnCarrito = [];
        guardoCarritoLocalStorage();

        // Reinicio el contador a cero
        localStorage.setItem("numero-carrito", 0);
    }
});

// Función para guardar el carrito en localStorage
function guardoCarritoLocalStorage() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}
