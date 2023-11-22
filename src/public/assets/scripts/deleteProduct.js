const eliminarBotones = document.querySelectorAll(".eliminar-producto");

eliminarBotones.forEach((enlace) => {
  enlace.addEventListener("click", function (event) {
    event.preventDefault();

    const productId = this.getAttribute("data-product-id");

    // Comentar la siguiente línea de alerta
    // alert(`¿Estás seguro de que deseas eliminar el producto con ID: ${productId}?`);

    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "/DBproducts";
        } else {
          // Manejar errores de eliminación si es necesario
        }
      })
      .catch((error) => {
        // Manejar errores de red u otros errores aquí
        console.error("Error al eliminar el producto:", error);
      });
  });
});

/*

const eliminarBotones = document.querySelectorAll(".eliminar-producto");

eliminarBotones.forEach((enlace) => {
  enlace.addEventListener("click", function (event) {
    event.preventDefault();

    const productId = this.getAttribute("data-product-id");

    fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "/DBproducts";
        } else {
        }
      })
      .catch((error) => {});
  });
});
*/
