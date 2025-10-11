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
    //  Execute the Login command
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
    cy.window().then((win) => {
      cy.spy(win, 'fetch').as('fetchSpy');
      expect(win.fetch).to.be.calledBefore;
    });
  });

  it('should intercept and mock Google OAuth request', () => {
    // intercept the request to the backend route that triggers Google OAuth
    cy.intercept('GET', '/proxy/auth/google', {
      statusCode: 302,
      headers: {
        location: 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount'
      }
    }).as('googleRedirect');

    // Login page that triggers the OAuth flow
    cy.visit('http://localhost:5173/login');
    // simulate the user clicking the Google sign-in button
    cy.contains('Continue with Google').click();

    // wait for your backend redirect to be called
    cy.wait('@googleRedirect').then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
      expect(interception.response.headers.location).to.include('accounts.google.com');
    });
  });

  it('test database connection', () => {
    cy.task('dbConnect', Cypress.env('TEST_CONNECTION_STRING')).then((result) => {
      expect(result).to.eq(Cypress.env('TEST_CONNECTION_STRING'));
    });
  });
});
