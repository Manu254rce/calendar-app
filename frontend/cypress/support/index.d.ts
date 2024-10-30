/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
    interface Chainable<Subject> {
      login(username?: string, password?: string): Chainable<any>
      logout(): Chainable<any>
    }
  }