var express = require("express");
var app = express();

app.get("/",function(req,res){
	res.render("home.ejs");
});

app.listen(process.env.PORT||2008,function(){
	console.log("SERVER STARTED");
});