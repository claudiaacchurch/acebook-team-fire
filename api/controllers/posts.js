const Post = require("../models/post");
const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");

const PostsController = {
  Index: async (req, res) => {
    const posts = await Post.find()
    const postWithUserDetails = await Promise.all(posts.map(async post => {
      const user = await User.findById(post.user);
      console.log(post.user)
      return { 
        message: post.message,
        image: post.image,
        likes: post.likes,
        user: {id: user.id, username: user.username, profilePic: user.profilePic} };
    }));
    const token = TokenGenerator.jsonwebtoken(req.user_id);
    res.status(200).json({ posts: postWithUserDetails, token: token });
  },

  Create: (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "")
  const {user_id: userId}= TokenGenerator.verify(token)
  const postData = { ...req.body, user: userId };
  const post = new Post(postData);
  post.save((err) => {
    if (err) {
      throw err;
    }

    const token = TokenGenerator.jsonwebtoken(req.user_id)
    res.status(201).json({ message: 'OK', token: token });
  });
}};

module.exports = PostsController;
