import Post from './Post'

describe("Post", () => {
  it('renders a post with a message', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="post"]').should('contain.text', "Hello, world")
  })

  it('renders a post with a message and likes with have.text', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('[data-cy="post"]')
    .should('have.text', "Hello, worldLikes: 5")
  })

  it('checks Like button exists', () => {
    cy.mount(<Post post={{_id: 1, message: "Hello, world", likes:5}} />);
    cy.get('button').should('exist');
  })
})
