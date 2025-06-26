const mongoose = require("mongoose");
const videoInteractionSchema = new mongoose.Schema({
    videoId:{
        type: mongoose.Schema.ObjectId,
        ref:"Video",
        required:true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    reaction:{
        type: String,
        enum:["like","dislike","none"],
        default:"none"
    }
});
videoInteractionSchema.index({userId:1, videoId:1},{unique:true});
module.exports = mongoose.model("VideoInteraction",videoInteractionSchema);