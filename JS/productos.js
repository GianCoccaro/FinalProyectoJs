//Creo array vacio para el carrito
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

let productos = [];
fetch("../js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

let enCarrito;

function actualizarNumeroCarrito() {
    //Actualizo el contador en el elemento HTML
    let numeroCarrito = document.querySelector("#numero-carrito");

    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    //Calculo la nueva cantidad total de productos en el carrito
    let nuevoNumeroCarrito = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    numeroCarrito.innerText = nuevoNumeroCarrito;

    //Guardo la cantidad actualizada en localStorage
    localStorage.setItem("numero-carrito", nuevoNumeroCarrito);
}

//Función para cargar productos al contenedor
function cargarProductos(productosSeleccionados) {
    const contenedorProductos = document.querySelector("#contenedor-productos");
    //Vacio el contenedor antes de cargar los productos
    contenedorProductos.innerHTML = "";

    //Creo los productos usando un forEach
    productosSeleccionados.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("tarjeta-de-producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.img}" alt=${producto.nombre}>
            <div class="producto-info">
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <p class="producto-precio">${producto.precio}</p>
            <button class="producto-agregar" id="agregar-${producto.id}">Agregar al carrito</button> 
        `;

        //Agrego la tarjeta de producto al contenedor
        contenedorProductos.append(div); 

        //Agrego el evento onclick al botón de agregar al carrito
        let botonAgregarAlCarrito = document.getElementById(`agregar-${producto.id}`);
        botonAgregarAlCarrito.addEventListener('click', () => agregarAlCarrito(producto));
    });
}

//Función para agregar al carrito
function agregarAlCarrito(producto) {
    if(!producto){
        console.error("The product doesn't exists...");
        return;
    }
    //Verifico si el producto ya está en el carrito
    enCarrito = productosEnCarrito.find((prod) => prod.id === producto.id);

    if(enCarrito){
        //Si el producto ya estaba en el carrito, aumentamos la cantidad
        enCarrito.cantidad++;
    }else{
        // Si el producto no estaba antes en el carrito, lo agrego utilizando spread para agregar la nueva propiedad y luego push
        productosEnCarrito.push({ ...producto, cantidad: 1});
    }

    //Guardo el carrito en localStorage
    guardoCarritoLocalStorage();

    //Actualizo la cantidad de productos del contador
    actualizarNumeroCarrito();

    //Toastify al agregar un producto al carrito
    Toastify({
        text: "Agregaste un producto al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #800080, #000d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();

    //Actualizo el contador guardado en localStorage
    localStorage.setItem("numero-carrito", productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0));

    //Actualizo el contador de la página
    // actualizarNumeroCarrito();
}

//Funcion para guardar el carrito en localStorage
function guardoCarritoLocalStorage(){
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//Cargo todos los productos al cargar la pagina
document.addEventListener("DOMContentLoaded", function(){
    cargarProductos(productos);
})