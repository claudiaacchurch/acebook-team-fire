import Comment from './Comment'
describe("Comment", () => {
    it('renders a post with all comments with an authors name and datetime', () => {
        cy.mount(<Comment comment={{_id: 1, message: "Hello, world", author_name: 'the best author name', datetime: '2023-01-01'}} />);
        cy.get('[data-cy="comment"]').should('contain.text', "Hello, world Comment Author the best author name Datetime 2023-01-01")
    })
})