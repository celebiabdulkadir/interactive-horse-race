describe('Custom Commands Demo', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should use custom commands to quickly run a complete game', () => {
    // Setup the entire game with one command
    cy.setupGame()

    // Run 3 races quickly
    cy.runMultipleRaces(3)

    // Verify results are displayed correctly
    cy.get('.results-section').contains('3/6 completed')
    cy.get('.race-result-card').should('have.length', 3)

    // Verify statistics
    cy.verifyRaceStats()
  })

  it('should demonstrate individual custom commands', () => {
    // Generate horses
    cy.generateHorses()

    // Generate schedule
    cy.generateSchedule()

    // Run a single race
    cy.runRace()

    // Verify results
    cy.get('.results-section').contains('1/6 completed')

    // Run another race manually using individual commands
    cy.get('.main-content').contains('Next Round').click()
    cy.completeRace()
    cy.closeResultModal()

    // Verify 2 races completed
    cy.get('.results-section').contains('2/6 completed')
  })

  it('should handle race completion efficiently', () => {
    cy.setupGame()

    // Complete first race step by step
    cy.completeRace()
    cy.get('.modal-overlay').should('be.visible')
    cy.closeResultModal()

    // Move to next round and run another race with single command
    cy.get('.main-content').contains('Next Round').click()
    cy.runRace()

    // Verify progress
    cy.get('.results-section').contains('2/6 completed')
  })
})
