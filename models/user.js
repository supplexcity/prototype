var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	balance: Number,
	tickets:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ticket"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);