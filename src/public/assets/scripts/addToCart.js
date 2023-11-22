document.addEventListener("DOMContentLoaded", function () {
  const limpiarCarritoButton = document.getElementById("limpiarCarrito");
  const finalizarCompraButton = document.getElementById("finalizarCompra");
  const carritoContainer = document.getElementById("carritoProductos");
  const totalContainer = document.getElementById("totalCarrito"); // Agregamos el contenedor para el total
  const carritoProductos = [];

  function limpiarCarrito() {
    carritoContainer.innerHTML = "";
    carritoProductos.length = 0;
    actualizarTotalCarrito(); // Limpiamos también el total al limpiar el carrito
  }

  limpiarCarritoButton.addEventListener("click", () => {
    limpiarCarrito();
  });

  function actualizarTotalCarrito() {
    const total = carritoProductos.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);

    totalContainer.textContent = `Total: $${total.toFixed(2)}`;
  }

  async function agregarAlCarrito(productId, productName, quantity, price) {
    const productoExistenteIndex = carritoProductos.findIndex(
      (product) => product.id === productId
    );

    if (productoExistenteIndex !== -1) {
      // Si el producto ya existe, actualizar la cantidad
      carritoProductos[productoExistenteIndex].quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo al carrito
      carritoProductos.push({ id: productId, productName, quantity, price });
    }

    // Limpiar el contenedor del carrito
    carritoContainer.innerHTML = "";

    // Mostrar cada producto en el carrito
    carritoProductos.forEach((product) => {
      if (product.productName) {
        // Agregar esta condición para evitar elementos "undefined"
        const itemDiv = document.createElement("div");

        const productNameText = document.createTextNode(product.productName);
        itemDiv.appendChild(productNameText);

        const quantityText = document.createElement("span");
        quantityText.textContent = `Cantidad: ${product.quantity}`;
        itemDiv.appendChild(quantityText);

        const priceText = document.createElement("span");
        priceText.textContent = `Precio: $${(
          product.quantity * product.price
        ).toFixed(2)}`;
        itemDiv.appendChild(priceText);

        carritoContainer.appendChild(itemDiv);
      }
    });

    // Actualizar el total del carrito
    actualizarTotalCarrito();
  }

  finalizarCompraButton.addEventListener("click", async () => {
    try {
      const products = carritoProductos.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      const response = await fetch("/api/carts/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        const errorData = await response.json();


        if (errorData.insufficientStockProducts) {
          alert("Stock insuficiente para algunos productos en el carrito.");
          return;
        }

        throw new Error(
          `La solicitud no fue exitosa. Código de estado: ${response.status}`
        );
      }

      limpiarCarrito();

      const data = await response.json();

      console.log("Compra finalizada:", data);

      if (data.carritoInsertado && data.carritoInsertado._id) {
        alert(`Carrito ${data.carritoInsertado._id} creado exitosamente`);
      }
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
    }
  });

  const addToCartLinks = document.querySelectorAll("[data-product-id]");
  addToCartLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();

      const productId = link.getAttribute("data-product-id");
      const productName = link.getAttribute("data-product-name");
      const price = parseFloat(link.getAttribute("data-product-price"));

      const quantity = parseInt(prompt(`Cantidad de ${productName}:`), 10);

      if (!isNaN(quantity) && quantity > 0) {
        agregarAlCarrito(productId, productName, quantity, price);
      } else {
        alert("La cantidad ingresada no es válida.");
      }
    });
  });
});

/*
document.addEventListener("DOMContentLoaded", function () {
  const limpiarCarritoButton = document.getElementById("limpiarCarrito");
  const finalizarCompraButton = document.getElementById("finalizarCompra");
  const carritoContainer = document.getElementById("carritoProductos");
  const carritoProductos = [];

  function limpiarCarrito() {
  carritoContainer.innerHTML = "";
  carritoProductos.length = 0;
}

limpiarCarritoButton.addEventListener("click", () => {
  limpiarCarrito();
});

  async function agregarAlCarrito(productId, productName, quantity, price) {
    const itemDiv = document.createElement("div");

    const productNameText = document.createTextNode(productName);
    itemDiv.appendChild(productNameText);

    const quantityText = document.createElement("span");
    quantityText.textContent = `Cantidad: ${quantity}`;
    itemDiv.appendChild(quantityText);

    const priceText = document.createElement("span");
    priceText.textContent = `Precio: $${(quantity * price).toFixed(2)}`;
    itemDiv.appendChild(priceText);

    carritoContainer.appendChild(itemDiv);
  }

  finalizarCompraButton.addEventListener("click", async () => {
    try {
      const products = carritoProductos.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      const response = await fetch("/api/carts/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.insufficientStockProducts) {
          alert("Stock insuficiente para algunos productos en el carrito.");
          return;
        }

        throw new Error(
          `La solicitud no fue exitosa. Código de estado: ${response.status}`
        );
      }

      function limpiarCarrito() {
        carritoContainer.innerHTML = "";

        carritoProductos.length = 0;
      }

      limpiarCarritoButton.addEventListener("click", () => {
        limpiarCarrito();
      });


      const data = await response.json();

      console.log("Compra finalizada:", data);

      if (data.carritoInsertado && data.carritoInsertado._id) {
        alert(`Carrito ${data.carritoInsertado._id} creado exitosamente`);
      }


      limpiarCarrito();
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
    }
  });

  const addToCartLinks = document.querySelectorAll("[data-product-id]");
  addToCartLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();

      const productId = link.getAttribute("data-product-id");
      const productName = link.getAttribute("data-product-name");
      const price = parseFloat(link.getAttribute("data-product-price"));

      const quantity = parseInt(prompt(`Cantidad de ${productName}:`), 10);

      if (!isNaN(quantity) && quantity > 0) {
        agregarAlCarrito(productId, productName, quantity, price);
        carritoProductos.push({ id: productId, quantity, price });
      } else {
        alert("La cantidad ingresada no es válida.");
      }
    });
  });
});
*/
