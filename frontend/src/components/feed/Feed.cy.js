import Feed from './Feed'
const navigate = () => {}

let token = window.localStorage.setItem("token", "fakeToken");

describe("Feed", () => {
  it("Calls the /posts endpoint and lists all the posts", () => {
    window.localStorage.setItem("token", "fakeToken")
    
    cy.intercept('GET', '/posts', (req) => {
        req.reply({
          statusCode: 200,
          body: { posts: [
            {_id: 1, message: "Hello, world", likes: 1},
            {_id: 2, message: "Hello again, world", likes: 2}
          ] }
        })
      }
    ).as("getPosts")

    cy.mount(<Feed navigate={navigate}/>)

    cy.wait("@getPosts").then(() =>{
      cy.get('[data-cy="post"]')
      .should('contain.text', "1 Hello, world 1Like")
       .and('contain.text', "2 Hello again, world 2Like")
    })
  })
  it("Calls the PATCH /posts endpoint and increments like count", () => {
    window.localStorage.setItem("token", "fakeToken")
    cy.intercept('GET', '/posts', (req) => {
      req.reply({
        statusCode: 200,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
        body: { posts: [
          {_id: 1, message: "Hello, world", likes: 2},
          {_id: 2, message: "Hello again, world", likes: 2}
        ] }
      })
    }
  ).as("getPosts")

    cy.intercept('PATCH', '/posts/1', (req) => {
        req.reply({
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
          statusCode: 200,
          body: {likes:1}
        })
      }
    ).as("patchPosts")

  
    cy.mount(<Feed navigate={navigate}/>)
    cy.wait("@getPosts");
    cy.get('[class="like-btn-1"]').click();
    cy.wait('@patchPosts', { timeout: 10000 });
    
      cy.get('[data-cy="post"]')
      .should('contain.text', "1 Hello, world 3Like")
       .and('contain.text', "2 Hello again, world 2Like")
    })
  });
