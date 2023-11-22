const ticketsModelo = require("./DB/models/ticket.modelo.js");

async function createTicket(ticketData) {
  const ticket = new ticketsModelo(ticketData);
  const ticketInsertado = await ticket.save();
  return ticketInsertado;
}

module.exports = {
  createTicket,
};
