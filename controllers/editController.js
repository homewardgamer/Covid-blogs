const User = require("../models/user");
const Post =  require("../models/post");

const editPost = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.title.includes("corona") || req.body.title.includes("covid") ||
            req.body.title.includes("Covid") || req.body.title.includes("Covid-19") ||
            req.body.title.includes("Corona") || req.body.title.includes("CORONA") ||
            req.body.title.includes("COVID")) {
            await Post.updateOne({
                _id: req.params.postid
            }, {
                title: req.body.title,
                body: req.body.body
            });
            res.redirect("/home");
        } else {
            res.redirect("/home");
        }
    } else {
        res.redirect("/login");
    }
}

const editGet = async (req, res) => {
    var postid = req.params.postid;
    var pst;
    if (req.isAuthenticated()) {
        Post.findOne({
            _id: postid
        }, (err, post) => {
            if (err) {
                console.log(err);
            } else {
                pst = post;
            }
        });
        setTimeout(() => {
            res.render("edit", {
                post: pst,
                userid: req.params.userid
            });
        }, 500);

    } else {
        res.redirect("/login");
    }
}
module.exports = {editGet,editPost};