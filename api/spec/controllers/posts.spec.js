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
    await user.save();
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

  
  describe("Patch, when token is present", () => {
    test("updates correct post collection", async () => {
      let comment = new Comment("Test Text");
       await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", comments: comment, token: token });
      let posts = await Post.find();
      let response = await request(app)
        .patch("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: posts[0]._id, comments: comment ,token: token});
      posts = await Post.find();
      expect(posts[0].comments[0]).toEqual(comment);;
    })
  })

  describe("Patch, when token is not present", () => {
    test("the response code is 401", async () => {
      let comment = new Comment("Test Text");
       await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", comments: comment, token: token });
      let posts = await Post.find();
      let response = await request(app)
        .patch("/posts")
        .send({ id: posts[0]._id, comments: comment ,token: token});
      expect(response.status).toEqual(401);
    })
  })

  describe("Patch, when no id is present", () => {
    test("returns 400 error with no id present message", async () => {
     let comment = new Comment("Test Text");
       await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", token: token });
      let response = await request(app)
        .patch("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({comments: comment ,token: token});
      posts = await Post.find();
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("id not present");
      expect(posts[0].comments.length).toEqual(0);
    })
  })

  describe("Patch, when collection property does not exist", () => {
    test("returns 400 error with property not found message", async () => {
      let comment = new Comment("Test Text");
       await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "new world", image: "picture.jpg", comments: comment, token: token });
      let response = await request(app)
        .patch("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({id: "456", giraffe: 'giraffe',token: token});
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("property not found");
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
    const lastPost = posts[posts.length - 1];
    const lastPostUser = lastPost.user;
    console.log(posts)
    console.log('Last post user details:', lastPostUser);
    expect(lastPostUser.username).toEqual("myusername");
    expect(lastPostUser.profilePic).toEqual("mypic.jpg");
});

