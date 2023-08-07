const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../lib/comment');
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

let token;

describe("/posts", () => {
  beforeAll( async () => {
    const user = new User({email: "test@test.com", password: "12345678", username: "myusername", profilePic: "mypic.jpg"});
    user.save(err => {
      
    })
    userId = user._id;
    token = JWT.sign({
      user_id: user.id,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - (5 * 60),
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + (10 * 60)
    }, secret);
  });

  afterEach( async () => {
    //await User.deleteMany({});
    await Post.deleteMany({});
  })

  // afterAll( async () => {
  //   await User.deleteMany({});
  //  })

  describe("POST, when token is present", () => {
    test("responds with a 201", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      expect(response.status).toEqual(201);
    });
  
    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", image:"picture.jpg", comments:[], token: token });
      let posts = await Post.find().lean();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("hello world");
      expect(posts[0].image).toEqual("picture.jpg");
      expect(posts[0].comments).toEqual([]);
    });
  
    test("returns a new token", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token })
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    });  
  });
  
  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.status).toEqual(401);
    });
  
    test("a post is not created", async () => {
      await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      let posts = await Post.find();
      expect(posts.length).toEqual(0);
    });
  
    test("a token is not returned", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.body.token).toEqual(undefined);
    });
  })

  describe("GET, when token is present", () => {
    test("returns every post in the collection", async () => {
    await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "second world", image: "picture.jpg", token: token });
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      let messages = response.body.posts.map((post) => ( post.message ));
      expect(messages).toEqual(["new world", "second world"]);
    })
  });

    test("the response code is 200", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      expect(response.status).toEqual(200);
    })

    test("returns a new token", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({token: token});
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    })
  

  describe("GET, when token is missing", () => {
    test("returns no posts", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let response = await request(app)
        .get("/posts");
      expect(response.body.posts).toEqual(undefined);
    })
  });

    test("the response code is 401", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let response = await request(app)
        .get("/posts");
      expect(response.status).toEqual(401);
    })

  
  describe("Patch for comments, when token is present", () => {
    test("updates correct post collection", async () => {
      const commentText = "Test Text";
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let posts = await Post.find();
      const comment = { text: commentText};
      await request(app)
        .patch(`/posts/${posts[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({comments: comment ,token: token});
      posts = await Post.find();
      expect(posts[posts.length-1].comments[0].text).toEqual(commentText);;
    })
  })

  describe("Patch for comments, when token is not present", () => {
    test("the response code is 401", async () => {
      const comment = {"text": "Test Text"};
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let posts = await Post.find();
      let response = await request(app)
        .patch(`/posts/${posts[posts.length -1]._id}`)
        .send({ id: posts[0]._id, comments: comment ,token: token});
      expect(response.status).toEqual(401);
    })
  })

  describe("Patch, when id passed as param", () => {
    test("returns 201 and comment length to equal 1", async () => {
      const comment = {"text": "Test Text"};
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let posts = await Post.find();
      let response = await request(app)
        .patch(`/posts/${posts[posts.length -1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({comments: comment ,token: token});
      let secondPosts = await Post.find();
      expect(response.status).toEqual(201);
      expect(secondPosts[0].comments.length).toEqual(1);
    })
  })

  // describe("Patch, test datetime creation", () => {
  //   test("returns the date and time when comment was created", async () => {
  //     const comment = {"text": "Test Text"};
  //     await request(app)
  //     .post("/posts")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ message: "new world", image: "picture.jpg", token: token });
  //     let posts = await Post.find();
  //     let response = await request(app)
  //       .patch(`/posts/${posts[posts.length -1]._id}`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({comments: comment ,token: token});
  //     let secondPosts = await Post.find();
  //     const lastPost = secondPosts[secondPosts.length - 1];
  //     const lastComment = lastPost.comments[lastPost.comments.length - 1];
  //     console.log("DATE", lastComment.commentDate);
  //     expect(lastComment.commentDate.getHours()).toEqual(18);
  //     expect(response.status).toEqual(201);
  //     expect(lastPost.comments.length).toEqual(1);
  //   })
  // })

  describe("Patch for likes, when token is present", () => {
    test("updates likes count in correct post collection", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let posts = await Post.find();
      let response = await request(app)
      .patch(`/posts/${posts[posts.length -1]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({likes: 10 ,token: token});
      posts = await Post.find();
      expect(posts[0].likes).toEqual(10);
    })
  })

  describe("Patch for likes, when token is not present", () => {
    test("return status 401", async () => {
      await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let posts = await Post.find();
      let response = await request(app)
      .patch(`/posts/${posts[posts.length -1]._id}`)
        .send({likes: 10 ,token: token});
      posts = await Post.find();
      expect(posts[0].likes).toEqual(0);
      expect(response.status).toEqual(401);
    })
  })
});

//when user authenticated, post is created and associated with User

  test("creates a new post associated with user", async () => {
    await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "hello world", image:"picture.jpg",  token: token });
    let posts = await Post.find();
    expect(posts.length).toEqual(1);
    expect(posts[posts.length -1].message).toEqual("hello world");
    expect(posts[posts.length -1].image).toEqual("picture.jpg");
    expect(posts[posts.length -1].user.toString()).toEqual(userId.toString());
});


//test get post with user details 
  test("gets post with username and profilePic", async () => {
    await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ message: "new world", image: "picture.jpg", token: token });
    
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toEqual(200);
    const posts = response.body.posts;
    const lastPostUser = posts[posts.length - 1]
    expect(lastPostUser.user.username).toEqual("myusername");
    expect(lastPostUser.user.profilePic).toEqual("mypic.jpg");
});

