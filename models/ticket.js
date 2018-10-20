var mongoose = require("mongoose");
var ticketSchema = new mongoose.Schema({
	ID: String,
	owner: String,
	merchant: String,
	location: String
});
module.exports = mongoose.model("Ticket" , ticketSchema);