const express = require("express");
const monoogose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");

var postArr =[];

const home = async (req, res) => {
    if (req.isAuthenticated()) {



        //Filtering algorithm

        if (req.query.filter == "liked") {
            postArr = [];
            var likedArr = req.user.likedPosts;
            likedArr.forEach(async (postid) => {
                await Post.findOne({
                        _id: postid,
                    },
                    (err, pst) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (pst != null) {
                                postArr.push(pst);
                            }
                        }
                    }
                );
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);

        } else if (req.query.filter == "today") {
            postArr = [];
            var tempPostArr = [];
            var today = new Date();
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    tempPostArr = posts;
                }
            });
            tempPostArr.forEach(post => {
                if (post.date.getFullYear() == today.getFullYear() &&
                    post.date.getMonth() == today.getMonth() &&
                    post.date.getDate() == today.getDate()) {
                    postArr.push(post);
                }
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "dateasc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "datedsc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.date < b.date) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "likesasc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.likes > b.likes) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "likesdsc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.likes < b.likes) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "commentsasc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.comments.length > b.comments.length) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else if (req.query.sort == "commentsdsc") {
            postArr = [];
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                }
            });
            postArr.sort((a, b) => {
                if (a.comments.length < b.comments.length) {
                    return -1;
                }
                return 0;
            });
            setTimeout(() => {
                res.render("home", {
                    posts: postArr,
                    user: req.user,
                });
            }, 500);
        } else {
            await Post.find({}, (err, posts) => {
                if (err) {
                    console.log(err);
                } else {
                    postArr = posts;
                    res.render("home", {
                        posts: postArr,
                        user: req.user,
                    });
                }
            });
        }
    } else {
        res.redirect("/login");
    }
}

module.exports = {home};