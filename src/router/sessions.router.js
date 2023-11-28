const express = require("express");
const router = express.Router();
const config = require("../config/config.js");
const util = require("../util.js");

//PARA TRAER PASSPORT
const passport = require("passport");

router.get("/errorRegistro", (req, res) => {
  try {
    req.logger.error("Error en la ruta de error de registro");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      error: "Error de registro",
      // AQUÍ SE PODRÍA PONER UN REDIRECT
    });
  } catch (error) {
    req.logger.error(
      `Error al manejar la ruta de error de registro - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta de registro
router.post(
  "/registro",
  util.passportCallRegister("registro"), 
  (req, res) => {
    try {
      if (req.user) {
        req.session.usuario = req.user;
        req.logger.info(`Registro exitoso - Usuario: ${req.user.username}`);
        return res.redirect("/");
      } else {
        const error = req.body.error;
        req.logger.fatal(`Error en la ruta de registro - Detalle: ${error}`);
        return res.redirect("login", { error });
      }
    } catch (error) {
      req.logger.error(
        `Error al manejar la ruta de registro - Detalle: ${error.message}`
      );
      res.status(500).send("Error interno del servidor");
    }
  }
);


router.post("/login", util.passportCall("loginLocal"), (req, res) => {
  try {       
    if (req.user) {
      req.session.usuario = req.user;
      req.logger.info(
        `Inicio de sesión exitoso - Usuario: ${req.session.usuario.email}`
      );
      return res.redirect("/");
    } else {
      const error = req.body.error;
      req.logger.error(`Error en la ruta de login - Detalle: ${error}`);
      return res.redirect("/login?error=" + encodeURIComponent(error));
    }
  } catch (error) {
    req.logger.fatal(
      `Error al manejar la ruta de login - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/logout", (req, res) => {
  try {
    const usuario = req.session.usuario.email;
    req.session.destroy((e) => {
      if (e) {
        req.logger.error(`Error al destruir la sesión - Detalle: ${e.message}`);
      } else {
        req.logger.info(
          `Logout exitoso - Mail: ${usuario} `
        );
        res.redirect("/login?mensaje=Logout correcto!");
      }
    });
  } catch (error) {
    req.logger.error(
      `Error al manejar la ruta de logout - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});

router.get(
  "/github",
  (req, res, next) => {
    passport.authenticate("loginGithub", {
      successRedirect: "/",
      failureRedirect: "/api/sessions/errorGithub",
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (req.user) {
        req.logger.info(
          `Inicio de sesión exitoso con GitHub - Usuario: ${req.user.username}`
        );
        } else {
        req.logger.fatal(`Fallo en la autenticación con GitHub`);
      }
     } catch (error) {
      req.logger.error(
        `Error al manejar la autenticación con GitHub - Detalle: ${error.message}`
      );
      res.status(500).send("Error interno del servidor");
    }
  }
);

router.get(
  "/callbackGithub",
  passport.authenticate("loginGithub", {
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {    
    req.session.usuario = req.user;
    res.redirect("/");
  }
);

router.get("/errorGithub", (req, res) => {
  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    error: "Error en github",
  });
});

// LOGIN DEL ADMINISTRADOR

router.post("/loginAdmin", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      req.logger.error("Faltan datos en la solicitud");
      return res.redirect("/loginAdmin?error=Faltan datos");
    }
    if (email === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
      req.session.usuario = {
        nombre: config.ADMIN_USER,
        email: config.ADMIN_EMAIL,
        role: "administrador",
      };
      req.logger.info(
        `Inicio de sesión exitoso como administrador - Administrador: ${config.ADMIN_EMAIL}`
      );
      return res.redirect("/");
    } else {
      req.logger.error(
        "Credenciales incorrectas para el inicio de sesión como administrador"
      );
      return res.redirect("/loginAdmin?error=Credenciales incorrectas");
    }
  } catch (error) {
    req.logger.fatal(
      `Error al manejar la solicitud de inicio de sesión como administrador - Detalle: ${error.message}`
    );
    res.status(500).send("Error interno del servidor");
  }
});


module.exports = router;

