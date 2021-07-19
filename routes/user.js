var express = require('express');
var router = express.Router();

const {userPage} = require("../controllers/userController");


router.route("/:userid/:visitorid/profile").get(userPage);



module.exports=router;