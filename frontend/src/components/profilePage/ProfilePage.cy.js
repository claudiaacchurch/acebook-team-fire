import ProfilePage from './ProfilePage'


describe("ProfilePage", () => {

    // Setting up mock data for the test
    const mockUser = {
        userId: "1234",
        username: "testuser",
        profilePic: "testPic.jpg"
    };

    const mockPosts = [
        { _id: 1, message: "First user post", likes: 1 },
        { _id: 2, message: "Another user post", likes: 2 }
    ];

    beforeEach(() => {
        window.localStorage.setItem("token", "fakeToken");

        cy.intercept("GET", "/users/@me", (req) => {
            req.reply({
                statusCode: 200,
                body: mockUser
            });
        }).as("getUser");

        cy.intercept("GET", `/posts/user/${mockUser.userId}`, (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    posts: mockPosts
                }
            });
        }).as("getUserPosts");
    });


    it("Displays the user information", () => {
        cy.mount(<ProfilePage />); 
        cy.get("[data-cy=user]").should("be.visible");
        cy.get("[data-cy=user] p").should("have.length", 3);
        cy.get("[data-cy=user]").should("contain", mockUser.username);
    });

    it("Lists the user's posts", () => {
        cy.mount(<ProfilePage />);
        cy.get('h2').contains('Your posts').should('be.visible');
        cy.get('[data-cy=post]').should('contain.text', "First user post");
        cy.get('[data-cy=post]').should('contain.text', "Another user post");
    });

    it("Likes a post", () => {
        cy.intercept("PATCH", `/posts/1`, (req) => {
        req.reply({
            statusCode: 200,
            body: { likes: 3 }
        });
    }).as("likePost");
    cy.mount(<ProfilePage />);
    
    cy.get('.like-btn-1').click().click();
    cy.wait('@likePost')
    .its('response.body')
    .should('deep.eq', { likes: 3 });
    cy.get('[data-cy=post]').should('contain.text',"First user postAnother user post");
})});

