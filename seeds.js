var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name: "Cloud's Rest", image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
        description:"blahhhh"
    },
    {name: "Vanity Valley", image:"https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
        description:"blahhhh"
    },
    {name: "Canyon Floor", image:"https://farm8.staticflickr.com/7115/7626381768_e49ff2fbba.jpg",
        description:"blahhhh"
    }
    ]

function seedDB() {
    // Remove all campgrounds
   Campground.remove({}, function(err){
    if (err){
        console.log(err);
    }
   console.log("Removed campgrounds");
   // add a few campgrounds
    data.forEach(function(seed){
       Campground.create(seed, function(err, data){
          if (err){
              console.log(err);
          } else {
              console.log("Added a new campground");
              // Create a comment
              Comment.create(
                  {
                      text: "This place is nice, but there is no internet",
                      author: "Homer"
                  }, function(err, comment){
                      if (err){
                          console.log(err);
                      } else {
                    data.comments.push(comment);
                    data.save();
                    console.log("created new comment");
                  }}
                  );
          }
       });
    });
});
    };
    
  

module.exports = seedDB;