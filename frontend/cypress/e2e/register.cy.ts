describe('Register Component', () => {
    beforeEach(() => {
        cy.visit('/register');
    })

    it('should register a new user', () => {
        cy.get('[id="email"]').type('testuser@example.com');
        cy.get('[id="first_name"]').type('Test');
        cy.get('[id="last_name"]').type('User');
        cy.get('[id="user_name"]').type('testuser');
        cy.get('[id="password"]').type('password123');
        
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/home');

        cy.get('Hello, testuser').should('be.visible');
    })
})