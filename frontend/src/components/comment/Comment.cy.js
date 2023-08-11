import Comment from './Comment'
describe("Comment", () => {
    it('renders a post with all comments with an authors name and datetime', () => {
        let mockDate = "2023-01-01";
        cy.mount(<Comment comment={{_id: 1, text: "Hello, world",  username: 'the best author name', commentDate: mockDate}} />);
        cy.get('[data-cy="comment"]').should('contain.text', "Tthe best author nameHello, world")
      
        });
    })

