var mongoose = require("mongoose");

require("../mongodb_helper");
var Post = require("../../models/post");

describe("Post model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.posts.drop(() => {
      done();
    });
  });

  it("has a message", () => {
    var post = new Post({ message: "some message" });
    expect(post.message).toEqual("some message");
  });

  it("has an email", () => {
    var post = new Post({ message: "some message" , email: "an email"});
    expect(post.email).toEqual("an email");
  });

  it("has a like count", () => {
    var post = new Post({ message: "some message" , email: "an email"});
    expect(post.likes).toEqual(0);
  });

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
    });
  });
  
    it("can list all posts by email", async() => {
      let post1 = new Post({message: "howdy!", email: "username@gmail.com"});
      await post1.save();
      let post2 = new Post({message: "hola!", email: "random@gmail.com"});
      await post2.save();
      await Post.find({email: "username@gmail.com"}, (err, posts) => {
        expect(err).toBeNull();
        expect(posts.length).toEqual(1);
        expect(posts[0].message).toEqual("howdy!");
      });
  
  });

  it("can save a post", (done) => {
    var post = new Post({ message: "some message" });

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        expect(posts[0]).toMatchObject({ message: "some message" });
        done();
        
      });
    });
  });
});
