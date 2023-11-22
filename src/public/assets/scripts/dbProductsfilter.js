
document.getElementById("limpiarFiltros").addEventListener("click", function () {

  document.getElementById("filtro").value = "";
  document.getElementById("codeFilter").value = "";

  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete("filtro");
  currentURL.searchParams.delete("limit");
  window.location.href = currentURL.href;
});







