//Declaro las variables
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
// const contenedorCarritoVacio = document.querySelector("#vaciar-carrito");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const totalCarrito = document.querySelector("#total-carrito");
const totalPrecio = document.querySelector("#total-precio");
const botonCompletarCompra = document.getElementById("finalizar-compra-button");
const botonVaciarCarrito = document.getElementById('vaciar-carrito');

let numeroCarrito = document.querySelector("#numero-carrito");
numeroCarrito.innerText = localStorage.getItem("numero-carrito") || 0;

function actualizarNumeroCarrito() {
    //Actualizo el contador en el elemento HTML
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    //Calculo la nueva cantidad total de productos en el carrito
    let nuevoNumeroCarrito = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    numeroCarrito.innerText = nuevoNumeroCarrito;

    //Guardo la cantidad actualizada en localStorage
    localStorage.setItem("numero-carrito", nuevoNumeroCarrito);
}

// Función para actualizar el contenido del carrito
function actualizarCarrito(productosEnCarrito) {
    const contenedorCarrito = document.querySelector("#carrito-productos");
    contenedorCarrito.innerHTML = ""; 

    if(!productosEnCarrito || productosEnCarrito.length === 0){
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("carritoVacio");
        itemDiv.innerHTML = `
            <p>Tu carrito está vacio :(</p>
            <i class="fa-solid fa-heart-crack"></i>
        `;

        //Agrego el mensaje al contenedor del carrito
        contenedorCarrito.appendChild(itemDiv);
    } else{
        productosEnCarrito.forEach((producto) => {
            const divProducto = document.createElement("div");
            divProducto.classList.add("producto-carrito");
            divProducto.innerHTML = `
                <img class="carrito-imagen" src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-nombre">
                    <p>Nombre</p>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-cantidad-producto">
                    <p>Cantidad</p>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-precio">
                    <p>Precio</p>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-subtotal">
                    <p>Subtotal</p>
                    <p id="subtotal-${producto.id}">$${producto.cantidad * producto.precio}</p>
                </div>
                <button class="carrito-borrar-producto" data-producto-id="${producto.id}" data-producto-cantidad=${producto.cantidad}>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            contenedorCarrito.appendChild(divProducto);
        });
    }

    //Agrego evento de click para eliminar productos
    let botonesBorrar = document.querySelectorAll(".carrito-borrar-producto");
    botonesBorrar.forEach((button) => {
        button.addEventListener("click", borrarProducto);
    })

    calcularTotalCarrito(productosEnCarrito);
}

actualizarCarrito(productosEnCarrito);

//Función para eliminar productos con icono
function borrarProducto(e){
    //Obtengo el ID del producto
    let productoID = e.currentTarget.getAttribute("data-producto-id");

    //Elimino el producto del carrito por su ID
    productosEnCarrito = productosEnCarrito.filter((producto) => producto.id !== productoID);

    //Toastify
    Toastify({
        text: "Eliminaste un producto al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #000d, #800080)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    //Actualizo carrito
    actualizarCarrito(productosEnCarrito);

    //Guardo carrito en LS
    guardoCarritoLocalStorage();

    //Actualizo contador
    actualizarNumeroCarrito();
}

// Función para calcular el total del carrito
function calcularTotalCarrito(productosEnCarrito) {
    let total = 0;

    if (productosEnCarrito) {
        productosEnCarrito.forEach(producto => {
            total += producto.precio * producto.cantidad;
        });
    }

    totalPrecio.textContent = `$${total}`;
}

//Función para guardar el carrito en localStorage
function guardoCarritoLocalStorage(){
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    calcularTotalCarrito(productosEnCarrito);
}

// Botón para vaciar el carrito 
botonVaciarCarrito.addEventListener('click', () => {
    // Muestra SweetAlert de confirmación
    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro de que deseas vaciar tu carrito por completo?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            // Vacía el carrito si el usuario confirma
            vaciarCarrito();
        }
    });
});

function vaciarCarrito(){
    productosEnCarrito = [];
    guardoCarritoLocalStorage();
    actualizarCarrito();
    actualizarNumeroCarrito();
}

botonCompletarCompra.addEventListener('click', () => {
    if (productosEnCarrito.length === 0) {
        // Muestra una SweetAlert de error
        Swal.fire({
            icon: 'error',
            title: '¡Oops!',
            text: 'Tu carrito está vacío. Por favor, agrega productos antes de completar la compra.',
            footer: '<a href="">¿Por qué tengo este problema?</a>'
        });
    } else {
        // Muestra una SweetAlert de confirmación
        Swal.fire({
            icon: 'success',
            title: '¿Estás seguro de que deseas completar tu compra?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirige al usuario al formulario
                window.location.href = '../pages/formulario.html';
            }
        });
    }
});



// Si hay productos en el carrito, mostrar el carrito
// if (productosEnCarrito.length > 0) {
//     // contenedorCarritoVacio.classList.add("disabled");
//     contenedorCarritoProductos.classList.remove("disabled");
//     contenedorCarritoAcciones.classList.remove("disabled");
//     contenedorCarritoComprado.classList.add("disabled");
    
    
//     actualizarCarrito(productosEnCarrito);
// }