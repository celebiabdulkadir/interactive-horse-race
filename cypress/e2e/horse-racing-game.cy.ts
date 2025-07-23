describe('Horse Racing Game - Complete User Journey', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the main application layout', () => {
    cy.contains('🐎 Interactive Horse Racing Game')
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

      // Check quick stats
      cy.get('.quick-stats').should('be.visible')
      cy.contains('Different Winners')
      cy.contains('Most Wins')
      cy.contains('Avg Winner Time')

      // Check champion display
      cy.get('.champion-mini').should('be.visible')
      cy.contains('👑')
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
    cy.get('.results-section').contains('Race results will appear here')

    // Regenerate schedule
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Should be back to round 1
    cy.get('.main-content').contains('Round 1')
    cy.get('.schedule-sidebar').contains('1/6')
  })

  it('should maintain proper game state throughout', () => {
    // Test the complete flow with state verification
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.horses-section').should('contain', '20 horses generated')

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

    // Final state verification
    cy.get('.main-content').contains('🎉 All Races Completed!')
    cy.get('.results-section').contains('6/6 completed')
    cy.get('.race-result-card').should('have.length', 6)
  })

  it('should handle edge cases gracefully', () => {
    // Test without horses
    cy.get('.schedule-sidebar').contains('⚠️ Generate horses first')

    // Generate horses but no schedule
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.main-content').contains('Readty to Race!')

    // Generate schedule and verify everything works
    cy.get('.header-controls').contains('Generate Schedule').click()
    cy.get('.main-content').contains('Start Race').should('be.visible')
  })

  it('should display countdown correctly', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Start race and verify countdown
    cy.get('.main-content').contains('Start Race').click()

    // Countdown should appear
    cy.get('.countdown-overlay').should('be.visible')
    cy.get('.countdown-number').should('be.visible')

    // Should count down from 3
    cy.get('.countdown-number').should('contain', '3')
    // Note: We don't test the actual countdown progression as it's time-based

    // Countdown should disappear
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')

    // Race should start
    cy.get('.race-status .status').should('have.class', 'running')
  })

  it('should persist results between races', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run one race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify first result
    cy.get('.results-section').contains('1/6 completed')
    cy.get('.race-result-card').should('have.length', 1)

    // Run second race
    cy.get('.main-content').contains('Next Round').click()
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify both results persist
    cy.get('.results-section').contains('2/6 completed')
    cy.get('.race-result-card').should('have.length', 2)

    // First race result should still be there
    cy.get('.race-result-card').first().contains('R1')
    cy.get('.race-result-card').eq(1).contains('R2')
  })

  it('should handle race controls properly', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Verify initial state
    cy.get('.main-content').within(() => {
      cy.contains('Start Race').should('not.be.disabled')
      cy.contains('Next Round').should('not.exist')
      cy.contains('Reset All').should('not.exist')
    })

    // Start race and verify button states during race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.main-content').contains('Racing...').should('be.disabled')

    // Wait for race to finish
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify post-race button states
    cy.get('.main-content').within(() => {
      cy.contains('Start Race').should('not.exist')
      cy.contains('Next Round').should('be.visible')
    })
  })

  it('should show race progress in schedule sidebar', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Verify initial schedule state
    cy.get('.schedule-sidebar').within(() => {
      cy.get('.schedule-item').first().should('have.class', 'current')
      cy.get('.schedule-item')
        .first()
        .within(() => {
          cy.contains('pending')
        })
    })

    // Run first race
    cy.get('.main-content').contains('Start Race').click()

    // During race, verify running state
    cy.get('.schedule-sidebar .schedule-item').first().should('have.class', 'running')

    // After race finishes
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify finished state and winner display
    cy.get('.schedule-sidebar').within(() => {
      cy.get('.schedule-item').first().should('have.class', 'finished')
      cy.get('.schedule-item')
        .first()
        .within(() => {
          cy.contains('finished')
          cy.contains('🏁') // Winner flag
        })
    })
  })

  it('should complete all 6 races and show final state', () => {
    // Setup
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run all 6 races
    for (let race = 1; race <= 6; race++) {
      cy.get('.main-content').contains('Start Race').click()
      cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
      cy.get('.modal-overlay .modal-content').contains('Close').click()

      if (race < 6) {
        cy.get('.main-content').contains('Next Round').click()
      }
    }

    // Verify final state
    cy.get('.results-section').contains('6/6 completed')
    cy.get('.results-section .race-result-card').should('have.length', 6)

    // Verify reset button appears
    cy.get('.main-content').contains('Reset All').should('be.visible')

    // Verify final message
    cy.get('.main-content').contains('🎉 All Races Completed!')
  })

  it('should reset the game properly', () => {
    // Complete a full game
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run one race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Reset using header button (races reset)
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Verify schedule is reset
    cy.get('.schedule-sidebar').within(() => {
      cy.contains('1/6') // Back to round 1
      cy.get('.schedule-item').each(($item) => {
        cy.wrap($item).should('not.have.class', 'finished')
      })
    })

    // Verify results are cleared
    cy.get('.results-section').should('not.contain', 'completed')
  })

  it('should be responsive and handle window resize', () => {
    // Test on different viewport sizes
    cy.viewport(1200, 800)
    cy.get('.dashboard').should('be.visible')

    cy.viewport(768, 1024) // Tablet
    cy.get('.dashboard').should('be.visible')

    cy.viewport(375, 667) // Mobile
    cy.get('.dashboard').should('be.visible')
  })
})
