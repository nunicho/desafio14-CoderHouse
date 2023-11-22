const mongoose = require("mongoose");
const carritosRepository = require("../dao/repository/carritos.repository.js");
const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
const productosModelo = require("../dao/DB/models/productos.modelo.js");
const ticketController = require("./tickets.controller");

const productosController = require("../controllers/productos.controller.js");

const CustomError = require("../utils/customError.js");
const tiposDeError = require("../utils/tiposDeError.js");

const verCarritos = async (req, res) => {
  try {
    const carritos = await carritosRepository.verCarritos();
    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const verCarritoConId = async (req, res, next) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new CustomError(
        "ERROR_DATOS",
        'Requiere un argumento "cid" de tipo ObjectId válido',
        tiposDeError.ERROR_DATOS,
        "El cid proporcionado no es válido"
      );
    }

    const carrito = await carritosRepository.verCarritoConId(cid);

    if (!carrito) {
      throw new CustomError(
        "CARRITO_NO_ENCONTRADO",
        `El carrito con ID ${cid} no existe`,
        tiposDeError.CARRITO_NO_ENCONTRADO,
        `El carrito con ID ${cid} no existe.`
      );
    }

    const productosEnCarrito = carrito.productos.map((productoEnCarrito) => ({
      producto: {
        ...productoEnCarrito.producto._doc,
      },
      quantity: productoEnCarrito.cantidad,
    }));

    res.locals.carritoDB = {
      _id: carrito._id,
      productos: productosEnCarrito,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const crearCarrito = async (req, res) => {
  try {
    const carritoToAdd = req.body;

    const hasMissingFields = carritoToAdd.products.some(
      (product) => !product.id || !product.quantity
    );

    if (hasMissingFields || carritoToAdd.products.length === 0) {
      throw new CustomError(
        "ERROR_DATOS",
        'Los productos deben tener campos "id" y "quantity" completos',
        tiposDeError.ERROR_DATOS,
        "Faltan datos obligatorios para crear el carrito."
      );
    }

    const productIds = carritoToAdd.products.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new CustomError(
            "ERROR_DATOS",
            "ID inválido",
            tiposDeError.ERROR_DATOS,
            "El ID proporcionado no es válido."
          );
        }
      }
    }

    const insufficientStockProducts = [];

    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await productosController.obtenerProductoById(id);

      if (!productInDB) {
        throw new CustomError(
          "PRODUCTO_NO_ENCONTRADO",
          `Producto con ID ${id} no encontrado`,
          tiposDeError.PRODUCTO_NO_ENCONTRADO,
          `El producto con ID ${id} no existe.`
        );
      }

      if (productInDB.stock < quantity) {
        insufficientStockProducts.push({
          id,
          quantity,
          availableStock: productInDB.stock,
        });
      }
    }

    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        error: "No hay suficiente stock para algunos productos en el carrito.",
        insufficientStockProducts,
      });
    }

  
 /*  
   if (insufficientStockProducts.length > 0) {
     throw new CustomError(
       "STOCK_INSUFICIENTE",
       "No hay suficiente stock para algunos productos en el carrito.",
       tiposDeError.STOCK_INSUFICIENTE,
       "No hay suficiente stock para algunos productos en el carrito.",
     );
   }
*/
    const groupedProducts = {};
    let totalAmount = 0;

    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await productosController.obtenerProductoById(id);

      if (!productInDB) {
        return res
          .status(404)
          .json({ error: `Producto con id ${id} no encontrado` });
      }

      totalAmount += productInDB.price * quantity;

      if (!groupedProducts[id]) {
        groupedProducts[id] = parseInt(quantity, 10);
      } else {
        groupedProducts[id] += parseInt(quantity, 10);
      }
    }

    const carritoData = {
      productos: Object.keys(groupedProducts).map((id) => ({
        producto: id,
        cantidad: groupedProducts[id],
      })),
      amount: totalAmount,
    };

    let carritoInsertado = await carritosRepository.crearCarrito(carritoData);

    const ticketInsertado = await ticketController.createTicket(
      totalAmount,
      req.session.usuario.email
    );

    for (const product of carritoToAdd.products) {
      const id = product.id;
      const productInDB = await productosController.obtenerProductoById(id);
      productInDB.stock -= product.quantity;
      await productInDB.save();
    }

    res.status(201).json({ carritoInsertado, ticketInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
};

module.exports = {
  verCarritos,
  verCarritoConId,
  crearCarrito,
};

/*
const mongoose = require("mongoose");
const carritosRepository = require("../dao/repository/carritos.repository.js");
const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
const productosModelo = require("../dao/DB/models/productos.modelo.js");
const ticketController = require("./tickets.controller");

const productosController = require("../controllers/productos.controller.js")

const verCarritos = async (req, res) => {
  try {
    const carritos = await carritosRepository.verCarritos();
    res.status(200).json({ data: carritos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const verCarritoConId = async (req, res, next) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo ObjectId válido',
      });
    }

    const carrito = await carritosRepository.verCarritoConId(cid);

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }

    const productosEnCarrito = carrito.productos.map((productoEnCarrito) => ({
      producto: {
        ...productoEnCarrito.producto._doc,
      },
      quantity: productoEnCarrito.cantidad,
    }));

    res.locals.carritoDB = {
      _id: carrito._id,
      productos: productosEnCarrito,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const crearCarrito = async (req, res) => {
  try {
    const carritoToAdd = req.body;

    const hasMissingFields = carritoToAdd.products.some(
      (product) => !product.id || !product.quantity
    );

    if (hasMissingFields || carritoToAdd.products.length === 0) {
      return res.status(400).json({
        error: 'Los productos deben tener campos "id" y "quantity" completos',
      });
    }

    const productIds = carritoToAdd.products.map((product) => product.id);

    for (const productId of productIds) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "id inválido" });
      }
    }

    const insufficientStockProducts = [];

    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await productosController.obtenerProductoById(id);

      if (!productInDB) {
        return res
          .status(404)
          .json({ error: `Producto con id ${id} no encontrado` });
      }

      if (productInDB.stock < quantity) {
        insufficientStockProducts.push({
          id,
          quantity,
          availableStock: productInDB.stock,
        });
      }
    }

    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        error: "No hay suficiente stock para algunos productos en el carrito.",
        insufficientStockProducts,
      });
    }

    const groupedProducts = {};
    let totalAmount = 0;

    for (const product of carritoToAdd.products) {
      const { id, quantity } = product;

      const productInDB = await productosController.obtenerProductoById(id);

      if (!productInDB) {
        return res
          .status(404)
          .json({ error: `Producto con id ${id} no encontrado` });
      }

      totalAmount += productInDB.price * quantity;

      if (!groupedProducts[id]) {
        groupedProducts[id] = parseInt(quantity, 10);
      } else {
        groupedProducts[id] += parseInt(quantity, 10);
      }
    }

    const carrito = new carritosModelo({
      productos: Object.keys(groupedProducts).map((id) => ({
        producto: id,
        cantidad: groupedProducts[id],
      })),
      amount: totalAmount,
    });

    let carritoInsertado = await carrito.save();

    const ticketInsertado = await ticketController.createTicket(
      totalAmount,
      req.session.usuario.email
    );

    for (const product of carritoToAdd.products) {
      const id = product.id
      const productInDB = await productosController.obtenerProductoById(id);
      productInDB.stock -= product.quantity;
      await productInDB.save();
    }

    res.status(201).json({ carritoInsertado, ticketInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
};

module.exports = {
  verCarritos,
  verCarritoConId,
  crearCarrito,
};

*/
