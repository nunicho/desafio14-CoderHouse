const socket = io();

// PARA TRAER LA LISTA ACTUALIZADA DE PRODUCTOS
socket.on("productosActualizados", (productos) => {
  actualizarListaProductos(productos);
});
function actualizarListaProductos(productos) {
  const listaProductos = document.getElementById("realTimeProductsList");
  listaProductos.innerHTML = "";
  productos.forEach((producto) => {
    const listItem = document.createElement("li");

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("product-item-container");

    listItem.textContent = `Prod: id ${producto.id}, ${producto.title}, Precio: ${producto.price}, Stock ${producto.stock}`;

    const imagen = document.createElement("img");
    imagen.src = producto.thumbnail;
    imagen.alt = "Descripción de la imagen";
    imagen.style.maxWidth = "300px";
    imagen.style.border = "2px solid red";
    imagen.style.margin = "10px";

    itemContainer.appendChild(imagen);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
      socket.emit("eliminarProducto", producto.id);
    });

    itemContainer.appendChild(deleteButton);

    listItem.appendChild(itemContainer);

    listaProductos.appendChild(listItem);
  });
}
