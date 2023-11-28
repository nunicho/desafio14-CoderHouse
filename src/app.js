

const express = require("express");
const fs = require("fs");
const http = require("http");
const socketIO = require("socket.io");
const MessageModel = require("./dao/DB/models/messages.modelo.js");

const moongose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

//MANEJO DE ERRORES
const errorHandler = require("./middleware/errorHandler.js");

// DOTENV
const config = require("./config/config.js");


//SESSION
const session = require("express-session");
const ConnectMongo = require("connect-mongo");

//PASSPORT

const inicializaPassport = require("./config/passport.config.js");
const passport = require("passport");

// HANDLEBARS - importación
const handlebars = require("express-handlebars");

const PORT = config.PORT;

const app = express();

// LOGGER
const { middLog } = require("./util.js");
app.use(middLog);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//PARA SESSION Y LOGIN

const sessionStore = ConnectMongo.create({
  mongoUrl: `${config.MONGO_URL}&dbName=${config.DB_NAME}`,

  ttl: 3600,
});

app.use(
  session({
    secret: config.SESSIONS_PASSWORD,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

//PARA INICIAR PASSPORT

inicializaPassport();
app.use(passport.initialize());
app.use(passport.session());

// PARA EL MANEJO DE COOKIES
app.use(cookieParser());

// Routers de FileSystem (FS)
const FSproductsRouter = require("./dao/fileSystem/routes/FSproducts.router.js");
const FScartsRouter = require("./dao/fileSystem/routes/FScarts.router.js");

// Routers de MongoDB (DB)
const productsRouter = require("./dao/DB/routes/DBproducts.router");
const cartsRouter = require("./router/carts.router.js");

// Router de Handlebars
const vistasRouter = require("./router/vistas.router.js");

// Router de Session

const sessionsRouter = require("./router/sessions.router.js");
const { json } = require("body-parser");
const { prototype } = require("module");

// Inicialización de routers
app.use("/api/fsproducts", FSproductsRouter);
app.use("/api/fscarts", FScartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", vistasRouter);

// HANDLEBARS - inicialización
const hbs = handlebars.create({
  helpers: {
    add: function (value, addition) {
      return value + addition;
    },
    subtract: function (value, subtraction) {
      return value - subtraction;
    },
    ifEquals: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    json: function (context) {
      return JSON.stringify(context);
    },
    fileRead: function (filePath, options) {
      fs.readFile(filePath, "utf-8", (error, data) => {
        if (error) {
          console.error(
            `Error al leer el archivo ${filePath}: ${error.message}`
          );
          if (options && options.fn) {
            options.fn("Error al leer el archivo");
          }
        } else {
          if (options && options.fn) {
            options.fn(data);
          }
        }
      });
    },
  },
});

// WEBSOCKET Y CHAT
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

const serverExpress = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket = socketIO(serverExpress);

serverSocket.on("connection", (socket) => {});

moongose
  .connect(config.MONGO_URL, { dbName: config.DB_NAME })
  .then(console.log("DB Conectada"))
  .catch((error) => console.log(error));

let mensajes = [
  {
    emisor: "Server",
    mensaje: "Bienvenido al chat de ferretería el Tornillo... !!!",
  },
];

let usuarios = [];

const serverSocketChat = socketIO(serverExpress);

serverSocketChat.on("connection", (socket) => {

  socket.on("id", (nombre) => {   

    usuarios.push({
      id: socket.id,
      nombre,
    });
    socket.emit("bienvenida", mensajes);
    socket.broadcast.emit("nuevoUsuario", nombre);
  });

  socket.on("nuevoMensaje", (mensaje) => {
    // Guarda el mensaje en MongoDB
    const newMessage = new MessageModel({
      user: mensaje.emisor,
      message: mensaje.mensaje,
    });

    newMessage.save().then(() => {     
    });

    mensajes.push(mensaje);
    serverSocketChat.emit("llegoMensaje", mensaje);
  });
  // PARA HACER UN USUARIO QUE SE DESCONECTÓ
  socket.on("disconnect", () => {
    let indice = usuarios.findIndex((usuario) => usuario.id === socket.id);
    let usuario = usuarios[indice];
    serverSocketChat.emit("usuarioDesconectado", usuario);    
    usuarios.splice(indice, 1);
  });

  socket.on("productoAgregado", (data) => {   
    serverSocket.emit("productoAgregado", data);
  });

  function getProducts() {
    const ruta = path.join(__dirname, "archivos", "productos.json");
    if (fs.existsSync(ruta)) {
      return JSON.parse(fs.readFileSync(ruta, "utf-8"));
    } else {
      return [];
    }
  }

  socket.on("eliminarProducto", (productId) => {
    const productos = getProducts();

    function saveProducts(products) {
      const ruta = path.join(__dirname, "archivos", "productos.json");
      try {
        fs.writeFileSync(ruta, JSON.stringify(products, null, 2), "utf8");
      } catch (error) {
        console.error("Error al guardar productos:", error);
      }
    }
    const productoIndex = productos.findIndex(
      (producto) => producto.id === productId
    );
    if (productoIndex !== -1) {
      productos.splice(productoIndex, 1);
      saveProducts(productos);
      serverSocket.emit("productosActualizados", productos);
    }
  });

  socket.emit("productosActualizados", getProducts());
});

app.use(errorHandler);
