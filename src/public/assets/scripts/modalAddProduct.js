// Obtén referencias a los elementos HTML
const agregarProductoBtn = document.getElementById("agregarProducto");
const modal = document.getElementById("modal");
const cerrarModalBtn = document.getElementById("cerrarModal");

agregarProductoBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

cerrarModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
