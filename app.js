//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
var postArr;

//<----------------------------Boilerplate Code---------------------------------->
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//<----------------------------Schemas for mongoDB---------------------------------->

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    likedPosts: [String],
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            username: profile.displayName
        }, function (err, user) {
            return cb(err, user);
        });
    }
));

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: String,
    likes: Number,
    comments: [{
        body: String,
        date: Date,
    }, ],
    date: {
        type: Date,
        default: Date.now,
    },
    userID: String,
});

const Post = new mongoose.model("Post", postSchema);



//<----------------------------Port Initialisation---------------------------------->
app.listen(process.env.PORT || 3000);



//<----------------------------Get Requests---------------------------------->

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ["profile"]
}));

app.get('/auth/google/home',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/home');
    });

app.get("/home", async (req, res) => {
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
});

app.get("/posts/:userid/new", async (req, res) => {
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
});

app.get("/posts/:userid/myposts", async (req, res) => {
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
        setTimeout(() => {
            res.render("mypost", {
                posts: postArr,
                userid: req.params.userid,
            });
        }, 500);

    } else {
        res.redirect("/login");
    }
});

app.get("/posts/:postid/:userid", (req, res) => {
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
});

app.get("/user/:userid/:visitorid/profile", async (req, res) => {
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

});
app.get("/posts/:userid/:postid/edit", async (req, res) => {
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
});



//<----------------------------Post Requests---------------------------------->

app.post("/posts/:postid/:userid/like", async (req, res) => {
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
});

app.post("/posts/:postid/:userid/comment", async (req, res) => {
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
});
app.post("/posts/:postid/edit", async (req, res) => {
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
});
app.post("/posts/:userid/new", async (req, res) => {
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
});

app.post("/posts/:postid/delete", async (req, res) => {
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
});

app.post("/register", (req, res) => {
    User.register({
            username: req.body.username,
        },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/home");
                });
            }
        }
    );
});

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/home");
            });
        }
    });
});