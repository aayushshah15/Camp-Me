var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
// requiring all the dependencies

seedDB();
mongoose.connect("mongodb://localhost/campme");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Campground.create({
//     name: "Granite Hill",
//     image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
//     description: "This is a huge granite hill with beautiful granite."
// }, function(err, campground) {
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Created!");
//         console.log(campground)
//     }
// })
       

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("index", {campgrounds:allCampgrounds})
            }
        })
      // res.render("campgrounds", {campgrounds: campgrounds});
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
   res.render("new.ejs"); 
});

app.get("/campgrounds/:id", function(req, res) {
    // get the campground id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running");
});