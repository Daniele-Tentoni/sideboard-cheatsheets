/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
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
//

Cypress.Commands.add('sideboard', (name: string) => {
  cy.intercept('https://cards.scryfall.io/art_crop/**/*', { fixture: 'images/the-lost.jpg' })
  cy.intercept('https://api.scryfall.com/cards/named?fuzzy=*', {
    fixture: 'scryfall/eviscerators_insight_fuzzy.json',
  })
  cy.visit(`/sideboard/${name}`)
})

Cypress.Commands.add('sideboards', () => {
  cy.intercept('https://cards.scryfall.io/art_crop/**/*', { fixture: 'images/the-lost.jpg' })
  cy.visit('sideboards')
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      sideboard(name: string): Chainable<void>
      sideboards(): Chainable<void>
      //       login(email: string, password: string): Chainable<void>
      //       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

export {}
