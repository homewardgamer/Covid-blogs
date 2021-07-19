const express = require("express");
const mongoose = require("mongoose");


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


module.exports =Post;