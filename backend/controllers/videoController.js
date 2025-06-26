const Video = require("../models/video");
const User = require("../models/user");
const VideoInteraction = require("../models/videoInteraction");
const cloudinary = require("../cloudConfig");
const mongoose = require("mongoose");


module.exports.getAllVideos = async (req, res) => {
  const allVideos = await Video.find();
  res.send(allVideos);
}

module.exports.searchVideo = async (req, res) => {
  const { title } = req.query;
  if (title) {
    const videos = await Video.find({
      title: { $regex: new RegExp(title, "i") }
    });
    res.send(videos);
  } else {
    const videos = await Video.find();
    res.send(videos);
  }
}

module.exports.getInteractions = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const user = req.user;
  const interactions = await VideoInteraction.findOne({ userId: user._id, videoId: id }).lean();
  const owner = await User.findOne({ videosPublished: id });
  res.json({
    interactions: interactions,
    owner: owner
  });
}

module.exports.getVideoInfo = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const video = await Video.findById(id);
  res.send(video);
}

module.exports.registerView = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const result = await VideoInteraction.findOne({userId:userId,videoId:id});
  if(!result){
    const intreactionBody = {
        videoId:id,
        userId:userId,
    }
    const newInteraction = VideoInteraction(intreactionBody);
    newInteraction.save();
    await Video.findOneAndUpdate({_id:id},{$inc:{views:1}});
  }else{
    result.timestamp = new Date();
    await result.save();
  }
  res.status(200).json({ messagae: "success" });
}

module.exports.uploadVideo = async (req, res) => {
  const owner = {
    id: req.user._id,
    name: req.user.name
  };
  if (req.user.profileLogo) {
    owner.profile = req.user.profileLogo;
  }
  const videoupload = {
    desc: req.body.desc,
    title: req.body.title,
    tags: req.body.tags,
    video: req.body.video,
    thumbnail: req.body.thumbnail,
    owner
  };
  const newVideo = Video(videoupload);
  await newVideo.save();
  const user = req.user;
  user.videosPublished = [...user.videosPublished, { id: newVideo._id, name: newVideo.name, thumbnail: newVideo.thumbnail.url }];
  await user.save();
  res.json({message:"success"}).status(201);
}

module.exports.updateVideo = async (req, res) => {
  const updatedData = req.body;
  const updatedVideo = await Video.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
  if (!updatedVideo) {
    return res.status(404).json({ message: "Video not found" });
  }
  const publishedVideo = req.user.videosPublished.find(v => v.id.equals(req.params.id));
  if (publishedVideo) {
    if (updatedData.title) publishedVideo.name = updatedData.title;
    if (updatedData.thumbnail?.url) publishedVideo.thumbnail = updatedData.thumbnail.url;
    await req.user.save();
  }
  res.json(updatedVideo);
}

module.exports.deleteVideo = async (req, res) => {
  const videoDelete = await Video.findById(req.params.id);
  if (videoDelete.owner.id != req.user.id) {
    throw new Error("You are not owner of the video");
    return;
  }
  let video_id = videoDelete.video.public_id;
  let thumbnail_id = videoDelete.thumbnail.public_id;
  await cloudinary.v2.uploader.destroy(video_id, { resource_type: "video" });
  await cloudinary.v2.uploader.destroy(thumbnail_id, { resource_type: "image" });
  await videoDelete.deleteOne();
  res.send("Video Deleted");
}

module.exports.likeVideo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const existingInteraction = await VideoInteraction.findOne({ userId, videoId: id });
    let incLikes = 0;
    let incDislikes = 0;
    if (!existingInteraction || existingInteraction.reaction==="none") {
      incLikes = 1;
    } else if (existingInteraction.reaction === "dislike") {
      incLikes = 1;
      incDislikes = -1;
    } else if (existingInteraction.reaction === "like") {
      incLikes = -1;
      const videoInteraction = await VideoInteraction.findOneAndUpdate(
        { userId, videoId: id }, { reaction: "none", timestamp: new Date() }, { new: true, upsert: true, setDefaultsOnInsert: true });

      const video = await Video.findByIdAndUpdate(id, { $inc: { likes: incLikes, dislikes: incDislikes } }, { new: true });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ videoInteraction, video });
    }
    const videoInteraction = await VideoInteraction.findOneAndUpdate(
      { userId, videoId: id }, { reaction: "like", timestamp: new Date() }, { new: true, upsert: true, setDefaultsOnInsert: true });

    const video = await Video.findByIdAndUpdate(id, { $inc: { likes: incLikes, dislikes: incDislikes } }, { new: true });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ videoInteraction, video });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
}

module.exports.dislikeVideo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const existingInteraction = await VideoInteraction.findOne({ userId, videoId: id });
    let incLikes = 0;
    let incDislikes = 0;
    if (!existingInteraction || existingInteraction.reaction==="none") {
      incDislikes = 1;
    } else if (existingInteraction.reaction === "dislike") {
      incDislikes = -1;
      const videoInteraction = await VideoInteraction.findOneAndUpdate(
        { userId, videoId: id }, { reaction: "none", timestamp: new Date() }, { new: true, upsert: true, setDefaultsOnInsert: true });

      const video = await Video.findByIdAndUpdate(id, { $inc: { likes: incLikes, dislikes: incDislikes } }, { new: true });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ videoInteraction, video });
    } else if (existingInteraction.reaction === "like") {
      incLikes = -1;
      incDislikes = 1;
    }
    const videoInteraction = await VideoInteraction.findOneAndUpdate(
      { userId, videoId: id }, { reaction: "dislike", timestamp: new Date() }, { new: true, upsert: true, setDefaultsOnInsert: true });
    const video = await Video.findByIdAndUpdate(id, { $inc: { likes: incLikes, dislikes: incDislikes } }, { new: true });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ videoInteraction, video });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
}