const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const videoRouter = require("./routes/video");
const userRouter = require("./routes/user");
const commentRouter = require("./routes/comment");
const cookieParser = require('cookie-parser');
const cors = require("cors");

mongoose.connect('mongodb://127.0.0.1:27017/MirrorYouTest')
.then(() => console.log('Connected!'));

app.use(express.json({limit:"900mb"}));
app.use(express.urlencoded({ extended: true,limit:"900mb"}));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());

app.use("/videos", videoRouter);
app.use("/user",userRouter);
app.use("/comment",commentRouter);


//global error handler
app.use((err, req, res, next) => {
  if(err.code === 11000){
    res.status(500).json({
      error: "User Already Exits"
    });
  }
  console.log(err);
  res.status(500).json({
    error: err.message || "Something went wrong"
  });
});

app.listen(port,()=>{
    console.log("Server Listening");
});