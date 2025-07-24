describe('Race Results & Statistics', () => {
  beforeEach(() => {
    cy.visit('/')
    // Setup: Generate horses and schedule
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()
  })

  it('should display race result modal after race completion', () => {
    // Start and complete a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    // Result modal should appear
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-content').should('be.visible')

    // Modal should contain race results
    cy.get('.modal-content').within(() => {
      cy.contains('🥇') // Gold medal for winner
      cy.contains('🥈') // Silver medal for second place
      cy.contains('🥉') // Bronze medal for third place
      cy.contains('Close')
    })
  })

  it('should show podium results with correct medals and times', () => {
    // Complete a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    cy.get('.modal-content').within(() => {
      // Check podium structure
      cy.get('.podium-item').should('have.length.at.least', 3)

      // First place should have gold medal
      cy.get('.podium-item')
        .first()
        .within(() => {
          cy.contains('🥇')
          cy.get('.horse-name-mini').should('exist').invoke('text').should('not.be.empty')
          cy.get('.time-mini')
            .should('exist')
            .invoke('text')
            .should('match', /\d+\.\d{2}s/)
        })

      // Second place should have silver medal
      cy.get('.podium-item')
        .eq(1)
        .within(() => {
          cy.contains('🥈')
          cy.get('.time-mini')
            .should('exist')
            .invoke('text')
            .should('match', /\d+\.\d{2}s/)
        })

      // Third place should have bronze medal
      cy.get('.podium-item')
        .eq(2)
        .within(() => {
          cy.contains('🥉')
          cy.get('.time-mini')
            .should('exist')
            .invoke('text')
            .should('match', /\d+\.\d{2}s/)
        })
    })
  })

  it('should display expandable full results', () => {
    // Complete a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    cy.get('.modal-content').within(() => {
      // Should have expandable details for all horses
      cy.get('.all-results').should('exist')
      cy.get('.show-all').should('contain', 'Show all 10 horses')

      // Click to expand
      cy.get('.show-all').click()

      // Should show remaining horses
      cy.get('.result-row').should('have.length.at.least', 7) // 10 total - 3 in podium
    })
  })

  it('should accumulate results in results section', () => {
    // Run first race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-content').contains('Close').click()

    // Check results section
    cy.get('.results-section').within(() => {
      cy.contains('1/6 completed')
      cy.get('.race-result-card').should('have.length', 1)
    })

    // Run second race
    cy.get('.main-content').contains('Next Round').click()
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-content').contains('Close').click()

    // Check updated results
    cy.get('.results-section').within(() => {
      cy.contains('2/6 completed')
      cy.get('.race-result-card').should('have.length', 2)
    })
  })

  it('should show individual race result cards with correct information', () => {
    // Complete a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-content').contains('Close').click()

    // Check race result card
    cy.get('.results-section .race-result-card')
      .first()
      .within(() => {
        // Should show round badge
        cy.get('.round-badge').should('contain', 'R1')

        // Should show distance
        cy.get('.distance').should('contain', '1200m')

        // Should show podium
        cy.get('.podium-item').should('have.length.at.least', 3)

        // Each podium item should have medal, horse info, and time
        cy.get('.podium-item').each(($item) => {
          cy.wrap($item).within(() => {
            cy.get('.position-medal').should('exist').invoke('text').should('not.be.empty')
            cy.get('.horse-name-mini').should('exist').invoke('text').should('not.be.empty')
            cy.get('.time-mini')
              .should('exist')
              .invoke('text')
              .should('match', /\d+\.\d{2}s/)
          })
        })
      })
  })

  it('should handle result card expansion for full results', () => {
    // Complete a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-content').contains('Close').click()

    // Check expandable results in result card
    cy.get('.results-section .race-result-card')
      .first()
      .within(() => {
        cy.get('.all-results').should('exist')
        cy.get('.show-all').should('contain', 'Show all 10 horses')

        // Expand results
        cy.get('.show-all').click()

        // Should show all remaining horses
        cy.get('.result-row').should('have.length.at.least', 7)

        // Each result row should have position, horse name, and time
        cy.get('.result-row').each(($row) => {
          cy.wrap($row).within(() => {
            cy.get('.position-num').should('exist').invoke('text').should('not.be.empty')
            cy.get('.horse-name-small').should('exist').invoke('text').should('not.be.empty')
            cy.get('.time-small')
              .should('exist')
              .invoke('text')
              .should('match', /\d+\.\d{2}s/)
          })
        })
      })
  })

  it('should maintain result consistency between modal and results section', () => {
    let modalWinner: string

    // Complete a race and capture modal winner
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')

    cy.get('.modal-content .podium-item')
      .first()
      .find('.horse-name-mini')
      .then(($winner) => {
        modalWinner = $winner.text()

        cy.get('.modal-content').contains('Close').click()

        // Check that same winner appears in results section
        cy.get('.results-section .race-result-card')
          .first()
          .within(() => {
            cy.get('.podium-item').first().find('.horse-name-mini').should('contain', modalWinner)
          })
      })
  })

  it('should show empty state when no races completed', () => {
    // Don't run any races, just check empty state
    cy.get('.results-section').within(() => {
      cy.contains('Race results will appear here after completing races')
      cy.get('.empty-icon').should('contain', '🏁')
      cy.get('.race-result-card').should('not.exist')
    })
  })
})
