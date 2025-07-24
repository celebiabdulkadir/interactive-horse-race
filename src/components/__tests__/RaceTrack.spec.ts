import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrack from '../RaceTrack.vue'
import { createStore } from 'vuex'
import type { Horse, Race } from '../../store/types'

// Mock child components
vi.mock('../HorseRace.vue', () => ({
  default: { name: 'HorseRace', template: '<div class="horse-race-mock"></div>' },
}))
vi.mock('../Countdown.vue', () => ({
  default: { name: 'Countdown', template: '<div class="countdown-mock"></div>' },
}))
vi.mock('../ResultModal.vue', () => ({
  default: { name: 'ResultModal', template: '<div class="result-modal-mock"></div>' },
}))
vi.mock('../HorseListItems.vue', () => ({
  default: { name: 'HorseListItems', template: '<div class="horse-list-items-mock"></div>' },
}))

function makeStore(
  currentRace: Race | null = null,
  canStartRace: boolean = false,
  canMoveToNextRound: boolean = false,
  isAllRacesFinished: boolean = false,
  isRacing: boolean = false,
  isScheduleGenerated: boolean = false,
) {
  const nextRoundSpy = vi.fn()
  const resetAllSpy = vi.fn()
  const resetPositionsSpy = vi.fn()

  const store = createStore({
    modules: {
      races: {
        namespaced: true,
        getters: {
          currentRace: () => currentRace,
          canStartRace: () => canStartRace,
          canMoveToNextRound: () => canMoveToNextRound,
          isAllRacesFinished: () => isAllRacesFinished,
          isRacing: () => isRacing,
          isScheduleGenerated: () => isScheduleGenerated,
        },
        actions: {
          startCurrentRace: vi.fn(),
          nextRound: nextRoundSpy,
          resetAll: resetAllSpy,
        },
      },
      horses: {
        namespaced: true,
        actions: {
          resetPositions: resetPositionsSpy,
        },
      },
    },
  })

  // Attach spies to store for easy access in tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(store as any).spies = {
    nextRound: nextRoundSpy,
    resetAll: resetAllSpy,
    resetPositions: resetPositionsSpy,
  }

  return store
}

describe('RaceTrack.vue', () => {
  it('shows empty state when no race is selected', () => {
    const store = makeStore(null, false, false, false, false, false)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Readty to Race!')
    expect(wrapper.text()).toContain('Generate horses and schedule to start racing')
    expect(wrapper.find('.no-race').exists()).toBe(true)
    expect(wrapper.find('.horse-list-items-mock').exists()).toBe(false)
  })

  it('shows schedule generated message when schedule exists but no current race', () => {
    const store = makeStore(null, false, false, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Select a Race')
    expect(wrapper.text()).toContain('Click "Start Race" to begin the current round')
  })

  it('shows all races completed message', () => {
    const store = makeStore(null, false, false, true, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('🎉 All Races Completed!')
    expect(wrapper.text()).toContain('Check the results below for winners and statistics')
  })

  it('renders race track when current race exists', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
      { id: 2, name: 'Lightning Flash', color: '#00ff00', condition: 92, position: 100, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace, true, false, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.find('.horse-list-items-mock').exists()).toBe(true)
    expect(wrapper.text()).toContain('Round 1 - 1200m')
    expect(wrapper.text()).toContain('PENDING')
  })

  it('shows start race button when race can be started', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace, true, false, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    const startButton = wrapper.find('.btn-race')
    expect(startButton.exists()).toBe(true)
    expect(startButton.text()).toBe('Start Race')
    expect(startButton.attributes('disabled')).toBeUndefined()
  })

  it('disables start race button when race cannot be started', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace, false, false, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    const startButton = wrapper.find('.btn-race')
    expect(startButton.exists()).toBe(true)
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('shows racing status when race is in progress', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'running',
    }

    const store = makeStore(currentRace, false, false, false, true, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('RUNNING')
    expect(wrapper.find('.btn-race').text()).toBe('Racing...')
  })

  it('shows next round button when race can move to next round', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [{ position: 1, horse: horses[0], time: 10.5 }],
      status: 'finished',
    }

    const store = makeStore(currentRace, false, true, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    const nextButton = wrapper.find('.btn-next')
    expect(nextButton.exists()).toBe(true)
    expect(nextButton.text()).toBe('Next Round')
  })

  it('shows reset all button when all races are finished', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 6,
      round: 6,
      distance: 2200,
      horses: horses,
      results: [{ position: 1, horse: horses[0], time: 15.5 }],
      status: 'finished',
    }

    const store = makeStore(currentRace, false, false, true, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    const resetButton = wrapper.find('.btn-reset')
    expect(resetButton.exists()).toBe(true)
    expect(resetButton.text()).toBe('Reset All')
  })

  it('calls store actions when buttons are clicked', async () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [{ position: 1, horse: horses[0], time: 10.5 }],
      status: 'finished',
    }

    const store = makeStore(currentRace, false, true, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    // Test next round button
    const nextButton = wrapper.find('.btn-next')
    await nextButton.trigger('click')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((store as any).spies.nextRound).toHaveBeenCalled()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((store as any).spies.resetPositions).toHaveBeenCalled()
  })

  it('displays horse information in lanes', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
      { id: 2, name: 'Lightning Flash', color: '#00ff00', condition: 92, position: 50, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace, true, false, false, false, true)
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [store],
      },
    })

    // Since HorseListItems is mocked, we check that it's rendered
    expect(wrapper.find('.horse-list-items-mock').exists()).toBe(true)
  })
})
