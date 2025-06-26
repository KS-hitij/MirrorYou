const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");


module.exports.signUp = async (req,res)=>{
    let {name,mail,password,profileLogo} = req.body;
    let newUser={
        name:name,
        mail: mail,
        password: password,
    }
    if(profileLogo){
        newUser.profileLogo = profileLogo;
    }
    let createdUser = new User(newUser);
    await createdUser.save();
    let token = jwt.sign({mail},process.env.JWT_SECRET,{expiresIn:"10 days"});
    res.clearCookie("token");
    res.cookie("token",token,{
        httpOnly: true,
        maxAge: 10*24*60*60*1000
    });
    res.send("Success");
}

module.exports.logIn = async(req,res)=>{
    const {mail_name,password} = req.body;
    let user =await User.findOne({mail:mail_name});
    if(!user){
        user = await User.findOne({name:mail_name});
    }
    if(!user){
        return res.status(401).json({message:"Email Or Password Is Incorrect."});
    }
    const result = await bcrypt.compare(password, user.password);
    if(!result){
        return res.status(401).json({message:"Email Or Password Is Incorrect."});
    }
    let token = jwt.sign({mail:user.mail},process.env.JWT_SECRET,{expiresIn:"10 days"});
    res.clearCookie("token");
    res.cookie("token",token,{
        httpOnly: true,
        maxAge: 10*24*60*60*1000
    });
    res.send("LogIn success");
}

module.exports.logOut = async (req,res)=>{
    res.clearCookie("token",{
        httpOnly:true
    });
    res.send("Success");
}

module.exports.getUserData = async (req,res)=>{
    if(!req.user){
        res.status(401);
        res.send("No user");
    }
    const currUser = req.user;
    res.send(currUser);
}

module.exports.subscribe = async (req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction()
    try{
        const token = req.cookies.token;
        const ownerId = req.params;
        if(!token){
            throw new Error();
        }
        const user = req.user;
        const owner = await User.findById(ownerId);
        if(user._id.equals(owner._id)){
            throw new Error("Can not subscribe to self");
        }
        if (user.subscribedChannels.some(id => id.equals(owner._id))) {
            throw new Error("Already Subscribed");
        }
        if(!owner){
            throw new Error("Channel not found");
        }
        user.subscribedChannels.push(owner._id);
        owner.subscribers = (owner.subscribers || 0)+1;
        await user.save();
        await owner.save();
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({message:"Success"});
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        throw new Error(err);
    }
}

module.exports.getProfileData = async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    res.send(user);
}