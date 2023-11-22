const { fileURLToPath } = require("url");
const { dirname } = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { nextTick } = require("process");

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

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

module.exports = {
  __dirname,
  generaHash,
  validaHash,
  passportCall,
  passportCallRegister
};
