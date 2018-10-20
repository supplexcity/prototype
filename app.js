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
passport.use(new LocalStrategy(Merchant.authenticate()));
passport.serializeUser(Merchant.serializeUser());
passport.deserializeUser(Merchant.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/",function(req,res){
	res.render("home.ejs");
	res.flash("success", "WELCOME TO TRAVEL TEST APP!!");
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

app.get("/userHomePage",isLoggedIn,function(req,res){
	res.render("userHomePage.ejs");
});

//AUTHENTICATION ROUTES
app.get("/userRegister",function(req,res){
	res.render("userRegister.ejs");
	res.flash("success","LOGGED IN SUCCESSFULLY!");
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

app.get("/merchantLogin",function(req,res){
	res.render("merchantLogin.ejs");
});

app.get("/userLogin",function(req,res){
	res.render("userLogin.ejs");
});

app.post("/userLogin",passport.authenticate("local",{
	successRedirect: "/userHomePage",
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