const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  image: String,
  email: {type: String, ref: User}, 
  likes: {type: Number, default: 0}
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
