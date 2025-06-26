const wrapasync = require("../wrapasync");
const { validateVideo, processVideoandThumbnail, authenticate } = require("../middleware");
const upload = require("../multer");
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

//route for home videos
router.get("/", wrapasync(videoController.getAllVideos));

//route for searching
router.get("/search", wrapasync(videoController.searchVideo));


//route for getting interactions of user and a video
router.get("/interactions/:id", authenticate, wrapasync(videoController.getInteractions));

//route for getting info of a video
router.get("/info/:id", wrapasync(videoController.getVideoInfo));

//route for registering a view
router.post("/registerView/:id", authenticate, wrapasync(videoController.registerView));

//route for uploading video
router.post("/upload", authenticate, upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), validateVideo, processVideoandThumbnail, wrapasync(videoController.uploadVideo));


//update route for updating video details
router.put("/:id", authenticate, wrapasync(videoController.updateVideo));

//route for deleting a video
router.delete("/delete/:id", authenticate, wrapasync(videoController.deleteVideo));

//route for liking a video
router.post("/like/:id", authenticate, wrapasync(videoController.likeVideo));


//route for disliking a video
router.post("/dislike/:id", authenticate, wrapasync(videoController.dislikeVideo));

module.exports = router;