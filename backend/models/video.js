const { required } = require("joi");
const mongoose = require("mongoose");
const video = new mongoose.Schema({
    title: String,
    desc: String,
    tags:[String],
    likes: {
        type:Number,
        default:0,
        min:0
    },
    dislikes: {
        type:Number,
        default:0,
        min:0
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    video: {
        url:{type:String,required:true,unique:true},
        public_id: {type:String,required:true}
    },
    thumbnail:{
        url:{type:String,required:true},
        public_id: {type:String,required:true}
    },
    views:{
        type:Number,
        default:0
    },
    owner:{
        name:{
            type: String,
            required:true
        },
        id:{
            type: mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        profile:{
            type: String
        }
    }
})

module.exports= mongoose.model("Video",video);