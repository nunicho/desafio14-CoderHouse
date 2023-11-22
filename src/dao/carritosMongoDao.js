const mongoose = require("mongoose");
const Producto = require("../dao/DB/models/productos.modelo.js");
const carritosModelo = require("./DB/models/carritos.modelo.js");

class CarritosMongoDao {
  async verCarritos() {
    return carritosModelo.find();
  }

  async verCarritoConId(carritoId) {
    return carritosModelo.findOne({ _id: carritoId }).populate({
      path: "productos.producto",
      model: Producto,
    });
  }

  async crearCarrito(carritoData) {
    const carrito = new carritosModelo(carritoData);
    return carrito.save();
  }
}

module.exports = new CarritosMongoDao();
