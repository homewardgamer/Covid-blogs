var express = require('express');
var router = express.Router();

const {
    like,
    comment,
    newPostGet,
    newPost,
    deletePost,
    postPage,
    myPosts
} = require("../controllers/postController");

const {
    editGet,
    editPost
} = require("../controllers/editController");

router.route("/:postid/:userid/like").post(like);
router.route("/:postid/:userid/comment").post(comment);
router.route("/:userid/new").get(newPostGet).post(newPost);
router.route("/:postid/delete").post(deletePost);
router.route("/:postid/edit").post(editPost);
router.route("/:userid/:postid/edit").get(editGet);
router.route("/:postid/:userid").get(postPage);
router.route("/:userid/myposts").get(myPosts);




module.exports = router;