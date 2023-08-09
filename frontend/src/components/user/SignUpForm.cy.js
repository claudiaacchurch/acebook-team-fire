import SignUpForm from './SignUpForm'
const navigate = () => {}

describe("Signing up", () => {
  it("calls the /users endpoint", () => {
    cy.mount(<SignUpForm navigate={navigate}/>)

    cy.intercept('POST', '/users', { message: "OK" }).as("signUpRequest")

    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("donkey");
    cy.get("#profilePic").type("image.png");
    cy.get("#submit").click();
    cy.wait('@signUpRequest').then( interception => {
      expect(interception.response.body.message).to.eq("OK")
      expect(interception.request.body.email).to.eq("someone@example.com");
      expect(interception.request.body.password).to.eq("password");
      expect(interception.request.body.username).to.eq("donkey");
      expect(interception.request.body.profilePic).to.eq("image.png");
    })
  })
})
