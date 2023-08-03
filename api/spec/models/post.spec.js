var mongoose = require("mongoose");

require("../mongodb_helper");
var Post = require("../../models/post");
const { ObjectID } = require("mongodb");

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

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
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
  test("updates by ID", async () => {
    let post1 = new Post({message: "howdy!"});
    comment = {text: "test"};
    await post1.save();
    posts = await Post.find();
    await Post.updateOne({ _id: posts[0]._id }, { $push: { comments: comment } })
    posts = await Post.find();
    expect(posts[0].comments[0]).toEqual(comment);;
  })
});


