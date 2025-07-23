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
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Custom commands for Horse Racing Game E2E tests

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Generate horses and verify they are created
       */
      generateHorses(): Chainable<void>

      /**
       * Generate race schedule and verify it's created
       */
      generateSchedule(): Chainable<void>

      /**
       * Complete setup (generate horses and schedule)
       */
      setupGame(): Chainable<void>

      /**
       * Start a race and wait for it to complete
       */
      completeRace(): Chainable<void>

      /**
       * Close the result modal
       */
      closeResultModal(): Chainable<void>

      /**
       * Run a complete race cycle (start, wait, close modal)
       */
      runRace(): Chainable<void>

      /**
       * Run multiple races
       * @param count - number of races to run
       */
      runMultipleRaces(count: number): Chainable<void>

      /**
       * Verify race result statistics
       */
      verifyRaceStats(): Chainable<void>
    }
  }
}

Cypress.Commands.add('generateHorses', () => {
  cy.get('.header-controls').contains('Generate Horses').click()
  cy.get('.horses-sidebar').contains('🐎 Horses (20/20)')
  cy.get('.horse-item').should('have.length', 20)
})

Cypress.Commands.add('generateSchedule', () => {
  cy.get('.header-controls').contains('Generate Schedule').click()
  cy.get('.schedule-sidebar').contains('📅 Race Schedule')
  cy.get('.schedule-item').should('have.length', 6)
})

Cypress.Commands.add('setupGame', () => {
  cy.generateHorses()
  cy.generateSchedule()
})

Cypress.Commands.add('completeRace', () => {
  cy.get('.main-content').contains('Start Race').click()

  // Wait for countdown to finish and race to start running
  cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
  cy.get('.race-status .status').should('have.class', 'running')

  // Wait for race to finish - races can take varying amounts of time
  cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
})

Cypress.Commands.add('closeResultModal', () => {
  cy.get('.modal-overlay').should('be.visible')
  cy.get('.modal-content').contains('Close').click()
  cy.get('.modal-overlay').should('not.exist')
})

Cypress.Commands.add('runRace', () => {
  cy.completeRace()
  cy.closeResultModal()
})

Cypress.Commands.add('runMultipleRaces', (count: number) => {
  for (let i = 0; i < count; i++) {
    cy.runRace()

    // Move to next round if not the last race
    if (i < count - 1) {
      cy.get('.main-content').contains('Next Round').click()
    }
  }
})

Cypress.Commands.add('verifyRaceStats', () => {
  cy.get('.results-section .quick-stats').should('be.visible')
  cy.get('.results-section').within(() => {
    cy.contains('Different Winners')
    cy.contains('Most Wins')
    cy.contains('Avg Winner Time')
  })
})

// Prevent TypeScript errors
export {}
