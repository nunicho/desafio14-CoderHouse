const express = require("express");
const router = express.Router();
const carritosController = require("../controllers/carritos.controller.js")




router.get("/", (req, res) => {
  try {
    req.logger.info(`Acceso exitoso a la ruta de ver carritos`);
    carritosController.verCarritos(req, res);
  } catch (error) {
    req.logger.error(
      `Error al acceder a la ruta de ver carritos - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/:cid", (req, res) => {
  try {
    req.logger.info(`Acceso exitoso a la ruta de ver carrito`);
    carritosController.verCarritoConId(req, res);
  } catch (error) {
    req.logger.error(
      `Error al acceder a la ruta de ver carrito con ID - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/purchase", (req, res) => {
  try {
    req.logger.info(`Acceso exitoso a la ruta de crear carrito`);
    carritosController.crearCarrito(req, res);
  } catch (error) {
    req.logger.fatal(
      `Error al acceder a la ruta de crear carrito - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});


module.exports = router;

