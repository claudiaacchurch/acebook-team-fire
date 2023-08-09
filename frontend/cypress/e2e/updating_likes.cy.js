describe("adding likes", () => {

    before(() => {
        cy.signup("user@email.com", "12345678")
        cy.login("user@email.com", "12345678")
        cy.makePost("Test message", "test image URL")
        
    })

    it ("visit feed page", () => {
        cy.visit("/posts");
        cy.url().should("include", "/posts");
        cy.get('[data-cy="post"]').should("contain.text", "Test message 0")
        cy.get('#like-button').click()
        cy.get('[data-cy="post"]').should("contain.text", "Test message 1")
})})