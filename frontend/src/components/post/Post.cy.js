import Post from './Post'

describe("Post", () => {
  it('renders a post with a message', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5, comments: []}} />);
    cy.get('[data-cy="post"]').should('contain.text', "Hello, world")
  })
  it('renders a commentForm', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5, comments: []}} />);
    cy.get('[data-cy="submit-comment"]').should('exist');
    cy.get('[data-cy="comment-text"]').should('exist');
  })
  
  it('renders a post with a message and likes with have.text', () => {
    const comment1 = {_id: 1, text: "Hello, world",  username: 'the best author name', commentDate: "2023-01-01"}
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5, comments: [comment1]}} />);
    cy.get('[data-cy="post"]').should('have.text', "Hello, world")
    cy.get('[data-cy="likes"]').should('have.text', "5")
  })

  it('checks Like button exists', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5, comments: []}} />);
    cy.get('button').should('exist');

  })

  it('renders a post with a multiple comments', () => {
    const comment1 = {_id: 1, text: "Hello, world",  username: 'the best author name', commentDate: "2023-01-01"};
    const comment2 = {_id: 2, text: "Bye, world",  username: '123', commentDate: "2023-02-02"};
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5, comments: [comment1, comment2], image: "something"}}/>)
    cy.get('[data-cy="comment"]').eq(0).should('contain.text', "Hello, worldBy: the best author nameDate: 2023-01-01")
    cy.get('[data-cy="comment"]').eq(-1).should('contain.text', "Bye, worldBy: 123Date: 2023-02-02")

  })
})

describe("submitComment" ,() => {
  it('fetches patch /posts with correct, datetime, authorid, message and postID', () => {
    cy.intercept('GET', '/api/users/@me', {
      statusCode: 200,
      body: {username: "Barry123"}
    });
    cy.intercept('PATCH', '/api/posts/15', {
      statusCode: 200
    }).as('post-posts');
    let mockDate = new Date(2023, 5, 27, 9, 56, 16);
    cy.clock(mockDate)
    cy.mount(<Post post={{_id: 15, message: "Hello, world", likes:5, comments: []}} />);
    cy.get('[data-cy="comment-text"]').type("I am a comment");
    cy.get('[data-cy="submit-comment"]').click();
    cy.wait("@post-posts").then((interception) =>{
      expect(interception.request.body.comments.authorName).to.eq('Barry123');
      expect(interception.request.body.comments.text).to.eq("I am a comment");
    })
  })
})


