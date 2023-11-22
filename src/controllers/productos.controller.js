const mongoose = require("mongoose");
const ProductosRepository = require("../dao/repository/productos.repository.js");

const CustomError = require("../utils/customError.js");
const tiposDeError = require("../utils/tiposDeError.js");

//const productosModelo = require("../dao/DB/models/productos.modelo.js")

const listarProductos = async (req, res) => {
  try {
    let pagina = req.query.pagina || 1;
    let filtroTitle = req.query.filtro;
    let filtroCode = req.query.codeFilter;
    let sortOption = req.query.sort;
    let limit = parseInt(req.query.limit) || 10;

    let query = {};

    if (filtroTitle && filtroCode) {
      query = {
        $or: [
          { title: { $regex: filtroTitle, $options: "i" } },
          { code: { $regex: filtroCode, $options: "i" } },
        ],
      };
    } else if (filtroTitle) {
      query = { title: { $regex: filtroTitle, $options: "i" } };
    } else if (filtroCode) {
      query = { code: { $regex: filtroCode, $options: "i" } };
    }

    let sortQuery = {};

    if (sortOption === "price_asc") {
      sortQuery.price = 1;
    } else if (sortOption === "price_desc") {
      sortQuery.price = -1;
    }

    const productos = await ProductosRepository.listarProductos(
      query,
      limit,
      pagina,
      sortQuery
    );

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;

    // Puedes devolver los productos o cualquier información adicional que necesites
    return productos;
  } catch (error) {
    res
      .status(tiposDeError.ERROR_INTERNO_SERVIDOR)
      .json({ error: "Error interno del servidor" });
  }
};


const obtenerProducto = async (req, res, next) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
           throw new CustomError(
             "ERROR_DATOS",
             "ID inválido",
             tiposDeError.ERROR_DATOS,
             "El id proporcionado no es válido"
           );
    let productoDB = await ProductosRepository.obtenerProducto(id);
    if (!productoDB)
     throw new CustomError(
       "PRODUCTO_NO_ENCONTRADO",
       "Producto no encontrado",
       tiposDeError.PRODUCTO_NO_ENCONTRADO,
       `El producto con ID ${id} no existe.`
     );

    res.locals.productoDB = productoDB;
    next();
  } catch (error) {
    res.status(tiposDeError.ERROR_INTERNO_SERVIDOR).json({
      mensaje: "Error interno del servidor",
    });
  }
};

const obtenerProductoById = async (id) =>{
 try {
     const product = await ProductosRepository.obtenerProductoById(id);
     return product
 } catch (error) {
   throw new CustomError(
     "ERROR_INTERNO",
     "Error interno del servidor",
     tiposDeError.ERROR_INTERNO,
     "Ha ocurrido un error interno al obtener el producto por ID."
   );
 }
}


const crearProducto = async (req, res) => {
  try {
    const producto = req.body;

    if (
      !producto.title ||
      !producto.description ||
      !producto.price ||
      !producto.thumbnail ||
      !producto.code ||
      !producto.stock
    ) {
      throw new CustomError(
        "ERROR_DATOS",
        "Faltan datos",
        tiposDeError.ERROR_DATOS,
        "Faltan datos obligatorios para crear el producto."
      );
    }

  const existe = await ProductosRepository.existeProducto(producto.code); // Modifica la llamada aquí
  if (existe) {
    throw new CustomError(
      "CODIGO_DUPLICADO",
      `El código ${producto.code} ya está siendo usado por otro producto.`,
      tiposDeError.CODIGO_DUPLICADO,
      "El código proporcionado ya está en uso por otro producto."
    );
  }

    const productoInsertado = await ProductosRepository.crearProducto(producto);
    res.status(201).json({ productoInsertado });
  } catch (error)  {
    res
      .status(error.codigo || tiposDeError.ERROR_INTERNO_SERVIDOR)
      .json({ error: "Error inesperado", detalle: error.message });
  }
};

const borrarProducto = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(
        "ERROR_DATOS",
        "ID inválido",
        tiposDeError.ERROR_DATOS,
        "El ID proporcionado no es válido."
      );
    }

    const producto = await ProductosRepository.obtenerProducto(id);

    if (!producto) {
      throw new CustomError(
        "PRODUCTO_NO_ENCONTRADO",
        "Producto no encontrado",
        tiposDeError.PRODUCTO_NO_ENCONTRADO,
        `El producto con ID ${id} no existe.`
      );
    }

    const resultado = await ProductosRepository.borrarProducto(id);

    res
      .status(200)
      .json({ mensaje: "El producto fue correctamente eliminado", resultado });
  } catch (error) {
    res.status(404).json({
      mensaje: "Error, el producto solicitado no pudo ser eliminado",
    });
  }
};

const editarProducto = async (req, res, next) => {
  try {
    const id = req.params.id;
    const producto = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(
        "ERROR_DATOS",
        "ID inválido",
        tiposDeError.ERROR_DATOS,
        "El ID proporcionado no es válido."
      );
    }

    const productoDB = await ProductosRepository.obtenerProducto(id);

    if (!productoDB) {
      throw new CustomError(
        "PRODUCTO_NO_ENCONTRADO",
        "Producto no encontrado",
        tiposDeError.PRODUCTO_NO_ENCONTRADO,
        `El producto con ID ${id} no existe.`
      );
    }

    if (
      !producto.title ||
      !producto.description ||
      !producto.price ||
      !producto.thumbnail ||
      !producto.code ||
      !producto.stock
    ) {
      throw new CustomError(
        "ERROR_DATOS",
        "Faltan datos",
        tiposDeError.ERROR_DATOS,
        "Faltan datos obligatorios para editar el producto."
      );
    }

    if (producto.code !== productoDB.code) {
      const existeNuevoCodigo = await ProductosRepository.existeProducto(
        producto.code
      );
      if (existeNuevoCodigo) {
        throw new CustomError(
          "CODIGO_DUPLICADO",
          `El código ${producto.code} ya está siendo usado por otro producto.`,
          tiposDeError.CODIGO_DUPLICADO,
          "El código proporcionado ya está en uso por otro producto."
        );
      }
    }
    const productoEditado = await ProductosRepository.editarProducto(
      id,
      producto
    );

    res.locals.redireccionar = true;
    res.locals.productoEditado = productoEditado;
  } catch (error) {

    res.locals.redireccionar = false;
    res.locals.error = {
      codigo: error.codigo || tiposDeError.ERROR_INTERNO_SERVIDOR,
      mensaje: "Error inesperado",
      detalle: error.message,
    };
  } finally {
    next(); 
  }
};


module.exports = {
  listarProductos,
  crearProducto,
  obtenerProducto,
  obtenerProductoById,
  borrarProducto,
  editarProducto
};
