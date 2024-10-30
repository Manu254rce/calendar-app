declare namespace Cypress {
    interface Chainable {
        login(username?: string, password?: string): void;
    }
}

Cypress.Commands.add('login', (username = 'testuser', password = 'password123') => {
    cy.visit('/login');
    cy.get('[data-testid=username-input]').type(username);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=login-button]').click();

    cy.url().should('not.include', '/login');

    cy.window().its('localStorage').invoke('getItem', 'token')
        .then((token) => {
            if (token) {
                Cypress.env('token', token);
            }
        }
        )
});


// Cypress.Commands.add('logout', () => {
//     cy.window().its('localStorage').invoke('clear');

//     cy.request({
//         method: 'POST',
//         url: `${Cypress.env('apiUrl')}/auth/logout`,
//         headers: {
//             Authorization: `Bearer ${Cypress.env('token')}`,
//         },
//     });

//     cy.visit('/');
//     cy.url().should('include', '/login');
// });

export { };