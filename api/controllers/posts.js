const Post = require("../models/post");
const TokenGenerator = require("../lib/token_generator");

const PostsController = {
  Index: (req, res) => {
    Post.find((err, posts) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ posts: posts, token: token });
    });
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.save((err) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id)
      res.status(201).json({ message: 'OK', token: token });
    });
  },
  UpdateById: (req, res) => {
    const postId = req.body.id;
    if (req.body.hasOwnProperty('id') === false){
      res.status(400).json({ message: 'id not present'});
    } else {
      if (req.body.hasOwnProperty('comments')){
        const comments = req.body.comments;
        Post.updateOne({_id:postId}, {$push:{comments: comments}}, (err) => {
          if (err) {
            throw err;
          }
          const token = TokenGenerator.jsonwebtoken(req.user_id)
          res.status(201).json({ message: 'OK', token: token });
        })
      } else {
        res.status(400).json({ message: 'property not found'});
      }
    }
  }
};

module.exports = PostsController;
