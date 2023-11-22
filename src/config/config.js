
const dotenv = require("dotenv");
const { Command, Option } = require("commander");


let program = new Command();

program
  .addOption(
    new Option("-m, --mode <modo>", "Modo en que corre el app")
      .choices(["development", "production"])
      .default("production")
  )
  .parse();

let entorno = program.opts().mode;
dotenv.config({
  path: entorno === "production" ? "./.env.production" : "./.env.development",
  override: true,
});


const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRECT: process.env.CLIENT_SECRECT,
  CALLBACK_URL: process.env.CALLBACK_URL,
  SESSIONS_PASSWORD: process.env.SESSIONS_PASSWORD
};

module.exports = config


