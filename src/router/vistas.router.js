const Router = require("express").Router;
const router = Router();
const arrayProducts = require("../archivos/productos.json");
const productosController = require("../controllers/productos.controller.js");
const carritosController = require("../controllers/carritos.controller.js");
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const config = require("../config/config.js");


const CustomError = require("../utils/customError.js");
const tiposDeError = require("../utils/tiposDeError.js");

//DTO para la vista CURRENT
const dtoUsuarios = require("../dto/dtoUsuarios.js")

// FAKER
const fakeDataGenerator = require("../public/assets/scripts/fakeDataGenerator.js");

const mongoose = require("mongoose");

const auth = (req, res, next) => {

  if (req.session.usuario) {
    next();
  } else {
    return res.redirect("/login");
  }
};

const auth2 = (req, res, next) => {
  if (req.session.usuario) {
    return res.redirect("/");
  } else {
    next();
  }
};



const authRol = (roles) => {
  return (req, res, next) => {
    const user = req.session.usuario;

    if (!user || !roles.includes(user.role)) {
       throw new CustomError(
         "ERROR_DATOS",
         "No tienes permisos para acceder a esta ruta",
         tiposDeError.ERROR_AUTORIZACION,
         "No tienes permisos para acceder a esta ruta"
       );
    }

    next();
  };
};
 
router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario; // Pasar el usuario a res.locals
  next();
});


router.get("/", auth, (req, res) => {
let verLogin
 try { 
  if (req.session.usuario) {
  verLogin = false;
  }
 //req.logger.info(`Login exitoso`);
  res.status(200).render("home", {
    verLogin,
    titlePage: "Home Page de la ferretería El Tornillo",
    estilo: "styles.css",
  });
 
} catch (error) {
  req.logger.error(`Error al abrir el login - Detalle: ${error.message}`);
}
});

//---------------------------------------------------------------- RUTAS EN FILESYSTEM --------------- //

router.get("/fsproducts", auth, (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("FSproducts", {
    product: product,
    index: index,
    titlePage: "Página de productos",
    estilo: "productsStyles.css",
  });
});

router.get("/fsrealtimeproducts", auth, (req, res) => {
  let index = parseInt(req.query.index) || 0;
  const array = arrayProducts;
  const totalProducts = array.length;

  const lastIndex = array.length - 1;

  if (index < 0) {
    index = lastIndex;
  } else if (index >= totalProducts) {
    index = 0;
  }

  const product = array[index];

  res.header("Content-type", "text/html");
  res.status(200).render("realTimeProducts", {
    product: product,
    index: index,
    titlePage: "Página de productos en tiempo real",
    estilo: "realTimeProducts.css",
  });
});

//---------------------------------------------------------------- RUTAS PARA PRODUCTOS--------------- //

router.get("/DBproducts", auth, authRol(["user"]), async (req, res) => {
  
  try {
    const productos = await productosController.listarProductos(req, res);
    res.header("Content-type", "text/html");
    res.status(200).render("DBproducts", {
      productos: productos.docs,
      hasProducts: productos.docs.length > 0,
      // activeProduct: true,
      status: productos.docs.status,
      pageTitle: "Catálogo de",
      estilo: "productsStyles.css",
      totalPages: productos.totalPages,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      filtro: req.query.filtro || "",
      codeFilter: req.query.codeFilter || "",
      sort: req.query.sort || "",
      limit: req.query.limit || 10,
    });
     req.logger.info(`Acceso exitoso a productos - Usuario`);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });   
    req.logger.error(`Error al acceder a productos - Detalle: ${error.message}`);
  }
});


router.get(
  "/DBproducts-Admin",
  auth,
  authRol(["administrador"]),
  async (req, res) => {
    try {
      const productos = await productosController.listarProductos(
        req,
        res
      );

      res.header("Content-type", "text/html");
      res.status(200).render("DBproducts-Admin", {
        productos: productos.docs,
        hasProducts: productos.docs.length > 0,
        // activeProduct: true,
        status: productos.docs.status,
        pageTitle: "Productos en DATABASE",
        estilo: "productsStyles.css",
        totalPages: productos.totalPages,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        filtro: req.query.filtro || "",
        codeFilter: req.query.codeFilter || "",
        sort: req.query.sort || "",
        limit: req.query.limit || 10,
      });
       req.logger.info(`Acceso exitoso a productos - Administrador`);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      req.logger.error(`Error al abrir el login - Detalle: ${error.message}`);
    }
  }
);


router.get(
  "/DBproducts/:id",
  auth,
  productosController.obtenerProducto,
  (req, res) => {
  try {
        const productoDB = res.locals.productoDB;
        if (!productoDB) {
          return res.status(404).send("Producto no encontrado");
        }
        res.header("Content-type", "text/html");
        res.status(200).render("DBproductsDetails", {
          productoDB,
          estilo: "productDetails.css",
        });
        req.logger.info(`Acceso exitoso a detalle producto Id: ${productoDB._id} - Nombre: ${productoDB.title}`);
  } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
        req.logger.error(`Error al abrir detalle de producto - Detalle: ${error.message}`);
  }
  }
);

//router.post("/DBProducts", auth, productosController.crearProducto);



router.post("/DBProducts", auth, async (req, res, next) => {
  try {
    await productosController.crearProducto(req, res, next);
    const nombreProducto = res.locals.nombreProducto;
    const codeProducto = res.locals.codeProducto; 
    if (nombreProducto) {
      req.logger.info(`Producto creado correctamente - Id: ${codeProducto} Nombre: ${nombreProducto}`);
    } else {
      req.logger.warn("No se pudo obtener el nombre del producto creado.");
    }
  } catch (error) {
    req.logger.error("No se pudo crear correctamente el producto", error);    
  }
});


router.delete(
  "/eliminarProducto/:id",
  auth,
  productosController.borrarProducto,
  (req, res) => {
    try {
      res.header("Content-type", "text/html");
      const nombreProducto = res.locals.nombreProducto;
      if (nombreProducto) {
        req.logger.info(`Producto "${nombreProducto}" borrado exitosamente`);
      } else {
        req.logger.warn("No se pudo obtener el nombre del producto borrado.");
      }
      //res.status(200).render("DBproducts-Admin");
    } catch (error) {
      req.logger.error(`Error al borrar producto - Detalle: ${error.message}`);
    }
  }
);


router
  .route("/editarProducto/:id")
  .all(auth, productosController.obtenerProducto)
  .get((req, res) => {
    const productoDB = res.locals.productoDB;
    if (!productoDB) {
      throw new CustomError(
        "ERROR_DATOS",
        "Producto no encontrado",
        tiposDeError.PRODUCTO_NO_ENCONTRADO,
        "Producto no encontrado"
      );
    }
    res.header("Content-type", "text/html");
    res.status(200).render("editarProducto", {
      productoDB,
      estilo: "editarProducto.css",
    });
  })
  .post(async (req, res, next) => {
    try {
      await productosController.editarProducto(req, res, next);

      const { redireccionar, productoEditado, error } = res.locals;

      if (redireccionar) {
        req.logger.info(
          `Producto de nombre ${productoEditado.title} editado correctamente`
        );
        res.redirect("/DBProducts-Admin");
      } else {
        if (error) {
         req.logger.error(
            `Error al editar producto de nombre ${productoEditado.title}`
          );
          res.status(error.codigo).send(error.detalle);
        }
      }
    } catch (error) {
       req.logger.error(
        `Error al editar producto`
      );
      res.status(500).send("Error interno del servidor");
    }
  });

  
//---------------------------------------------------------------- RUTAS PARA CARRITOS--------------- //


router.get(
  "/carts/:cid",
  auth,
  carritosController.verCarritoConId,
  (req, res) => {
    const carritoDB = res.locals.carritoDB;

    if (!carritoDB) {
      req.logger.error(`Carrito no encontrado - Detalle: ${error.message}`);
        throw new CustomError(
          "ERROR_DATOS",
          "Carrito no encontrado",
          tiposDeError.CARRITO_NO_ENCONTRADO,
          "Carrito no encontrado"
        );
        }


  req.logger.info(`Carrito de id ${carritoDB._id} encontrado exitosamente`);
    res.header("Content-type", "text/html");
    res.status(200).render("DBcartDetails", {
      carritoDB,
      estilo: "DBcartDetails.css",
    });
  }
);


//---------------------------------------------------------------- RUTAS PARA EL CHAT --------------- //

router.get("/chat", auth, authRol(["user"]), (req, res) => {
  try {
    req.logger.info(
      `Ingreso al chat exitoso - Usuario ${req.session.usuario.email}`
    );
    res.setHeader("Content-type", "text/html");
    res.status(200).render("chat", {
      estilo: "chat.css",
      usuario: req.session.usuario,
    });
  } catch (error) {
    req.logger.error(`Error al ingresar al chat - Detalle: ${error.message}`);
    res.status(500).send("Error interno del servidor");
  }
});

//---------------------------------------------------------------- RUTAS PARA EL USERS ---------------//

router.get("/registro", auth2, (req, res) => {
  try {
    let error = false;
    let errorDetalle = "";
    if (req.query.error) {
      error = true;
      errorDetalle = req.query.error;
    }

    req.logger.info("Acceso a la página de registro");

    res.status(200).render("registro", {
      verLogin: true,
      error,
      errorDetalle,
      estilo: "login.css",
    });
  } catch (error) {
    req.logger.fatal(
      `Error al acceder a la página de registro - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/login", auth2, (req, res) => {
  try {   
    let error = false;
    let errorDetalle = "";
    if (req.query.error) {
      error = true;
      errorDetalle = req.query.error;
    }

    let usuarioCreado = false;
    let usuarioCreadoDetalle = "";
    if (req.query.usuarioCreado) {
      usuarioCreado = true;
      usuarioCreadoDetalle = req.query.usuarioCreado;
    }

    req.logger.info("Acceso a la página de inicio de sesión");

    res.status(200).render("login", {
      verLogin: true,
      usuarioCreado,
      usuarioCreadoDetalle,
      error,
      errorDetalle,
      estilo: "login.css",
    });
  } catch (error) {
    req.logger.fatal(
      `Error al acceder a la página de inicio de sesión - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/perfil", auth, (req, res) => {
  try {
    req.logger.info(
      `Acceso exitoso al perfil - Usuario: ${req.session.usuario.email}`
    );
    res.status(200).render("perfil", {
      verLogin: false,
      estilo: "login.css",
    });
  } catch (error) {
    req.logger.error(`Error al acceder al perfil - Detalle: ${error.message}`);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/loginAdmin", (req, res) => {
  try {
    req.logger.info(`Acceso exitoso a la página de administrador`);

    let error = false;
    let errorDetalle = "";
    if (req.query.error) {
      error = true;
      errorDetalle = req.query.error;
    }

    res.status(200).render("loginAdmin", {
      error,
      errorDetalle,
      estilo: "login.css",
    });
  } catch (error) {
    req.logger.fatal(
      `Error al acceder a la página de administrador - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

//---------------------------------------------------------------- RUTA CURRENT ---------------//

router.get("/current", (req, res) => {
  const user = req.session.usuario;

  if (!user) {
    return res.status(401).render("current", {
      estilo: "login.css",
    });
  }

  const usuarioDTO = new dtoUsuarios(user.email, user.role);

  res.status(200).render("current", {
    estilo: "login.css",
    usuario: usuarioDTO,
  });
});

//---------------------------------------------------------------- RUTA FAKER---------------//


router.get("/mockingproducts", (req, res) => {
  try {
    req.logger.info(`Acceso exitoso a la ruta de productos simulados`);
    const fakeProducts = fakeDataGenerator.generateFakeProducts(100);
    res.render("FAKERproducts", {
      productos: fakeProducts,
      hasProducts: fakeProducts.length > 0,
      pageTitle: "Productos en DATABASE",
      estilo: "productsStyles.css",
    });
  } catch (error) {
    req.logger.error(
      `Error al acceder a la ruta de productos simulados - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/mockingproducts/:id", (req, res) => {
  try {
    req.logger.info(
      `Acceso exitoso a la ruta de detalles del producto simulado`
    );
    const productId = req.params.id;
    const fakeProduct = fakeDataGenerator.generateFakeProducts(1)[0]; 

    res.render("FAKERproductsDetails", {
      product: fakeProduct,
      pageTitle: "Detalles del Producto",
      estilo: "productDetailsStyles.css",
    });
  } catch (error) {
    req.logger.error(
      `Error al acceder a la ruta de detalles del producto simulado - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

//---------------------------------------------------------------- RUTA LOGS---------------//

router.post('/logs', (req, res) =>{
  res.setHeader('Content-type', 'application/json')
  res.status(200).json({
      log: req.body
  })
})





router.get("/loggerTest", (req, res) => {
  const environment = config.MODO;
  const logFileName =
    environment === "production" ? "errors.log" : "logWarnError.log";
  const logFilePath = path.join(__dirname, "..", "..", logFileName);

  try {
    // Lee el contenido del archivo de manera síncrona
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    const lines = fileContent.split("\n").filter(Boolean);

    const logs = [];

    lines.forEach((line) => {
      if (line.trim().length > 0) {
        try {
          const log = JSON.parse(line);
          logs.push(log);
        } catch (parseError) {
          console.error(
            `Error al parsear línea en ${logFilePath}: ${parseError.message}`
          );
        }
      }
    });

  res.render("loggerTest", {
    logFilePath,
    logs, 
    environment, 
    logFileName, 
  });
  } catch (error) {
    console.error(`Error al leer el archivo ${logFilePath}: ${error.message}`);
    res.render("loggerTest", {
      logFilePath: "Error al leer el archivo",
      logs: [],
    });
  }
});


/*
router.get("/loggerTest", (req, res) => {
  const environment = config.MODO;
  const logFileName =
    environment === "production" ? "errors.log" : "logWarnError.log";
  const logFilePath = path.join(__dirname, "..", "..", logFileName);

  try {
    // Lee el contenido del archivo de manera síncrona
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    const lines = fileContent.split("\n").filter(Boolean);

    const logs = [];

    lines.forEach((line) => {
      if (line.trim().length > 0) {
        try {
          const log = JSON.parse(line);
          logs.push(log);
        } catch (parseError) {
          console.error(
            `Error al parsear línea en ${logFilePath}: ${parseError.message}`
          );
        }
      }
    });

    res.render("loggerTest", {
      logFilePath,
      logs,
      stylesheet: "/loggerTest.css",
    });
  } catch (error) {
    console.error(`Error al leer el archivo ${logFilePath}: ${error.message}`);
    res.render("loggerTest", {
      logFilePath: "Error al leer el archivo",
      logs: [],
    });
  }
});
*/
module.exports = router;

