# Cypress E2E Tests for Horse Racing Game

## Overview

This directory contains comprehensive end-to-end tests for the Interactive Horse Racing Game using Cypress. The tests cover the complete user journey from horse generation to race completion and results viewing.

## Test Structure

### Test Files

1. **`horse-racing-game.cy.ts`** - Main comprehensive test suite

   - Complete user journey testing
   - Application layout verification
   - Full race workflow
   - Multi-race scenarios
   - Game reset functionality
   - Responsive design testing

2. **`horse-management.cy.ts`** - Horse generation and management

   - Horse generation with 20 unique horses
   - Horse property validation (name, color, condition)
   - Horse data consistency during races
   - UI interactions and hover effects

3. **`race-scheduling.cy.ts`** - Race scheduling and progression

   - Schedule generation with 6 races
   - Race status management (pending, running, finished)
   - Round progression and current race highlighting
   - Winner information display
   - Race reset functionality

4. **`race-results.cy.ts`** - Results and statistics

   - Result modal display and interaction
   - Podium results with medals and times
   - Results accumulation across races
   - Statistics calculations (winners, times, champions)
   - Result card expansion and details

5. **`custom-commands-demo.cy.ts`** - Demonstrates custom commands usage

### Custom Commands

Located in `cypress/support/commands.ts`, these commands simplify common test operations:

- `cy.generateHorses()` - Generate and verify 20 horses
- `cy.generateSchedule()` - Generate and verify race schedule
- `cy.setupGame()` - Complete game setup (horses + schedule)
- `cy.completeRace()` - Start race and wait for completion
- `cy.closeResultModal()` - Close the result modal
- `cy.runRace()` - Complete race cycle (start, wait, close modal)
- `cy.runMultipleRaces(count)` - Run multiple races with progression
- `cy.verifyRaceStats()` - Verify statistics display

## Running the Tests

### Prerequisites

1. Ensure the development server is running:

   ```bash
   npm run dev
   ```

2. The app should be accessible at `http://localhost:5173` (configured in `cypress.config.ts`)

### Running Tests

#### Interactive Mode (Cypress GUI)

```bash
npx cypress open
```

- Select "E2E Testing"
- Choose your browser
- Click on test files to run them individually

#### Headless Mode (CI/CD)

```bash
# Run all E2E tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/horse-racing-game.cy.ts"

# Run with specific browser
npx cypress run --browser chrome
```

#### Watch Mode

```bash
npx cypress run --headed --no-exit
```

## Test Coverage

### Core Functionality

- ✅ Horse generation (20 unique horses with properties)
- ✅ Race schedule creation (6 races with different distances)
- ✅ Race execution with countdown and animations
- ✅ Real-time race status updates
- ✅ Result modal display with podium
- ✅ Results accumulation and statistics
- ✅ Round progression and navigation
- ✅ Game reset functionality

### User Interface

- ✅ Application layout and responsiveness
- ✅ Empty states and loading states
- ✅ Button states and interactions
- ✅ Modal behavior and accessibility
- ✅ Hover effects and animations
- ✅ Statistics display and formatting

### Edge Cases

- ✅ Disabled states when prerequisites not met
- ✅ Race completion with all horses finishing
- ✅ Statistics with single and multiple races
- ✅ Result consistency between modal and results section
- ✅ Responsive design on different screen sizes

### Data Integrity

- ✅ Horse data consistency throughout races
- ✅ Race results accuracy and formatting
- ✅ Statistics calculations correctness
- ✅ State management across race progression

## Test Configuration

### Cypress Configuration (`cypress.config.ts`)

```typescript
export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173',
  },
})
```

### Key Settings

- **Base URL**: `http://localhost:5173`
- **Spec Pattern**: All `.cy.ts` files in `cypress/e2e/`
- **Timeout**: 30 seconds for race completion
- **Environment**: jsdom for component testing

## Best Practices

### Test Organization

- Each test file focuses on a specific feature area
- Tests are independent and can run in any order
- Setup is handled in `beforeEach` hooks
- Custom commands reduce code duplication

### Assertions

- Use semantic selectors (CSS classes, data attributes)
- Verify both UI state and functionality
- Check for proper loading states and transitions
- Validate data consistency across components

### Performance

- Tests wait for actual race completion (realistic timing)
- Use appropriate timeouts for animations
- Minimize test execution time with custom commands
- Parallel execution support for CI/CD

## Troubleshooting

### Common Issues

1. **Tests timeout during race completion**

   - Ensure development server is running
   - Check race animation performance
   - Increase timeout if needed: `{ timeout: 45000 }`

2. **Flaky tests due to timing**

   - Use proper Cypress waiting commands
   - Avoid fixed `cy.wait()` delays
   - Wait for specific DOM states

3. **Element not found errors**
   - Verify CSS selectors match current implementation
   - Check for dynamic content loading
   - Use `cy.get().should('exist')` for better error messages

### Debugging

```bash
# Run with debug information
DEBUG=cypress:* npx cypress run

# Open DevTools in headed mode
npx cypress run --headed --browser chrome
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Cypress E2E tests
  run: |
    npm run build
    npm run preview &
    npx wait-on http://localhost:5173
    npx cypress run
```

## Contributing

When adding new features to the horse racing game:

1. Add corresponding E2E tests
2. Update custom commands if needed
3. Verify tests pass in both headed and headless modes
4. Update this documentation for new test coverage
