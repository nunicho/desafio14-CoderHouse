function printPage() {
  window.print();
}

const printButton = document.getElementById("printButton");
if (printButton) {
  printButton.addEventListener("click", printPage);
}
