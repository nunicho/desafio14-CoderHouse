const productosModelo = require("../dao/DB/models/productos.modelo.js");

const listarProductos = async (query, limit, pagina, sortQuery) => {
  return await productosModelo.paginate(query, {
    limit: limit,
    lean: true,
    page: pagina,
    sort: sortQuery,
  });
};

const obtenerProducto = async (id) => {
  return await productosModelo.findById(id).lean();
};

const crearProducto = async (producto) => {
  return await productosModelo.create(producto);
};

const existeProducto = async (code) => {
  return await productosModelo.findOne({ code: code });
};

const borrarProducto = async (id) => {
  return await productosModelo.deleteOne({ _id: id });
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  existeProducto,
  borrarProducto,
};
