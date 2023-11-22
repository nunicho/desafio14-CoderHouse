const socket = io();

let nombre = document.getElementById("usuario").value;
let divMensajes = document.getElementById("mensajes");
let inputMensajes = document.getElementById("mensaje");

inputMensajes.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (evt.target.value.trim() !== "") {
      socket.emit("nuevoMensaje", {
        emisor: nombre,
        mensaje: evt.target.value.trim(),
      });
      evt.target.value = "";
      inputMensajes.focus();
    }
  }
});

document.title = nombre;
inputMensajes.focus();

socket.emit("id", nombre);

socket.on("bienvenida", (mensajes) => {
  let txt = "";

  mensajes.forEach((mensaje) => {
    txt += `<p class='mensaje'><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;
  });
  divMensajes.innerHTML = txt;
  divMensajes.scrollTop = divMensajes.scrollHeight;
});

  socket.on("nuevoUsuario", (usuarioConectado) => {
    Swal.fire({
      text: `${usuarioConectado} se ha conectado...!!!`,
      toast: true,
      position: "top-right",
    });
  });

socket.on("llegoMensaje", (mensaje) => {
  let txt = "";
  txt += `<p class='mensaje'><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;

  divMensajes.innerHTML += txt;
  divMensajes.scrollTop = divMensajes.scrollHeight;
});

socket.on("usuarioDesconectado", (usuario) => {
  const nombre = usuario.nombre; // Accede a la propiedad "nombre" del objeto usuario
  Swal.fire({
    text: `${nombre} ha abandonado el chat`,
    toast: true,
    position: "top-right",
  });
});
  
    /*
  socket.on("usuarioDesconectado", (usuario) => {
    Swal.fire({
      text: `${usuario.nombre} ha abandonado el chat`,
      toast: true,
      position: "top-right",
    });
    });
    */
