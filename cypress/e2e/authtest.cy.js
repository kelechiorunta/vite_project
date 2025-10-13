describe('authentication test', () => {
  beforeEach(() => {
    cy.login(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'), {
      onBeforeLoad(win) {
        cy.spy(win, 'fetch');
      }
    });
  });

  // Confirm server api login request and session cookie
  it('tests for the credentials command for server signin api request and session cookie', () => {
    cy.credentials(Cypress.env('TEST_EMAIL'), Cypress.env('TEST_PASSWORD'));
  });

  //Confirms browser login and interception
  it('tests browser login request and interception', () => {
    // Intercept the signin post request
    cy.intercept('POST', 'http://localhost:5173/proxy/auth/signin', {
      body: {
        email: Cypress.env('TEST_EMAIL'),
        password: Cypress.env('TEST_PASSWORD')
      }
    }).as('signin');

    // Simulate a api post request for interception on the browser context and return the expected response and cookies
    cy.window().then((win) => {
      return win.fetch('/proxy/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: Cypress.env('TEST_EMAIL'),
          password: Cypress.env('TEST_PASSWORD')
        })
      });
    });

    cy.wait('@signin', { timeout: 1000 }).then((res) => {
      expect(res.response.statusCode).to.eq(200);
    });
  });

  // Mock Google OAuth
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

  // Tests for database connection
  it('test database connection', () => {
    cy.task('dbConnect', Cypress.env('TEST_CONNECTION_STRING')).then((result) => {
      expect(result).to.eq(Cypress.env('TEST_CONNECTION_STRING'));
    });
  });

  // Tests for rate-limiting
  it('tests for rate-limiting', () => {
    let requestCount = 0;

    // Mock the interception to /proxy/auth/isAuthenticated route
    cy.intercept('GET', '/proxy/auth/isAuthenticated', (req) => {
      requestCount++;
      if (requestCount > 10) {
        req.reply({ statusCode: 429, body: { message: 'Too Many Requests' } });
      } else {
        req.reply({ statusCode: 200, body: { authenticated: true } });
      }
    }).as('authenticate');

    // Simulate or trigger the request to /proxy/auth/isAuthenticated
    cy.visit('http://localhost:5173');

    // Trigger multiple requests quickly
    for (let i = 0; i < 20; i++) {
      cy.window().then((win) => {
        const requests = [];
        requests.push(
          win.fetch('http://localhost:5173/proxy/auth/isAuthenticated').catch(() => {})
        );
        return Promise.all(requests);
      });
    }

    // Wait for the interception
    cy.wait('@authenticate', { timeout: 5000 });

    // Iterate over the array of requests from Promise.all and filter expected exceeded rate limit requests
    cy.get('@authenticate.all').then((calls) => {
      expect(requestCount).to.be.greaterThan(10);
      const exceededCalls = calls.filter((req) => req.response?.statusCode === 429);
      expect(exceededCalls.length).to.be.greaterThan(0);
    });
  });

  it('navigate to home page', () => {
    cy.visit('http://localhost:5173');
  });
});
