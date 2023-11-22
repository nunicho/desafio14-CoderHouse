const CustomError = require("../utils/customError.js");
const tiposDeError = require("../utils/tiposDeError.js");

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    console.error(`${error.name}: ${error.descripcion}\n${error.stack}`);
    res.setHeader("Content-Type", "application/json");
    return res.status(error.codigo).json({ error: error.message });
  } else {
    console.error("Error interno del servidor:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(tiposDeError.ERROR_INTERNO_SERVIDOR).json({
      error:
        "Error interno del servidor - Intente más tarde o contacte a su administrador",
    });
  }
};

module.exports = errorHandler;
