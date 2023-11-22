const mongoose = require("mongoose");
const Producto = require("../models/productos.modelo.js");

const carritoSchema = new mongoose.Schema({
  productos: {
    type: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Producto,
        },
        cantidad: Number,
      },
    ],
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const carritoModelo = mongoose.model("carritos", carritoSchema);

module.exports = carritoModelo;

/*
const mongoose = require("mongoose");
const Producto = require("../models/productos.modelo.js");

const carritoSchema = new mongoose.Schema({
  productos: {
    type: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Producto,
        },
        cantidad: Number, // Agrega el campo cantidad
      },
    ],
  },
});

const carritoModelo = mongoose.model("carritos", carritoSchema);

module.exports = carritoModelo;

*/
