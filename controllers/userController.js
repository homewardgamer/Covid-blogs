
const User = require("../models/user");
const Post =  require("../models/post");


const userPage =async (req, res) => {
    if (req.isAuthenticated()) {
        var usr, likedArr, psts;
        User.findOne({
            _id: req.params.userid
        }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                usr = user;

            }
        });

        setTimeout(() => {
            Post.find({
                _id: {
                    $in: usr.likedPosts
                }
            }, (err, liked) => {
                if (err) {
                    console.log(err);
                } else {
                    likedArr = liked;
                }
            });
            Post.find({
                userID: usr._id
            }, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    psts = posts;
                }
            });
        }, 500);
        setTimeout(() => {
            res.render("profile", {
                user: usr,
                likedArr: likedArr,
                userid: req.params.visitorid,
                posts: psts
            });
        }, 1000);

    } else {
        res.redirect('/login');
    }

}

module.exports = {userPage};