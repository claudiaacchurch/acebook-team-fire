const Post = require("../models/post");
const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");

const PostsController = {
  Index: async (req, res) => {
    const posts = await Post.find()
    const postWithUserDetails = await Promise.all(posts.map(async post => {
      const user = await User.findById(post.user);
      return { 
        _id: post._id,
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
},

UpdateById: (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const { user_id: authorId } = TokenGenerator.verify(token);
  const postId = req.params.id; 
  if (req.body.hasOwnProperty('comments')) {
    const comment = {
      text: req.body.comments.text,
      authorId: authorId,
      commentDate: new Date()
    };
    Post.updateOne({ _id: postId }, { $push: { comments: comment } }, (err) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: 'OK', token: token });
    });
  } else if (req.body.hasOwnProperty('likes')) {
    Post.updateOne({ _id: postId }, { likes: req.body.likes + 1}, (err) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: 'OK', token: token});
    });
  }
}
};


module.exports = PostsController;
