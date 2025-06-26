const { required } = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    video_id:{
        type: mongoose.Schema.ObjectId,
        ref:"Video",
        required:true
    },
    user:{
        id:{
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        profileLogo:{
            type:"String"
        }
    },
    commentText:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    reply:[{
        type:mongoose.Schema.ObjectId,
        ref:"Comment"
    }],
    parentComment:{
        type:mongoose.Schema.ObjectId,
        ref:"Comment",
        default:null
    }
})
module.exports = mongoose.model("Comment",commentSchema);