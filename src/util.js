const { fileURLToPath } = require("url");
const { dirname } = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { nextTick } = require("process");
const winston  = require("winston");
const config = require("./config/config.js");

const entorno = config.MODO

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

const customLevels = {
    niveles: {
      fatal:0,
      error:1,
      warning:2,
      info:3,
      http:4,
      debug:5
    },
    colores:{
      fatal: "bold white redBG",
      error: "bold red",
      warning:"bold yellow",
      info: "bold blue",
      http:"bold magenta",
      debug:"bold cyan"
    }
}

const logger = winston.createLogger({
  levels: customLevels.niveles,
  transports: [
    new winston.transports.File({
      filename: "./logWarnError.log",
      level:'info',
      format: winston.format.combine(
        // winston.format.colorize({
        //   colors: customLevels.colores
        // }),
        winston.format.timestamp(),
        winston.format.json() 
      )
    })
  ],
});


const transporteConsola = new winston.transports.Console({
  level:'debug',
  format: winston.format.combine(
    winston.format.colorize({
      colors: customLevels.colores,
    }),
    winston.format.simple()
  )
})

if (entorno !== "production") {
    logger.add(transporteConsola)
}   

const middLog = (req, res, next) => {
  req.logger = logger;
  console.log(`El entorno es ${entorno}`)
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


/*
const logger = winston.createLogger({
  levels: customLevels.niveles,
  transports: [
  new winston.transports.Console({
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
*/