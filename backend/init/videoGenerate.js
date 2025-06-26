const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Video = require("../models/video"); // Make sure the path is correct

mongoose.connect("mongodb://127.0.0.1:27017/MirrorYouTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB.");

    const fakeVideos = [];

    for (let i = 0; i < 10; i++) {
        fakeVideos.push({
            desc: faker.lorem.paragraph(),
            title: faker.lorem.sentence(),
            tags: faker.lorem.words(3).split(" "),
            likes: faker.number.int({ min: 0, max: 1000 }),
            dislikes: faker.number.int({ min: 0, max: 500 }),
            videoUrl: faker.internet.url(),
            thumbnailUrl: faker.image.urlPicsumPhotos({ width: 640, height: 360 }),
            views: faker.number.int({ min: 0, max: 10000 }),
            timestamp: faker.date.past()
        });
    }

    await Video.insertMany(fakeVideos);
    console.log("Fake videos inserted!");

    mongoose.disconnect();
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
