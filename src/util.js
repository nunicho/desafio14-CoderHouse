const { fileURLToPath } = require("url");
const { dirname } = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { nextTick } = require("process");
const winston  = require("winston")

const generaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const validaHash = (usuario, password) =>
  bcrypt.compareSync(password, usuario.password);


const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, usuario, info) {
      if (err) return next(err);

      if (!req.body.email || !req.body.password) {
        return res.redirect("/login?error=Faltan datos");
      }

      if (!usuario) {
        const error = info || {}; // Accede al objeto de error
        const errorMessage = encodeURIComponent(
          error.message || "Error desconocido"
        );
        const errorDetalle = encodeURIComponent(
          error.detalle || "Error desconocido"
        );
        return res.redirect(`/login?error=${errorMessage} - ${errorDetalle}`);
      }
      req.user = usuario;
      return next();
    })(req, res, next);
  };
};

const passportCallRegister = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, usuario, info) {
      if (err) return next(err);

      if (!req.body.email || !req.body.password) {
        return res.redirect("/registro?error=Faltan datos");
      }

      if (!usuario) {
        const error = info || {}; // Accede al objeto de error
        const errorMessage = encodeURIComponent(
          error.message || "Error desconocido"
        );
        const errorDetalle = encodeURIComponent(
          error.detalle || "Error desconocido"
        );
        return res.redirect(
          `/registro?error=${errorMessage} - ${errorDetalle}`
        );
      }
      req.user = usuario;
      return res.redirect(`/login?usuarioCreado=${usuario.email}`);
    })(req, res);
  };
};

const transporteHttp = new winston.transports.Http({
      host: 'localhost', port:8080, path: '/logs',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )

})

const filtroInfo = winston.format((datos) => {
  // console.log(datos)
  if (datos.level === "info") {
    datos.message = datos.message.toUpperCase();
    datos.usuario = "ADMIN";
    datos.infoAdicional = "Info...";
    return datos;
  }
});

const logger = winston.createLogger({
  level: "silly",
  transports: [
    // transporteHttp,
    new winston.transports.Console({
      // level:'info',
      // format: winston.format.simple(),
      // format: winston.format.prettyPrint(),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ colors: { error: "bold white redBG" } }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./logWarnError.log",
      level: "warn",
    }),
    new winston.transports.File({
      filename: "./soloInfo.log",
      level: "info",
      format: winston.format.combine(
        filtroInfo(),
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

let http = true;
if (http) {
  logger.add(transporteHttp);
}
// trabajar con var de entorno, y loguear en consola por ej, si estamos en
// modo development

const middLog = (req, res, next) => {
  req.logger = logger;
  next();
};

module.exports = {
  __dirname,
  generaHash,
  validaHash,
  passportCall,
  passportCallRegister,
  middLog
};
