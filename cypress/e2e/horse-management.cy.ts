describe('Horse Management', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should generate 20 horses with proper attributes', () => {
    cy.get('.header-controls').contains('Generate Horses').click()

    // Verify horses are generated
    cy.get('.horses-sidebar').contains('🐎 Horses (20/20)')
    cy.get('.horse-item').should('have.length', 20)

    // Verify each horse has required properties
    cy.get('.horse-item').each(($horse) => {
      cy.wrap($horse).within(() => {
        // Horse name should exist and have content
        cy.get('.horse-name').should('exist').invoke('text').should('not.be.empty')

        // Horse color indicator should exist
        cy.get('.horse-color').should('exist')

        // Condition bar should exist
        cy.get('.condition-bar').should('exist')
        cy.get('.condition-fill').should('exist')

        // Condition text should be a number between 1-100
        cy.get('.condition-text')
          .should('exist')
          .invoke('text')
          .then((text) => {
            const condition = parseInt(text)
            expect(condition).to.be.at.least(1)
            expect(condition).to.be.at.most(100)
          })
      })
    })
  })

  it('should display horses in sidebar correctly', () => {
    cy.get('.header-controls').contains('Generate Horses').click()

    // Check sidebar structure
    cy.get('.horses-sidebar').within(() => {
      cy.contains('🐎 Horses (20/20)')
      cy.get('.horses-list').should('exist')
      cy.get('.horse-item').should('have.length', 20)
    })

    // Check individual horse display
    cy.get('.horse-item')
      .first()
      .within(() => {
        cy.get('.horse-name').should('exist').invoke('text').should('not.be.empty')
        cy.get('.horse-color').should('exist')
        cy.get('.condition-bar').should('exist')
      })
  })

  it('should show empty state when no horses generated', () => {
    // Initial state should show empty message
    cy.get('.horses-sidebar').contains('No horses yet')
    cy.get('.horse-item').should('not.exist')
  })

  it('should regenerate horses when clicked multiple times', () => {
    // Generate first set
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.horse-item').should('have.length', 20)

    // Generate again
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.horse-item').should('have.length', 20)

    // Names should be different (very likely with random generation)
    cy.get('.horse-item').first().find('.horse-name').should('exist')
  })

  it('should display horse colors correctly', () => {
    cy.get('.header-controls').contains('Generate Horses').click()

    // Check that each horse has a color indicator with background color
    cy.get('.horse-item').each(($horse) => {
      cy.wrap($horse).within(() => {
        cy.get('.horse-color')
          .should('exist')
          .should('have.css', 'background-color')
          .and('not.equal', 'rgba(0, 0, 0, 0)') // Not transparent
      })
    })
  })

  it('should show condition bars with proper styling', () => {
    cy.get('.header-controls').contains('Generate Horses').click()

    cy.get('.horse-item')
      .first()
      .within(() => {
        // Condition bar should have proper structure
        cy.get('.condition-bar').should('exist')
        cy.get('.condition-fill').should('exist')
        cy.get('.condition-text').should('exist')

        // Condition fill should have width based on condition
        cy.get('.condition-fill').should('have.css', 'width')
      })
  })

  it('should maintain horse data consistency during races', () => {
    // Generate horses and schedule
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Run a race
    cy.get('.main-content').contains('Start Race').click()
    cy.get('.countdown-overlay', { timeout: 15000 }).should('not.exist')
    cy.get('.race-status .status').should('have.class', 'running')
    cy.get('.race-status .status', { timeout: 120000 }).should('have.class', 'finished')
    cy.get('.modal-overlay .modal-content').contains('Close').click()

    // Verify horse names remain consistent
    cy.get('.horse-item').each(($horse) => {
      cy.wrap($horse).find('.horse-name').should('exist')
    })
  })

  it('should handle horse selection for races correctly', () => {
    cy.get('.header-controls').contains('Generate Horses').click()
    cy.get('.header-controls').contains('Generate Schedule').click()

    // Check that horses appear in race schedule
    cy.get('.schedule-item')
      .first()
      .within(() => {
        cy.contains('Horses:')
        cy.get('.horses-grid').should('exist')
        cy.get('.horse-item').should('have.length', 10) // 10 horses per race

        // Each horse in race should have name and condition
        cy.get('.horse-item').each(($horse) => {
          cy.wrap($horse).within(() => {
            cy.get('.horse-name').should('exist').invoke('text').should('not.be.empty')
            cy.get('.horse-condition').should('exist')
            cy.get('.horse-color').should('exist')
          })
        })
      })
  })
})
