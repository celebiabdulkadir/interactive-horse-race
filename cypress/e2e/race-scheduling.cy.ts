describe('Race Scheduling & Management', () => {
  beforeEach(() => {
    cy.visit('/')
    // Setup: Always generate horses first
    cy.get('.header-controls').contains('Generate Horses').click()
  })

  it('should prevent schedule generation without horses', () => {
    cy.visit('/') // Fresh visit without horses

    // Generate Schedule button should be disabled
    cy.get('.header-controls').within(() => {
      cy.contains('Generate Schedule').should('be.disabled')
    })

    // Schedule sidebar should show warning
    cy.get('.schedule-sidebar').contains('📅 Schedule will appear here after generating horses')
  })

  it('should create 6 races with correct distances', () => {
    const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]

    cy.get('.header-controls').contains('Generate Schedule').click()

    // Verify 6 races are created
    cy.get('.schedule-sidebar .schedule-item').should('have.length', 6)

    // Verify each race has correct distance and round number
    cy.get('.schedule-item').each(($race, index) => {
      cy.wrap($race).within(() => {
        cy.contains(`R${index + 1}`)
        cy.contains(`${expectedDistances[index]}m`)
        cy.contains('pending')
        cy.contains('10 total') // 10 horses per race
      })
    })
  })

  it('should highlight current race correctly', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // First race should be current
    cy.get('.schedule-item').first().should('have.class', 'current')
    cy.get('.schedule-item').eq(1).should('not.have.class', 'current')

    // Run first race and move to next
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()
    cy.get('.main-content').contains('Next Round').click()

    // Second race should now be current
    cy.get('.schedule-item').first().should('not.have.class', 'current')
    cy.get('.schedule-item').eq(1).should('have.class', 'current')
  })

  it('should update race status during progression', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Initial state - all pending
    cy.get('.schedule-item').each(($race) => {
      cy.wrap($race).should('not.have.class', 'running')
      cy.wrap($race).should('not.have.class', 'finished')
    })

    // Start first race
    cy.get('.main-content').contains('Start Race').click()

    // First race should be running
    cy.get('.schedule-item').first().should('have.class', 'running')

    // Wait for race to finish
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // First race should be finished
    cy.get('.schedule-item').first().should('have.class', 'finished')
    cy.get('.schedule-item').first().should('not.have.class', 'running')
  })

  it('should display winner information after race completion', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run first race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Winner should be displayed in schedule
    cy.get('.schedule-item')
      .first()
      .within(() => {
        cy.contains('🏁') // Winner flag
        cy.contains('finished')
        // Winner name should exist
        cy.get('.winner').should('exist').invoke('text').should('not.be.empty')
      })
  })

  it('should show round progression indicator', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Initial: 1/6
    cy.get('.schedule-sidebar').contains('1/6')

    // Run first race and move to next
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()
    cy.get('.main-content').contains('Next Round').click()

    // Should show 2/6
    cy.get('.schedule-sidebar').contains('2/6')
  })

  it('should display horse lists for each race', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    cy.get('.schedule-item')
      .first()
      .within(() => {
        // Should show horses section
        cy.contains('Horses:')
        cy.contains('10 total')

        // Should show horse grid
        cy.get('.horses-grid').should('be.visible')
        cy.get('.horse-item').should('have.length', 10)

        // Each horse item should have name and condition
        cy.get('.horse-item').each(($horse) => {
          cy.wrap($horse).within(() => {
            cy.get('.horse-name').should('exist').invoke('text').should('not.be.empty')
            cy.get('.horse-condition').should('exist').invoke('text').should('not.be.empty')
            cy.get('.horse-color').should('exist')
          })
        })
      })
  })

  it('should handle race reset properly', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Regenerate schedule (reset)
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Schedule should be reset
    cy.get('.schedule-sidebar').contains('1/6') // Back to round 1
    cy.get('.schedule-item').each(($race) => {
      cy.wrap($race).should('not.have.class', 'finished')
      cy.wrap($race).should('not.have.class', 'running')
    })

    // First race should be current again
    cy.get('.schedule-item').first().should('have.class', 'current')
  })

  it('should prevent race start when no schedule exists', () => {
    // Don't generate schedule
    cy.get('.main-content').within(() => {
      cy.contains('Ready to Race!')
      cy.should('not.contain', 'Start Race')
    })
  })

  it('should show race times after completion', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run first race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Race time should be displayed
    cy.get('.schedule-item')
      .first()
      .within(() => {
        cy.contains('Winner Time:')
        cy.get('.time')
          .should('exist')
          .invoke('text')
          .should('match', /\d+\.\d{2}s/)
      })
  })

  it('should handle all races completion', () => {
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run all 6 races
    for (let i = 1; i <= 6; i++) {
      cy.get('.main-content').contains('Start Race').click()
      cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
      cy.get('.race-status .status').should('have.class', 'running')
      cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
      cy.get('.modal-overlay .modal-content').contains('Close').click()

      if (i < 6) {
        // Only click Next Round for races 1-5, not after the 6th race
        cy.get('.main-content').contains('Next Round').click()
        cy.get('.schedule-sidebar').contains(`${i + 1}/6`)
      } else {
        // After the 6th race, we should be on round 6/6 and there should be no Next Round button
        cy.get('.schedule-sidebar').contains('6/6')
        cy.get('.main-content').should('not.contain', 'Next Round')
      }
    }

    // All races should be finished
    cy.get('.schedule-item').each(($race) => {
      cy.wrap($race).should('have.class', 'finished')
    })

    // Ensure we're on the last round and the last race is finished
    cy.get('.schedule-sidebar').should('contain', '6/6')
    cy.get('.schedule-item').last().should('have.class', 'finished')

    cy.get('.main-content').contains('Start Race').should('be.disabled')
    // Verify that the Reset All button is available (since all races are finished)
    cy.get('.main-content').should('contain', 'Reset All')
  })
})
