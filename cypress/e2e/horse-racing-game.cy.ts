describe('Horse Racing Game - Complete User Journey', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the main application layout', () => {
    cy.contains('🐎 Horse Racing Game')
    cy.get('.dashboard').should('be.visible')
    cy.get('.horses-sidebar').should('be.visible')
    cy.get('.main-content').should('be.visible')
    cy.get('.schedule-sidebar').should('be.visible')
    cy.get('.results-section').should('be.visible')
  })

  it('should show initial empty states', () => {
    // Check empty horse state
    cy.get('.horses-sidebar').within(() => {
      cy.contains('No horses yet')
      cy.contains('Generate horses to start')
    })

    // Check empty schedule state
    cy.get('.schedule-sidebar').within(() => {
      cy.contains('⚠️ Generate horses first')
    })

    // Check empty results state
    cy.get('.results-section').within(() => {
      cy.contains('Race results will appear here after completing races')
    })

    // Check race track empty state
    cy.get('.main-content').within(() => {
      cy.contains('Readty to Race!')
      cy.contains('Generate horses and schedule to start racing')
    })
  })

  it('should generate horses successfully', () => {
    // Click generate horses button
    cy.get('.header-controls').within(() => {
      cy.contains('Generate Horses').click()
    })

    // Verify horses are generated
    cy.get('.horses-sidebar').within(() => {
      cy.contains('🐎 Horses (20/20)')
      cy.get('.horse-item').should('have.length', 20)
    })

    // Verify horse details are displayed
    cy.get('.horse-item')
      .first()
      .within(() => {
        cy.get('.horse-name').should('not.be.empty')
        cy.get('.horse-color').should('be.visible')
        cy.get('.condition-bar').should('be.visible')
        cy.get('.condition-text').should('not.be.empty')
      })
  })

  it('should generate race schedule after horses are created', () => {
    // Generate horses first
    cy.get('.header-controls').contains('Generate Horses').click()

    // Generate schedule should now be enabled
    cy.get('.header-controls').within(() => {
      cy.contains('Generate Schedule').should('not.be.disabled').click()
    })

    // Verify schedule is created
    cy.get('.schedule-sidebar').within(() => {
      cy.contains('📅 Race Schedule')
      cy.contains('1/6') // Current round indicator
      cy.get('.schedule-item').should('have.length', 6)
    })

    // Verify each race has correct information
    cy.get('.schedule-item').each(($race, index) => {
      cy.wrap($race).within(() => {
        cy.contains(`R${index + 1}`) // Round number
        cy.contains('m') // Distance
        cy.contains('pending') // Initial status
        cy.contains('10 total') // Horse count
      })
    })
  })

  it('should complete the full race workflow', () => {
    // Setup: Generate horses and schedule
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Start first race
    cy.get('.main-content').within(() => {
      cy.contains('Round 1')
      cy.contains('Start Race').click()
    })

    // Wait for countdown
    cy.get('.countdown-overlay').should('be.visible')
    cy.get('.countdown-number').should('contain', '3')

    // Wait for countdown to finish and race to start
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')

    // Verify race is running
    cy.get('.race-status .status').should('have.class', 'running')
    cy.contains('Racing...').should('be.visible')

    // Wait for race to finish - Cypress will wait as long as needed
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    // Verify race results modal appears
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-content').within(() => {
      cy.contains('🥇') // Gold medal
      cy.contains('Close').click()
    })

    // Verify results are displayed in results section
    cy.get('.results-section').within(() => {
      cy.contains('1/6 completed')
      cy.get('.race-result-card').should('have.length', 1)
    })

    // Verify next round button is available
    cy.get('.main-content').contains('Next Round').should('be.visible')
  })

  it('should run complete tournament with all 6 races', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run all 6 races
    for (let race = 1; race <= 6; race++) {
      cy.get('.main-content').contains('Start Race').click()

      // Wait for countdown and race completion
      cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
      cy.get('.race-status .status').should('have.class', 'running')
      cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

      // Close result modal
      cy.get('.modal-overlay .modal-content').contains('Close').click()

      // Verify progress
      cy.get('.results-section').contains(`${race}/6 completed`)

      // Move to next round (except for last race)
      if (race < 6) {
        cy.get('.main-content').contains('Next Round').click()
        cy.get('.main-content').contains(`Round ${race + 1}`)
      }
    }

    // Verify tournament completion
    cy.get('.main-content').contains('🎉 All Races Completed!')
    cy.get('.results-section').contains('6/6 completed')
  })

  it('should display race results and statistics', () => {
    // Setup and run 2 races quickly
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run 2 races quickly
    for (let i = 0; i < 2; i++) {
      cy.get('.main-content').contains('Start Race').click()
      cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
      cy.get('.race-status .status').should('have.class', 'running')
      cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
      cy.get('.modal-overlay .modal-content').contains('Close').click()
      if (i < 1) cy.get('.main-content').contains('Next Round').click()
    }

    // Verify results section
    cy.get('.results-section').within(() => {
      cy.contains('2/6 completed')
      cy.get('.race-result-card').should('have.length', 2)

      // Verify first race result card
      cy.get('.race-result-card')
        .first()
        .within(() => {
          cy.get('.round-badge').should('contain', 'R1')
          cy.get('.distance').should('contain', '1200m')
          cy.get('.podium-item').should('have.length.at.least', 3)

          // Check that podium items have required elements
          cy.get('.podium-item')
            .first()
            .within(() => {
              cy.get('.position-medal').should('exist')
              cy.get('.horse-name-mini').should('exist').invoke('text').should('not.be.empty')
              cy.get('.time-mini')
                .should('exist')
                .invoke('text')
                .should('match', /\d+\.\d{2}s/)
            })
        })

      // Verify second race result card
      cy.get('.race-result-card')
        .eq(1)
        .within(() => {
          cy.get('.round-badge').should('contain', 'R2')
          cy.get('.distance').should('contain', '1400m')
          cy.get('.podium-item').should('have.length.at.least', 3)
        })
    })
  })

  it('should handle modal interactions correctly', () => {
    // Setup and run one race
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    cy.get('.main-content').contains('Start Race').click()

    // Wait for race to finish
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    // Verify modal content
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-content').within(() => {
      // Should show podium
      cy.contains('🥇')
      cy.contains('🥈')
      cy.contains('🥉')

      // Should have expandable results
      cy.contains('Show all 10 horses').click()
      cy.get('.result-row').should('have.length.at.least', 7)

      // Close modal
      cy.contains('Close').click()
    })

    // Modal should be gone
    cy.get('.modal-overlay').should('not.exist')
  })

  it('should reset game state when regenerating', () => {
    // Setup and run one race
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    cy.get('.main-content').contains('Start Race').click()

    // After race finishes
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify we have results
    cy.get('.results-section').contains('1/6 completed')

    // Regenerate horses
    cy.get('.header-controls').contains('Generate Horses').click()

    // Results should be cleared
    cy.get('.results-section').contains('Race results will appear here after completing races')

    // Regenerate schedule
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Should be back to round 1
    cy.get('.main-content').contains('Round 1')
    cy.get('.schedule-sidebar').contains('1/6')
  })

  it('should maintain proper game state throughout', () => {
    // Test the complete flow with state verification
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.horses-sidebar').should('contain', '🐎 Horses (20/20)')

    cy.get('.header-controls').contains('Generate Schedule').click()
    cy.get('.schedule-sidebar').should('contain', '1/6')

    // Run all 6 races
    for (let race = 1; race <= 6; race++) {
      cy.get('.main-content').contains('Start Race').click()
      cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
      cy.get('.race-status .status').should('have.class', 'running')
      cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
      cy.get('.modal-overlay .modal-content').contains('Close').click()

      if (race < 6) {
        cy.get('.main-content').contains('Next Round').click()
      }
    }

    // Verify final state
    cy.get('.main-content').contains('🎉 All Races Completed!')
    cy.get('.results-section').contains('6/6 completed')
    cy.get('.results-section .race-result-card').should('have.length', 6)
  })

  it('should handle edge cases and error states', () => {
    // Test without generating horses first
    cy.get('.header-controls').contains('Generate Schedule').should('be.disabled')

    // Test without generating schedule
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.main-content').contains('Generate horses and schedule to start racing')

    // Test race completion without schedule
    cy.get('.main-content').contains('Start Race').should('not.exist')
  })

  it('should display proper race progression indicators', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Verify initial state
    cy.get('.schedule-sidebar .schedule-item').first().should('have.class', 'current')
    cy.get('.main-content').contains('Round 1')

    // Run first race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify progression
    cy.get('.schedule-sidebar .schedule-item').first().should('have.class', 'finished')
    cy.get('.main-content').contains('Next Round').click()
    cy.get('.schedule-sidebar .schedule-item').eq(1).should('have.class', 'current')
    cy.get('.main-content').contains('Round 2')
  })

  it('should maintain responsive design across different screen sizes', () => {
    // Test on different viewport sizes
    cy.viewport(1920, 1080)
    cy.get('.dashboard').should('be.visible')

    cy.viewport(1366, 768)
    cy.get('.dashboard').should('be.visible')

    cy.viewport(768, 1024)
    cy.get('.dashboard').should('be.visible')

    cy.viewport(375, 667)
    cy.get('.dashboard').should('be.visible')
  })
})
