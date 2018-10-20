var mongoose 	= require("mongoose"),
	Destination  = require("./models/destination");
	//Comment 	= require("./models/comment");

var data = [
	{
		name: "Cayoon Floor",
		image:"https://farm7.staticflickr.com/6139/6016438964_f6b8e1fee2.jpg",
		description: "a must visit place, would have been great if there have been internet",
		price: 20
	},
	{
		name: "Snowy's Rest",
		image:"https://farm6.staticflickr.com/5098/5496185186_d7d7fed22a.jpg",
		description: "a must visit place, would have been great if there have been internet",
		price: 55
	},
	{
		name: "Rafty's Rest",
		image:"https://farm3.staticflickr.com/2928/14133964912_af1df5521d.jpg",
		description: "a must visit place, would have been great if there have been internet",
		price: 38
	}
]

function seedDB(){
	Destination.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("removed all destinations from DB!");
	});
	data.forEach(function(seed){
		Destination.create(seed,function(err,campground){
			if(err){
				console.log(err);
			} else{
				console.log("new campground added!");
				/*Comment.create({
					text: "nice place.....enjoy the vacations",
					author: "Hermione"*/
				}/*,function(err,comment){
					if(err){
						console.log(err);
					} else{
						campground.comments.push(comment);
						campground.save();
						console.log("new comment added!");
					}*/
				});
			});
}

module.exports = seedDB;