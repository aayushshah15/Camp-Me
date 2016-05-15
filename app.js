var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
// requiring all the dependencies

seedDB();
mongoose.connect("mongodb://localhost/campme");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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
                res.render("campgrounds/index", {campgrounds:allCampgrounds})
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

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by ID
    
    Campground.findById(req.params.id, function(err, campground){
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running");
});