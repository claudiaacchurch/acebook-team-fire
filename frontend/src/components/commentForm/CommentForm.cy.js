import CommentForm from './CommentForm.js';

describe("Comments", () => {
    it('renders a comment form, including a add comment button', () => {
      cy.mount(<CommentForm submitComment = {cy.stub().as('stubSubmitComment')}/>);
      cy.get('[data-cy="submit-comment"]').should('exist');
      cy.get('[data-cy="comment-text"]').should('exist');
    })
    it('when pressing the add comment button ', () => {
        cy.mount(<CommentForm submitComment = {cy.stub().as('stubSubmitComment')}/>);
        cy.get('[data-cy="comment-text"]').type("I am a comment");
        cy.get('[data-cy="submit-comment"]').click();
        cy.get('@stubSubmitComment').should('be.calledWith', 'I am a comment'); 
    })
})