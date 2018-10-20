var mongoose = require("mongoose");
var ticketSchema = new mongoose.Schema({
	owner: String,
	merchant: String,
	location: String,
	ticketsCount: Number
});
module.exports = mongoose.model("Ticket" , ticketSchema);