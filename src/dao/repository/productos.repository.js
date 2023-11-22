// productos.repository.js
const ProductosMongoDao = require("../productosMongoDao.js");

class ProductosRepository {
  async listarProductos(query, limit, pagina, sortQuery) {
    try {
      return await ProductosMongoDao.listarProductos(
        query,
        limit,
        pagina,
        sortQuery
      );
    } catch (error) {
      throw new Error("Error al listar productos en el repositorio");
    }
  }

  async obtenerProducto(id) {
    try {
      return await ProductosMongoDao.obtenerProducto(id);
    } catch (error) {
      throw new Error("Error al obtener producto en el repositorio");
    }
  }

  async obtenerProductoById(id) {
    try {
      return await ProductosMongoDao.obtenerProductoById(id);
    } catch (error) {
      throw new Error("Error al obtener producto en el repositorio");
    }
  }

  async crearProducto(producto) {
    try {
      const existe = await ProductosMongoDao.existeProducto(producto.code);
      if (existe) {
        throw new Error(
          `El código ${producto.code} ya está siendo usado por otro producto.`
        );
      }

      return await ProductosMongoDao.crearProducto(producto);
    } catch (error) {
      throw new Error("Error al crear producto en el repositorio");
    }
  }

  async borrarProducto(id) {
    try {
      const producto = await ProductosMongoDao.obtenerProducto(id);
      if (!producto) {
        throw new Error(`Producto con id ${id} inexistente`);
      }

      return await ProductosMongoDao.borrarProducto(id);
    } catch (error) {
      throw new Error("Error al borrar producto en el repositorio");
    }
  }

  async existeProducto(code) {
    return await ProductosMongoDao.existeProducto(code);
  }

  async editarProducto(id, producto) {
    try {
      // Verifica si el producto existe antes de intentar editarlo
      const productoExistente = await ProductosMongoDao.obtenerProducto(id);
      if (!productoExistente) {
        throw new Error(`Producto con id ${id} inexistente`);
      }

      // Actualiza el producto en la base de datos usando el método en ProductosMongoDao
      const productoEditado = await ProductosMongoDao.editarProducto(
        id,
        producto
      );

      return productoEditado;
    } catch (error) {
      throw new Error("Error al editar producto en el repositorio");
    }
  }
}




module.exports = new ProductosRepository();
