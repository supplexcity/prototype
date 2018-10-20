var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User 			= require("./models/user"),
	Merchant 		= require("./models/merchant"),
	Destination		= require("./models/destination"),
	Ticket 			= require("./models/ticket"),
	flash = require("connect-flash"),
	seedDB			= require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/travel_test_app");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

app.use(require("express-session")({
	secret: "Headout got 10M funding :o !",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//passport.use(new LocalStrategy(Merchant.authenticate()));
//passport.serializeUser(Merchant.serializeUser());
//passport.deserializeUser(Merchant.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

/*function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}*/

app.get("/",function(req,res){
	res.render("home.ejs");
	req.flash("success", "WELCOME TO TRAVEL TEST APP!!");
});

app.get("/merchantLogin",function(req,res){
	res.render("merchantLogin.ejs");
});

app.get("/userLogin",function(req,res){
	res.render("userLogin.ejs");
});

app.post("/destinations/:id/booking/tickets",function(req,res){
	Destination.findById(req.params.id,function(err,foundDestination){
		console.log(foundDestination.price);
		var total = req.body.quantity * foundDestination.price;
		if(total<=req.user.balance){
			req.user.balance=req.user.balance-total;
			//req.user.save();
			Ticket.create({
				owner: req.user.username,
			},function(err,ticket){
			if(err){
				console.log(err);
			} else{
				req.user.tickets.push(ticket);
				req.user.save();
			}
		});
		console.log("TICKET GENERATED SUCCESSFULLY");
		res.redirect("/destinations");
		req.flash("success","TICKET GENERATED SUCCESSFULLY, DO MORE BOOKINGS:)");
	}else{
		req.flash("error","ACCOUNT BALANCE INSUFFICIENT");
		res.render("/destinations");
	}
	});
});

app.get("/destinations",function(req,res){
	Destination.find({},function(err,alldestinations){
		if(err){
			console.log(err);
		} else{
			console.log("reached successfully");
			res.render("destinations.ejs",{destinations : alldestinations});
		}
	})
});

app.get("/destinations/:id",function(req,res){
	Destination.findOne({_id: req.params.id},function(err,foundDestination){
		if(err||!foundDestination){
			console.log(err);
		} else{
			res.render("show.ejs",{destination: foundDestination});
		}
	});
});

app.get("/destinations/:id/booking",isLoggedIn,function(req,res){
	Destination.findOne({_id: req.params.id},function(err,foundDestination){
		if(err||!foundDestination){
			console.log(err);
		} else{
			res.render("booking.ejs",{destination: foundDestination});
		}
	});
});



app.post("/ticket",function(req,res){
	var amount = req.body.amount;
	console.log("BET TIME "+hour+ " "+ minute+" "+second);
	if(hour+5<25){
		if(amount<=req.user.balance){
		req.user.balance=req.user.balance-amount;
		req.user.save();
		Bet.create({
			username: req.user.username,
			type: "match results",
			amount: req.body.amount,
			team: team2
		},function(err,bet){
		if(err){
			console.log(err);
		} else{
			req.user.bets.push(bet);
			req.user.save();
		}
		});
		console.log(req.user.username + " PLACED A BET ON " + team2 + " : " + amount);
		req.flash("success","BET PLACED SUCCESSFULLY!");
		}else{
			req.flash("error","BET NOT PLACED, CHECK YOUR ACCOUNT BALANCE!");
		}
		res.redirect("/main");
	}else{
		req.flash("error","DEADLINE OVER, BET NOT PLACED!!");
		res.redirect("/main");
	}
});

/*app.get("/search/:place",function(req,res){
	Destinations.find({},function(err,dest){
		if(err)
			console.log(err);
		else
		{
			var length=dest.length;
			var i;
			var sendDestinations=[];
			for(i=0;i<length;i++)
			{
				if(dest[i].name.localeCompare(place)==0)
					sendDestinations.push(dest[i]);
			}
			res.render("/destinations.ejs",{destinations : sendDestinations});
		}
	})
});*/

app.get("/userHomePage",isLoggedIn,function(req,res){
	res.render("userHomePage.ejs");
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campGrounds");
});

//AUTHENTICATION ROUTES
app.get("/userRegister",function(req,res){
	res.render("userRegister.ejs");
	req.flash("success","LOGGED IN SUCCESSFULLY!");
});

app.post("/userRegister",function(req,res){
	var newUser = new User({username: req.body.username,email: req.body.email});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("userRegister.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/userHomePage");
		});
	});
});

app.get("/merchantRegister",function(req,res){
	res.render("merchantRegister.ejs");
});

app.post("/merchantRegister",function(req,res){
	var newMerchant = new Merchant({username: req.body.username,email: req.body.email,location: req.body.location});
	Merchant.register(newMerchant,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("merchantRegister.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/merchantHomePage");
		});
	});
});

app.post("/userLogin",passport.authenticate("local",{
	successRedirect: "/destinations",
	failureRedirect: "/userLogin"
}),function(req,res){});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","PLEASE LOGIN FIRST!!");
	res.redirect("/userLogin");
}

app.listen(process.env.PORT||2008,function(){
	console.log("SERVER STARTED");
});