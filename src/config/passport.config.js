//PARA LAS VARIABLES DE ENTORNO

const config = require("./config.js");

//PASSPORT
const passport = require("passport");

// PARA PASSPORT LOCAL
const local = require("passport-local");
const modeloUsers = require("../dao/DB/models/users.modelo.js");

//PARA PASSPORT GITHUB
const github = require("passport-github2");
const modeloUsuariosGithub = require("../dao/DB/models/usuariosGithub.modelo.js");

const crypto = require("crypto");
const util = require("../util.js");

const usersController = require("../controllers/users.controller.js");
//const usersService =require("../services/users.service.js")

const inicializaPassport = () => {
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, email, age, password } = req.body;

          if (!first_name || !last_name || !age || !email || !password) {
            return done(null, false, {
              message: "Por favor, complete todos los campos",
            });
          }

          age = parseInt(age);
          if (isNaN(age) || age <= 13 || age >= 120) {
            return done(null, false, {
              message: "La edad debe ser mayor a 13 y menor a 120",
            });
          }

          let existe = await modeloUsers.findOne({ email });
          if (existe) {
            return done(null, false, {
              message: "El correo electrónico ya está registrado",
            });
          }

          const cartId = generateCustomCartId();

          let usuario = await usersController.createUser({
            first_name,
            last_name,
            email,
            age,
            password: util.generaHash(password),
            cart: cartId,
            role: "user",
          });

          return done(null, usuario);
        } catch (error) {
          return done(error, false, {
            message: "Ocurrió un error durante el registro.",
          });
        }
      }
    )
  );

  passport.use(
    "loginLocal",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) {
            return done(null, false, {
              message: "Faltan datos",
              detalle: "Contacte a RRHH",
            });
          }

          let usuario = await usersController.getUserByEmail(username);
          if (!usuario) {
            return done(null, false, {
              message: "Credenciales incorrectas",
              detalle: "Vuelva a ingresar los datos",
            });
          } else {
            if (!util.validaHash(usuario, password)) {
              return done(null, false, {
                message: "Clave inválida",
                detalle: "Vuelva a ingresar los datos",
              });
            }
          }

          usuario = {
            nombre: usuario.first_name,
            email: usuario.email,
            _id: usuario._id,
            role: usuario.role,
          };

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "loginGithub",
    new github.Strategy(
      {
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRECT,
        callbackURL: config.CALLBACK_URL,
      },
      async (token, tokenRefresh, profile, done) => {
        try {
            let usuario = await modeloUsuariosGithub.findOne({
            email: profile._json.email,
          });
          if (!usuario) {
            usuario = await modeloUsuariosGithub.create({
              nombre: profile._json.name,
              email: profile._json.email,
              github: profile,
              role: "user",
            });
          }

          done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await modeloUsuariosGithub.findById(id);
    return done(null, usuario);
  });
}; // fin de inicializaPassport

// FUNCION PARA ASIGNAR UN ID ÚNICO A CART

function generateCustomCartId() {
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  const cartId = `${Date.now().toString()}-${randomNumber}`;
  return cartId;
}

module.exports = inicializaPassport;
