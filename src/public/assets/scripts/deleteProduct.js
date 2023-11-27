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
          window.location.href = "/DBproducts-Admin";
        } else {
          // Manejar errores de eliminación si es necesario
        }
      })
      .catch((error) => {   
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
