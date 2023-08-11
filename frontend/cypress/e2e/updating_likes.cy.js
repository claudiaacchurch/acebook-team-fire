describe("adding likes", () => {
  before(() => {
    cy.signup("user@email.com", "12345678", "username");
    cy.login("user@email.com", "12345678")
    cy.deleteAllPosts().then(() => {
      cy.log('[data-cy="post"]').should("not.exist");
      cy.makePost("Test message", "test image URL");
    });
  });
  it("visit feed page", () => {
    cy.visit("/posts");
    cy.screenshot()
    cy.url().should("include", "/posts");
    cy.get('[data-cy="post"]').should("contain.text", "Test message");
    cy.get('[data-cy="likes"]').should('contain.text', "0");
    cy.get('[data-cy="like-button"]').click()
    cy.get('[data-cy="post"]').should("contain.text", "Test message");
    cy.get('[data-cy="likes"]').should('contain.text', "1");
  });
});
