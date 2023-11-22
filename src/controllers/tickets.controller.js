const ticketRepository = require("../dao/repository/tickets.repository.js");

function generateTicketCode() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const ticketCode = `${timestamp}${randomPart}`;
  return ticketCode;
}

async function createTicket(amount, purchaserEmail) {
  const ticketCode = generateTicketCode();
  const purchaseDatetime = new Date();

  const ticketData = {
    code: ticketCode,
    purchase_datetime: purchaseDatetime,
    amount,
    purchaser: purchaserEmail,
  };

  const ticketInsertado = await ticketRepository.createTicket(ticketData);
  return ticketInsertado;
}

module.exports = {
  generateTicketCode,
  createTicket,
};


/*
const ticketsModelo = require("../dao/DB/models/ticket.modelo.js");

function generateTicketCode() {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const ticketCode = `${timestamp}${randomPart}`;
  return ticketCode;
}

async function createTicket(amount, purchaserEmail) {
  const ticket = new ticketsModelo({
    code: generateTicketCode(),
    purchase_datetime: new Date(),
    amount,
    purchaser: purchaserEmail,
  });

  const ticketInsertado = await ticket.save();
  return ticketInsertado;
}

module.exports = {
  generateTicketCode,
  createTicket,
};
*/
