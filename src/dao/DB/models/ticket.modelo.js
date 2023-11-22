const mongoose = require("mongoose");

const ticketsEsquema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  { collection: "tickets" }
);

const ticketsModelo = mongoose.model("Ticket", ticketsEsquema);

module.exports = ticketsModelo;
