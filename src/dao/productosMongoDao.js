const mongoose = require("mongoose");
const ProductosModelo = require("./DB/models/productos.modelo.js");

class ProductosMongoDao {
  async listarProductos(query, limit, pagina, sortQuery) {
    return await ProductosModelo.paginate(query, {
      limit: limit,
      lean: true,
      page: pagina,
      sort: sortQuery,
    });
  }

  async obtenerProducto(id) {
    return await ProductosModelo.findById(id).lean();
  }

  async obtenerProductoById(id) {
    return await ProductosModelo.findById(id);
  }

  async crearProducto(producto) {
    return await ProductosModelo.create(producto);
  }

  async existeProducto(code) {
    return await ProductosModelo.findOne({ code: code });
  }

  async borrarProducto(id) {
    return await ProductosModelo.deleteOne({ _id: id });
  }

  async buscarCode(code) {
    await ProductosModelo.findOne({ code: code });
  }

  async editarProducto(id, producto) {
    return await ProductosModelo.findOneAndUpdate(
      { _id: id },
      { $set: producto },
      { new: true }
    );
  }
}

module.exports = new ProductosMongoDao();

/*
// productosMongoDao.js
const mongoose = require("mongoose");
const ProductosModelo = require("./DB/models/productos.modelo.js");

class ProductosMongoDao {
  async listarProductos(query, limit, pagina, sortQuery) {
    return await ProductosModelo.paginate(query, {
      limit: limit,
      lean: true,
      page: pagina,
      sort: sortQuery,
    });
  }

  async obtenerProducto(id) {
    return await ProductosModelo.findById(id).lean();
  }

  async crearProducto(producto) {
    return await ProductosModelo.create(producto);
  }

  async existeProducto(code) {
    return await ProductosModelo.findOne({ code: code });
  }

  async borrarProducto(id) {
    return await ProductosModelo.deleteOne({ _id: id });
  }
}

module.exports = new ProductosMongoDao();

*/
