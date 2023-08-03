const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  image: String,
  comments:[]
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
