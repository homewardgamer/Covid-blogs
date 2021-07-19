const express = require("express");
const monoogose = require("mongoose");
const User = require("../models/user");
const Post =  require("../models/post");
const like = async (req, res) => {
    var route;
    var likesNew;
    var flag = 0;
    var usr;
    route = "/posts/" + req.params.postid + "/" + req.params.userid;
    await User.findOne({
            _id: req.params.userid,
        },
        (err, user) => {
            if (err) {
                console.log(err);
            } else {
                usr = user;
                for (var i = 0; i < usr.likedPosts.length; i++) {
                    if (usr.likedPosts[i] == req.params.postid) {
                        flag++;
                        break;
                    }
                }
            }
        }
    );
    if (flag == 1) {
        res.redirect(route);
    } else {
        await Post.findOne({
                _id: req.params.postid,
            },
            (err, post) => {
                if (err) {
                    console.log(err);
                } else {
                    likesNew = post.likes;
                    likesNew = likesNew + 1;
                }
            }
        );
        await Post.updateOne({
            _id: req.params.postid,
        }, {
            likes: likesNew,
        });
        usr.likedPosts.push(req.params.postid);
        await User.updateOne({
            _id: req.params.userid,
        }, {
            likedPosts: usr.likedPosts,
        });

        res.redirect(route);
    }

}

const comment = async (req, res) => {
    var route;
    var commentArr;
    var today = new Date().toLocaleString(undefined, {
        timeZone: 'Asia/Kolkata'
    });;
    await Post.findOne({
            _id: req.params.postid,
        },
        (err, post) => {
            if (err) {
                console.log(err);
            } else {
                commentArr = post.comments;
            }
        }
    );
    commentArr.push({
        date: today,
        body: req.body.comment,
    });
    await Post.updateOne({
        _id: req.params.postid,
    }, {
        comments: commentArr,
    });

    route = "/posts/" + req.params.postid + "/" + req.params.userid;
    res.redirect(route);
}

const newPostGet = async (req, res) => {
    var userid = req.params.userid;
    var usr;
    if (req.isAuthenticated) {
        await User.findOne({
                _id: userid,
            },
            (err, user) => {
                if (err) console.log(err);
                else {
                    usr = user;
                }
            }
        );
        setTimeout(() => {
            res.render("new", {
                user: usr,
            });
        }, 500);

    } else {
        res.redirect("/login");
    }
}
const newPost = async (req, res) => {
    if (req.body.title.includes("corona") || req.body.title.includes("covid") ||
        req.body.title.includes("Covid") || req.body.title.includes("Covid-19") ||
        req.body.title.includes("Corona") || req.body.title.includes("CORONA") ||
        req.body.title.includes("COVID")) {
        var usr;
        await User.findOne({
            _id: req.params.userid
        }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                usr = user.username;
            }
        });
        var d = new Date().toLocaleString(undefined, {
            timeZone: 'Asia/Kolkata'
        });
        setTimeout(() => {
            const post = new Post({
                title: req.body.title,
                body: req.body.body,
                author: usr,
                date: d,
                likes: 0,
                comments: [],
                userID: req.params.userid,
            });

            post.save();
            res.redirect("/home");
        }, 500);

    } else {
        res.redirect("/posts/" + req.params.userid + "/new");
    }
}

const deletePost = async (req, res) => {
    var postid = req.params.postid;
    if (req.isAuthenticated()) {
        await Post.deleteOne({
                _id: postid,
            },
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        );
        res.redirect("/home");
    } else {
        res.redirect("/login");
    }
}
const postPage = async (req, res) => {
    var postid = req.params.postid;
    Post.findOne({
            _id: postid,
        },
        (err, post) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.render("post", {
                    post: post,
                    userid: req.params.userid,
                });
            }
        }
    );
}
const myPosts = async (req, res) => {
    var userid = req.params.userid;
    var postArr;
    if (req.isAuthenticated()) {
        await Post.find({
                userID: userid,
            },
            (err, post) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = post;
                }
            }
        );
        await setTimeout(() => {
            res.render("mypost", {
                posts: postArr,
                userid: req.params.userid,
            });
        }, 500);

    } else {
        res.redirect("/login");
    }
}
module.exports = {
    like,
    comment,
    newPostGet,
    newPost,
    deletePost,
    postPage,
    myPosts
};