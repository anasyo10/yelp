var express =require("express");
var router = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware = require("../middleware");


router.get("/", function(req, res){
  // res.render("campground", {array:array};
    Campground.find({}, function(err, Campground){
      if (err) {
        console.log(err);
      }
      else {
        console.log("it works");
        res.render("campgrounds/campground", {Campground: Campground, currentUser: req.user});
      }
    });

});
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampground = {name: name, image:image, description: desc, author: author};
  Campground.create(newCampground, function(err, added){
    if (err) {
      console.log(err);
    }
    else{
      res.redirect("/campground");
      console.log(added);
    }
  });
});




router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});



router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if (err) {
            console.log(err);
        }
        else {
            console.log(found);
            res.render("campgrounds/show", {campground: found});
        }
    });
});



router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //is user logged on?
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campground");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campground/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campground");
      } else {
          res.redirect("/campground");
      }
   });
});

module.exports = router;
