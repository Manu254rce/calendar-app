describe('Calendar Application', () => {
    beforeEach(() => {
        cy.login(); 
        cy.visit('/');
    });

    // afterEach(() => {
    //     cy.logout();
    //   });

    it('should display the calendar', () => {
        cy.get('[data-testId="calendar"]').should('be.visible');
    })

    it('should create a new event', () => {
        cy.get('[data-testid="new-event-button"]').click();
        cy.get('[data-testid="event-title"]').type('Test Event');
        cy.get('[data-testid="event-date"]').type('2025-01-01');
        cy.get('[data-testid="description-input"]').type('Test Description');
        cy.get('[data-testid="submit-event"]').click();

        cy.contains('Test Event').should('be.visible');
    })

    it('should edit an existing event', () => {
        cy.get('[data-testid="event-item"]').first().click();
        cy.get('[data-testid="edit-event-button"]').click();
        cy.get('[data-testid="event-title"]').clear().type('Updated Event');
        cy.get('[data-testid="submit-event"]').click();

        cy.contains('Updated Event').should('be.visible');
    });

});
