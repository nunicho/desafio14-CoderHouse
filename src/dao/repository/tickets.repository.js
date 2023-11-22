const ticketMongoDao = require("../ticketsMongoDao.js");

async function createTicket(ticketData) {
  return ticketMongoDao.createTicket(ticketData);
}

module.exports = {
  createTicket,
};
