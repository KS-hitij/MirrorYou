const wrapasync = require("../wrapasync");
const express = require("express");
const router  = express.Router();
const upload = require("../multer");
const {authenticate, processUserProfile} = require("../middleware");
const userController = require("../controllers/userController");
require('dotenv').config();

//create route for creating a new route
router.post("/signUp",upload.fields([{name:"profileLogo",maxCount:1}]),
processUserProfile,wrapasync(userController.signUp));

//login route for logging in
router.post("/logIn",wrapasync(userController.logIn));

//logout route
router.post("/logOut",wrapasync(userController.logOut));

//route for getting user's data
router.get("/profile",authenticate,wrapasync(userController.getUserData))

//route for subscribing to a channel
router.post("/subscribe/:ownerId",authenticate,wrapasync(userController.subscribe));

//route for getting a profile info
router.get("/:id",wrapasync(userController.getProfileData));



module.exports = router;