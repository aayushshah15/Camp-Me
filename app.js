var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var User = require("./models/user");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
// requiring all the dependencies

seedDB();
mongoose.connect("mongodb://localhost/campme");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//Passport config
app.use(require("express-session")({
    secret: "Once again UWaterloo misses an ACM Medal!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds:allCampgrounds});
            }
        });
});

app.post("/campgrounds", function(req, res){
   // get the data from the form and add to array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   // then redirect back to campgrounds page
   
   var newCampground = {name: name, image: image, description: desc};
   // Create a new Campground and save it to the database.
   Campground.create(newCampground, function(err, newlycreated){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   })
   res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

app.get("/campgrounds/:id", function(req, res) {
    // get the campground id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    // find campground by ID
    
    Campground.findById(req.params.id, function(err, campground){
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground by ID
    Campground.findById(req.params.id, function(err, campground) {
       if (err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if (err){
                   console.log(err);
               } else {
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
           });
       }
    });
});

// Auth routes

// show register form
app.get("/register", function (req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
app.get("/login", function (req, res){
    res.render("login");
});

//handling login logic
app.post("/login",passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect:"/login"}), function(req, res){
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running");
});
