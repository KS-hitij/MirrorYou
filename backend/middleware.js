const cloudinary = require("./cloudConfig");
const streamifier = require("streamifier");
const { videoSchema } = require("./schemaValidate");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const os = require("os");
const path = require("path");

const processVideoandThumbnail = async (req, res, next) => {
  try {
    const uploadVideo = req.files["video"]?.[0];
    const uploadThumbnail = req.files["thumbnail"]?.[0];

    if (!uploadVideo) {
      return res.status(400).json({ message: "Please upload a video" });
    }
    if (!uploadThumbnail) {
      return res.status(400).json({ message: "Please upload a thumbnail" });
    }

    const tempDir = os.tmpdir();
    const tempVideoPath = path.join(tempDir, `${Date.now()}_${uploadVideo.originalname}`);
    fs.writeFileSync(tempVideoPath, uploadVideo.buffer);
    const videoResult = await cloudinary.v2.uploader.upload(tempVideoPath, {
      resource_type: "video",
      eager: [
        {
          transformation: [
            { quality: "auto",},
          ],
          format: "m3u8"
        },
      ],
      eager_async: false,
    });

    const hlsObj = videoResult.eager.find(e => e.format === "m3u8");
    const hlsUrl = hlsObj ? hlsObj.secure_url : null;

    fs.unlinkSync(tempVideoPath);

    if (!hlsUrl) {
      console.log(videoResult);
      return res.status(500).json({ message: "Failed to generate adaptive streaming playlist" });
    }

    const thumbnailUpload = new Promise((resolve, reject) => {
      const imageStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, id: result.public_id });
        }
      );
      streamifier.createReadStream(uploadThumbnail.buffer).pipe(imageStream);
    });

    const thumbnailResult = await thumbnailUpload;

    req.body.video = {
      url: hlsUrl,
      public_id: videoResult.public_id,
    };
    req.body.thumbnail = {
      url: thumbnailResult.url,
      public_id: thumbnailResult.id,
    };

    next();
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ message: "Video processing failed", error: err.message });
  }
};


const validateVideo = async (req, res, next) => {
  try {
    let { error } = videoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details
      })
    }
    next();
  } catch (err) {
    next(err);
  }
}

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User Must LogIn Or SignUp" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ mail: decoded.mail });
    if (!user) {
      return res.status(401).json({ message: "User Must LogIn Or SignUp" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const processUserProfile = async (req, res, next) => {
  const profile = req.files["profileLogo"]?.[0];
  if (!profile) {
    next();
  }
  try {
    const profileUpload = new Promise((resolve, reject) => {
      const imageStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.url, id: result.public_id });
        }
      );
      streamifier.createReadStream(profile.buffer).pipe(imageStream);
    });
    const profileResult = await Promise.all([profileUpload]);
    req.body.profileLogo = profileResult[0].url;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { validateVideo, processVideoandThumbnail, authenticate, processUserProfile };