const multer = require("multer");
const storage = multer.memoryStorage();
const fileFilter=(req,file,cb)=>{
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/x-matroska','video/quicktime',"image/jpeg",
    "image/png","image/jpg",];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({
    storage:storage,fileFilter:fileFilter,
    limits: {
        fileSize:900 * 1024 * 1024
    }

});
module.exports = upload;
