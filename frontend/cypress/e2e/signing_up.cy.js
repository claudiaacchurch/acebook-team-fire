describe("Signing up", () => {
  it("with valid credentials, redirects to '/login'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("donkey");
    cy.get("#submit").click();
    cy.url().should("include", "/posts");
  });

  it("with missing password, stays on '/signup'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get('#submit').should('be.disabled')
    cy.url().should("include", "/signup");
  });

  it("with missing email, stays on '/signup'", () => {
    cy.visit("/signup");
    cy.get("#password").type("password");
    cy.get('#submit').should('be.disabled')
    cy.url().should("include", "/signup");
  });
});