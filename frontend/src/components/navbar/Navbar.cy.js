import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component Test', () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "mocked_token");
  });

  it('renders the Navbar component', () => {
    cy.mount( <Router> 
        <Navbar />
      </Router>);
    cy.contains("Acebook Fire").should("be.visible");
    cy.contains("Logout").should("be.visible");
  });

  it('shows login/signup when not authenticated', () => {
    window.localStorage.removeItem("token");
    cy.mount( <Router> 
        <Navbar />
      </Router>);
    cy.contains("Login").should("be.visible");
    cy.contains("Signup").should("be.visible");
  });
});
