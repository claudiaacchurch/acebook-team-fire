const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: { type: String, required: true },
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  likes: {type: Number, default: 0},
  comments: [
    {
      authorId: { type: String},
      text: { type: String},
      commentDate: { type: Date }
    }
  ]
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
