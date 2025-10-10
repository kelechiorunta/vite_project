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
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email],
    () => {
      cy.visit('http://localhost:5173');
      cy.get('input[name=email]').type(email);
      cy.get('input[name=email]').should('have.value', email);
      cy.get('input[name=password]').type(password);
      cy.get('input[name=password]').should('have.value', password);
      cy.get('form').contains('button', 'Sign in').click();
      cy.window().its('fetch').should('be.calledWith', 'http://localhost:3302/graphql');
    },
    {
      validate: () => {
        cy.intercept('GET', '/proxy/auth/isAuthenticated', (req) => {
          req.reply({ statusCode: 200 });
        }).as('isAuthenticated');

        cy.visit('http://localhost:5173');

        cy.wait('@isAuthenticated').its('response.statusCode').should('eq', 200);
      }
    }
  );
});
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
