
import {Feed }from './Feed'
import { CreatePost } from './Feed'

const navigate = () => {}
let token = window.localStorage.setItem("token", "fakeToken");


describe("Feed", () => {
  it("Calls the /posts endpoint and lists all the posts", () => {
    window.localStorage.setItem("token", "fakeToken");

    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 1 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.mount(<Feed navigate={navigate} />);

    cy.wait("@getPosts").then(() => {
      cy.get('[data-cy="post"]')
        .should("contain.text", "Hello again, world")
        .and("contain.text", "Hello, world");
    });
  });

  it("Calls the PATCH /posts endpoint and increments like count", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.mount(<Feed navigate={navigate} />);
    cy.get('[class="like-btn-1"]').click().then(() => {
      cy.wait(500).then(() => {
        cy.get('[data-cy="post"]')
      .should("contain.text", "Hello, world")
      .and("contain.text", "Hello again, world");
      })
    });
    

  });

  it("Calls the PATCH /posts endpoint and increments like count for both messages", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.intercept("PATCH", "/posts/2", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patch2Posts");

    cy.mount(<Feed navigate={navigate} />);
    cy.wait("@getPosts").then(()=>{
      cy.wait(500).then(() => {
        cy.get('[class="like-btn-1"]').click();
        cy.get('[class="like-btn-2"]').click();
      })
    }).then(() => {
      cy.wait(500).then(() => {
        cy.get('[data-cy="post"]').should("contain.text", "Hello, world");
        cy.get('[data-cy="post"]').should("contain.text", "Hello again, world");
      })
    });
  });

  it("Calls the PATCH /posts endpoint and increments like count twice", () => {
    window.localStorage.setItem("token", "fakeToken");
    cy.intercept("GET", "/posts", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          posts: [
            { _id: 1, message: "Hello, world", likes: 2 },
            { _id: 2, message: "Hello again, world", likes: 2 },
          ],
        },
      });
    }).as("getPosts");

    cy.intercept("PATCH", "/posts/1", (req) => {
      req.reply({
        statusCode: 200,
        body: { likes: 3 },
      });
    }).as("patchPosts");

    cy.mount(<Feed navigate={navigate} />);
    cy.wait("@getPosts");
    cy.get('[class="like-btn-1"]').click();
    cy.wait("@patchPosts");
    cy.get('[class="like-btn-1"]').click();
    cy.wait("@patchPosts");
    cy.get('[class="like-btn-1"]').click();
    cy.wait("@patchPosts");

    cy.get('[data-cy="post"]')
      .should("contain.text", "Hello again, world")
      .and("contain.text", "Hello, world");
  });
});


describe("CreatePost",() =>{
  it ("submits a new post in Text", ()=>{
    //set fake token to simulate authentication
    window.localStorage.setItem("token","fakeToken")
    //mock the successful response
    cy.intercept('POST', '/posts',(req) =>{
        req.reply({
          statusCode: 201, 
          body:{ message: "OK" , token: "newFakeToken"},
        });
      }).as("submitPost");

    //passing fake props to CreatePost
    cy.mount(< Feed navigate={navigate}/>);
  //text  in input field, then click submit (\)for indicate its nota  closing '
  cy.get('[placeholder="What\'s on your mind today?"]').type("This is a new post");
  cy.contains("Submit").click();

  cy.wait("@submitPost").its('response.statusCode')
  .should('eq',201);
  cy.get('[data-cy="post"]')
  .should('contain.text', "This is a new post");
  })
});

describe("CreastePost with no content",() =>{
  it("return msg There is no content!", ()=> {
    window.localStorage.setItem("token","fakeToken")

    cy.mount(< Feed navigate={navigate}/>);

    // cy.get('[placeholder="What\'s on your mind today?"]').type("");
    // cy.get('[placeholder="Image URL"]').type("");
    cy.contains("Submit").click();

    // cy.wait("@submitPost").then(()=>{
    cy.get('[data-cy="post"]')
      .should('contain.text',"There is no content!");
    });
  });
