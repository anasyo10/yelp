var express =require("express");
var router = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {campground: camp});
        }
    });
});
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    console.log(comment);
                    res.redirect("/campground/" + camp._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
