// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('signup', (email, password) => {
  cy.visit("/signup");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit").click();
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit").click();
})
Cypress.Commands.add('makePost', (message, image) => {
  cy.visit("/posts");
  cy.get("#message").type(message);
  cy.get("#image").type(image);
  cy.get("#submit").click();
})
Cypress.Commands.add('deleteAllPosts', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
  cy.request({
    method: 'GET',
    url: '/posts',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then((response) => {
  const allPosts = response.body.posts;
    const allPostIds = allPosts.map(post => post._id);
    allPostIds.forEach(postId => {
      cy.request({
        method: 'DELETE',
        url: `/posts/${postId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    });
})})});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })