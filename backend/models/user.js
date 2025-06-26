const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    mail:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    subscribers:{
        type: Number,
        default: 0
    },
    subscribedChannels: [{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    }],
    profileLogo: String,
    timestamp:{
        type:Date,
        default:Date.now
    },
    recentWatch:[{
        type: mongoose.Schema.ObjectId,
        ref:"Video"
    }],
    videosPublished:[{
        id:{
            type: mongoose.Types.ObjectId,
            ref:"Video"
        },
        name: String,
        thumbnail: String
    }]
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next();
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password,salt);
        this.password = hash;
        next();
    }
    catch(err){
        next(err);
    }
});
module.exports = mongoose.model("User",userSchema);