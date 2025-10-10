describe('authentication test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173', {
      onBeforeLoad(win) {
        cy.spy(win, 'fetch');
      }
    });
  });

  it('tests the initial api for protected routes', () => {
    // Confirms the window fetch makes a get request to the route /proxy/auth/isAuthenticated for protected routes
    cy.window().its('fetch').should('be.calledWith', '/proxy/auth/isAuthenticated');
    // Confirms the window fetch is called twice initially
    cy.window().its('fetch').should('have.been.calledTwice');
    // Confirms the login page
    cy.url().should('include', '/login');
  });

  it('tests the email and password and initial graphql apis query and cookies', () => {
    cy.url().should('include', '/login');

    // Simulate typing the test email and password
    cy.get('input[name=email]').type(Cypress.env('TEST_EMAIL'));
    cy.get('input[name=email]').should('have.value', Cypress.env('TEST_EMAIL'));
    cy.get('input[name=password]').type(Cypress.env('TEST_PASSWORD'));
    cy.get('input[name=password]').should('have.value', Cypress.env('TEST_PASSWORD'));
    cy.get('form').contains('button', 'Sign in').click();
    cy.url().should('include', '/');
    // Expect apollo graphql client api queries in browser fetch
    cy.window().its('fetch').should('be.calledWith', 'http://localhost:3302/graphql');
    // Expect sessions cookies in browser after login
    cy.getCookie('user_session').should('exist');
  });

  it('tests signin api request and interception to expect session cookies', () => {
    // Intercept the signin post request
    cy.intercept('POST', 'http://localhost:5173/proxy/auth/signin', {
      body: {
        email: Cypress.env('TEST_EMAIL'),
        password: Cypress.env('TEST_PASSWORD')
      }
    }).as('signin');

    // Simulate a api post request for interception and return the expected response and cookies
    cy.request('POST', 'http://localhost:5173/proxy/auth/signin', {
      email: Cypress.env('TEST_EMAIL'),
      password: Cypress.env('TEST_PASSWORD')
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      })
      .then(() => cy.getCookie('user_session').should('exist'));
  });

  it('tests session login command', () => {
    // cy.visit('http://localhost:5173');
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
    // cy.window().then((win) => {
    //   cy.spy(win, 'fetch');
    //   expect(win.fetch).to.be.calledBefore;
    // });
    cy.window().then((win) => {
      cy.spy(win, 'fetch').as('fetchSpy'); // create a spy alias for window.fetch
      expect(win.fetch).to.be.calledBefore;
    });

    
  });
});
