import Post from './Post'

describe("Post", () => {
  it('renders a post with a message', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="post"]').should('contain.text', "Hello, world")
  })
  it('renders a commentForm', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="submit-comment"]').should('exist');
    cy.get('[data-cy="comment-text"]').should('exist');
  })
  
  it('renders a post with a message and likes with have.text', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="post"]')
    .should('have.text', "Hello, world")
  })

  it('checks Like button exists', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('button').should('exist');

  })
})

describe("submitComment" ,() => {
  it('fetches patch /posts with correct, datetime, authorid, message and postID', () => {
    cy.intercept('GET', 'users/@me', {
      statusCode: 200,
      body: {username: "Barry123"}
    });
    cy.intercept('PATCH', 'posts/15', {
      statusCode: 200
    }).as('post-posts');
    let mockDate = new Date(2023, 5, 27, 9, 56, 16);
    cy.clock(mockDate)
    cy.mount(<Post post={{_id: 15, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="comment-text"]').type("I am a comment");
    cy.get('[data-cy="submit-comment"]').click();
    cy.wait("@post-posts").then((interception) =>{
      expect(interception.request.body.comments.authorName).to.eq('Barry123');
      expect(interception.request.body.comments.text).to.eq("I am a comment");
    })
  })
})