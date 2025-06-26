const Joi = require("joi");
module.exports.userSchema = Joi.object({
    name: Joi.string().required(),
    mail: Joi.string().required(),
    password: Joi.string().required(),
    subscribers: Joi.number().min(0).default(0),
    subscribedChannels: Joi.array().items(Joi.string().length(24).hex()),
    profileLogo: Joi.string(),
    timestamp: Joi.date().less("now").required(),
    videosPublished: Joi.array().items(Joi.string().length(24).hex())
});

module.exports.commentSchema = Joi.object({
    video_id: Joi.string().length(24).hex().required(),
    user_id: Joi.string().length(24).hex().required(),
    commentText: Joi.string().required(),
    timestamp: Joi.date().less("now").required()
})

module.exports.videoSchema = Joi.object({
    desc: Joi.string().empty("").required().messages({
        "desc": "Description can not be empty",
}),
    title: Joi.string().empty("").max(40).required().messages({
        "title": "Title can not be empty",
}),
    tags: Joi.array().items(Joi.string()),
    likes: Joi.number().min(0).default(0),
    dislikes: Joi.number().min(0).default(0),
    comments: Joi.array().items(Joi.string().length(24).hex()),
    timestamp: Joi.date().less("now"),
    video: Joi.object({
        url: Joi.string().uri(),
        public_id: Joi.string()
    }),
    thumbnail: Joi.object({
        url: Joi.string().uri(),
        public_id: Joi.string()
    }),
    views: Joi.number().min(0).default(0),
    owner:Joi.array().items(Joi.string().length(24).hex())
});