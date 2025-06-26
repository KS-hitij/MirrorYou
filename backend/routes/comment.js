const wrapasync = require("../wrapasync");
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware");


//route for getting comments
router.get("/:videoId",wrapasync(commentController.getComments));

//route for posting comments
router.post("/:videoId",authenticate,wrapasync(commentController.postComment));

//route for posting reply
router.post("/reply/:videoId/:parentCommentId",authenticate,wrapasync(commentController.postReply));

//route for getting replies
router.get("/reply/:commentId",wrapasync(commentController.getReplies));

module.exports = router;