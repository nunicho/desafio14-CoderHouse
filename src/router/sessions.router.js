const express = require("express");
const router = express.Router();


const config = require("../config/config.js");


const util = require("../util.js");

//PARA TRAER PASSPORT
const passport = require("passport");

router.get("/errorRegistro", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    error: "Error de registro",
    //AQUI SE PODRIA PONER UN REDIRECT
  });
});




// Ruta de registro
router.post(
  "/registro",
  util.passportCallRegister("registro"), // Cambiado el nombre de la estrategia
  (req, res) => {
    if (req.user) {
      req.session.usuario = req.user;
      return res.redirect("/");
    } else {
      const error = req.body.error;
      return res.redirect("login", { error });
    }
  }
);

// Ruta de inicio de sesión
router.post(
  "/login",
  util.passportCall("loginLocal"), // Cambiado el nombre de la estrategia
  (req, res) => {
    if (req.user) {
      req.session.usuario = req.user;
      return res.redirect("/");
    } else {
      const error = req.body.error;
      return res.redirect("/login?error=" + encodeURIComponent(error));
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((e) => console.log(e));
  res.redirect("/login?mensaje=Logout correcto!");

  // AGREGAR MENSAJE DE LOGOUT CORRECTO  CON FONDO AZUL
});

router.get(
  "/github",
  passport.authenticate("loginGithub", {
    successRedirect: "/",
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {}
);


router.get(
  "/callbackGithub",
  passport.authenticate("loginGithub", {
    failureRedirect: "/api/sessions/errorGithub",
  }),
  (req, res) => {
    console.log(req.user);
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
  let { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/loginAdmin?error=Faltan datos");
  }

  if (email ===  config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
    req.session.usuario = {
      nombre: config.ADMIN_USER,
      email: config.ADMIN_EMAIL,
      role: "administrador",
    };
    // Se puso hardcodeado adminCoder@coder.com en el código de sessions.router.js porque no debía estar en la base de datos de usuarios.
    return res.redirect("/");
  } else {
    // Autenticación fallida
    return res.redirect("/loginAdmin?error=Credenciales incorrectas");
  }
});


module.exports = router;

