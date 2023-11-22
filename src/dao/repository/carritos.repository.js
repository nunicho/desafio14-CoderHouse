const CarritosMongoDao = require("../carritosMongoDao");

class CarritosRepository {
  async verCarritos() {
    return CarritosMongoDao.verCarritos();
  }

  async verCarritoConId(carritoId) {
    return CarritosMongoDao.verCarritoConId(carritoId);
  }

  async crearCarrito(carritoData) {
    return CarritosMongoDao.crearCarrito(carritoData);
  }
}

module.exports = new CarritosRepository();
