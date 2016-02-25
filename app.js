var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// requiring all the dependencies

mongoose.connect("mongodb://localhost/campme");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Setting up the Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
    {name: "Granite Hill", image:"https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"},
    function(err, campground){
        if (err){
            console.log(err);
        } else {
            console.log("Campground created!");
            console.log(campground);
        }
    }
    )

       

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds", {campgrounds:allCampgrounds})
            }
        })
      // res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
   // get the data from the form and add to array
   var name = req.body.name;
   var image = req.body.image;
   // then redirect back to campgrounds page
   
   var newCampground = {name: name, image: image};
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
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running");
});