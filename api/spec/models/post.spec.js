var mongoose = require("mongoose");
const User = require('../../models/user');
require("../mongodb_helper");
var Post = require("../../models/post");

describe("Post model", () => {
  let userId;

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    const user = new User({ email: "an email", password: "password", username: "username" });
    await user.save();
    userId = user._id;
  });

  it("has a user", () => {
    var post = new Post({ message: "some message", user: userId });
    expect(post.user.toString()).toEqual(userId.toString());
  });

  it("has a message", () => {
    var post = new Post({ message: "some message", user: userId });
    expect(post.message).toEqual("some message");
  });

  it("has a like count", () => {
    var post = new Post({ message: "some message", user: userId });
    expect(post.likes).toEqual(0);
  });

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
    });
  });

  it("can list all posts by user", async () => {
    let post1 = new Post({ message: "howdy!", user: userId });
    await post1.save();
    let post2 = new Post({ message: "hola!", user: new User()._id });
    await post2.save();
    await Post.find({ user: userId }, (err, posts) => {
      expect(err).toBeNull();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("howdy!");
    });
  });

  it("can save a post", (done) => {
    var post = new Post({ message: "some message", user: userId });

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(posts[posts.length -1].message).toEqual("some message");
        expect(posts[posts.length -1].user.toString()).toEqual(userId.toString());
        done();
      });
    });
  });
});
