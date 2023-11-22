const mongoose = require("mongoose");


const modeloUsers = mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    age: Number,
    password: String,    
    cart:String,
    role:String,
  })
);

module.exports = modeloUsers;