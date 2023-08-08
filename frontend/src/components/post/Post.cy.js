import Post from './Post'

describe("Post", () => {
  it('renders a post with a message', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world"}} />);
    cy.get('[data-cy="post"]').should('contain.text', "Hello, world")
  })
  it('renders a commentForm', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world"}} />);
    cy.get('[data-cy="submit-comment"]').should('exist');
    cy.get('[data-cy="comment-text"]').should('exist');
  })
})

describe("submitComment" ,() => {
  it('fetches patch /posts with correct, datetime, authorid, message and postID', () => {
    cy.intercept('GET', '/@me', {
      statusCode: 200,
      body: {username: "Barry123"}
    });
    cy.intercept('POST', '/posts/15', {
      statusCode: 200
    }).as('post-posts');
    let mockDate = new Date(2023, 5, 27, 9, 56, 16);
    cy.clock(mockDate)
    cy.mount(<Post post={{_id: 15, message: "Hello, world"}} />);
    cy.get('[data-cy="comment-text"]').type("I am a comment");
    cy.get('[data-cy="submit-comment"]').click();
    cy.wait("@post-posts").then((interception) =>{ 
      const requestbody = JSON.parse(interception.request.body);
      expect(requestbody.comments.authorName).to.eq('Barry123');
      expect(requestbody.comments.text).to.eq("I am a comment");
    })

  })
})
