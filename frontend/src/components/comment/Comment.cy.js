import Comment from './Comment'
describe("Comment", () => {
    it('renders a post with all comments with an authors name and datetime', () => {
        let mockDate = "2023-01-01";
        console.log(mockDate);
        cy.mount(<Comment comment={{_id: 1, text: "Hello, world",  username: 'the best author name', commentDate: mockDate}} />);
        cy.get('[data-cy="comment"]').should('contain.text', "Hello, worldBy: the best author nameDate: 2023-01-01")
        
        // what we need to do I think is mock the date correctly now, so it stays as a static date and doesnt keept changing
        // cy.clock(mockDate)
     



        });
    })

// describe("Comment", () => {
//     it('renders a several posts for a user with an authors name and datetime', () => {
//         cy.mount(<Comment comment={{_id: 1, message: "Hello, world", author_name: 'the best author name', datetime: '2023-01-01'}} />);
//         cy.get('[data-cy="comment"]').should('contain.text', "Hello, world Comment Author the best author name Datetime 2023-01-01")
//     })
// })