class CustomError extends Error {
  constructor(nombre, mensaje, codigo, descripcion) {
    super(mensaje);
    this.name = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
  }
}

module.exports = CustomError;
