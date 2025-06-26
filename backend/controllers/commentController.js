const Comment = require("../models/comment");
const mongoose = require("mongoose");

module.exports.getComments= async(req,res)=>{
    const {videoId} = req.params;
    const comments = await Comment.find({video_id:videoId,parentComment:null});
    return res.status(200).json({comments});
}

module.exports.postComment = async(req,res)=>{
    const {videoId} = req.params;
    const {commentContent} = req.body;
    const comment = {
        video_id:videoId,
        user:{
            id:req.user._id,
            name:req.user.name,
        },
        commentText:commentContent,
        parentComment:null
    };
    if(req.user.profileLogo.length>0){
        comment["profileLogo"] = req.user.profileLogo;
    }
    const newComment = new Comment(comment);
    await newComment.save();
    res.status(201).json({message:"Comment Posted"});
}

module.exports.postReply = async(req,res)=>{
    const {parentCommentId,videoId} = req.params;
    const parentComment = await Comment.findById(parentCommentId);
    const {replyContent} = req.body;
    const reply = {
        video_id:videoId,
        user:{
            id:req.user._id,
            name:req.user.name
        },
        commentText:replyContent,
        parentComment:parentCommentId
    };
    const newReply = new Comment(reply);
    parentComment.reply.push(newReply._id);
    await newReply.save();
    await parentComment.save();
    res.status(201).json({message:"Reply posted"});
}

module.exports.getReplies = async(req,res)=>{
    const {commentId} = req.params;
    const id = new mongoose.Types.ObjectId(commentId);
    let comment = await Comment.findById(id);
    if(!comment){
        return res.status(404).json({ message: "Comment not found" });
    }
    if(comment.reply.length>0){
        comment = await comment.populate("reply");
        res.status(200).json({replies:comment.reply});
    }else{
        res.status(200).json({message:"No replies"});
    }
}