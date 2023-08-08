const Post = require("../models/post");
const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");

const PostsController = {
  Index: async (req, res) => {
    const posts = await Post.find();
    const postWithUserDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.user);
        console.log(post.user);
        return {
          _id: post._id,
          message: post.message,
          image: post.image,
          likes: post.likes,
          user: {
            id: user.id,
            username: user.username,
            profilePic: user?.profilePic,
          },
        };
      })
    );
    const token = TokenGenerator.jsonwebtoken(req.user_id);
    res.status(200).json({ posts: postWithUserDetails, token: token });
  },

  Create: (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { user_id: userId } = TokenGenerator.verify(token);
    const postData = { ...req.body, user: userId };
    const post = new Post(postData);
    post.save((err) => {
      if (err) {
        throw err;
      }

      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token });
    });
  },

  UpdateById: (req, res) => {
    const postId = req.body.id;
    if (req.body.hasOwnProperty("id") === false) {
      res.status(400).json({ message: "id not present" });
    } else {
      if (req.body.hasOwnProperty("comments")) {
        Post.updateOne(
          { _id: postId },
          { $push: { comments: req.body.comments } },
          (err) => {
            if (err) {
              throw err;
            }
            const token = TokenGenerator.jsonwebtoken(req.user_id);
            res.status(201).json({ message: "OK", token: token });
          }
        );
      } else if (req.body.hasOwnProperty("likes")) {
        Post.updateOne({ _id: postId }, { likes: req.body.likes }, (err) => {
          if (err) {
            throw err;
          }
          const token = TokenGenerator.jsonwebtoken(req.user_id);
          res.status(201).json({ message: "OK", token: token });
        });
      } else {
        res.status(400).json({ message: "property not found" });
      }
    }
  },
};

module.exports = PostsController;
