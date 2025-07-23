import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import RaceResult from '../RaceResult.vue'
import { createStore } from 'vuex'
import type { Horse, RaceResult as RaceResultType, Race } from '../../store/types'

function makeStore(
  allResults: RaceResultType[][] = [],
  currentRace: Race | null = null,
  isRacing: boolean = false,
  isShowingResults: boolean = false,
) {
  return createStore({
    modules: {
      races: {
        namespaced: true,
        getters: {
          allResults: () => allResults,
          totalRounds: () => 6,
          currentRace: () => currentRace,
          isRacing: () => isRacing,
          isShowingResults: () => isShowingResults,
          currentRaceResults: () => [],
        },
      },
    },
  })
}

describe('RaceResult.vue', () => {
  it('shows empty state when no results', () => {
    const store = makeStore([])
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('Race results will appear here after completing races')
    expect(wrapper.findAll('.race-result-card').length).toBe(0)
  })

  it('renders race results when available', () => {
    const horse1: Horse = {
      id: 1,
      name: 'Thunder Bolt',
      color: '#ff0000',
      condition: 85,
      position: 0,
      speed: 1,
    }
    const horse2: Horse = {
      id: 2,
      name: 'Lightning Flash',
      color: '#00ff00',
      condition: 92,
      position: 0,
      speed: 1,
    }

    const results: RaceResultType[][] = [
      [
        { position: 1, horse: horse1, time: 10.5 },
        { position: 2, horse: horse2, time: 11.2 },
      ],
      [
        { position: 1, horse: horse2, time: 12.1 },
        { position: 2, horse: horse1, time: 12.8 },
      ],
    ]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.findAll('.race-result-card').length).toBe(2)
    expect(wrapper.text()).toContain('2/6 completed')
  })

  it('calculates and displays quick stats correctly', () => {
    const horse1: Horse = {
      id: 1,
      name: 'Thunder Bolt',
      color: '#ff0000',
      condition: 85,
      position: 0,
      speed: 1,
    }
    const horse2: Horse = {
      id: 2,
      name: 'Lightning Flash',
      color: '#00ff00',
      condition: 92,
      position: 0,
      speed: 1,
    }
    const horse3: Horse = {
      id: 3,
      name: 'Storm Rider',
      color: '#0000ff',
      condition: 78,
      position: 0,
      speed: 1,
    }

    const results: RaceResultType[][] = [
      [
        { position: 1, horse: horse1, time: 10.0 },
        { position: 2, horse: horse2, time: 11.0 },
      ],
      [
        { position: 1, horse: horse1, time: 12.0 },
        { position: 2, horse: horse3, time: 13.0 },
      ],
      [
        { position: 1, horse: horse2, time: 14.0 },
        { position: 2, horse: horse1, time: 15.0 },
      ],
    ]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    // Different winners: horse1, horse1, horse2 = 2 different winners
    expect(wrapper.text()).toContain('2') // Different Winners

    // Most wins: horse1 has 2 wins
    expect(wrapper.text()).toContain('2') // Most Wins

    // Average time: (10.0 + 12.0 + 14.0) / 3 = 12.00
    expect(wrapper.text()).toContain('12.00s') // Avg Winner Time
  })

  it('displays champion information when available', () => {
    const horse1: Horse = {
      id: 1,
      name: 'Thunder Bolt',
      color: '#ff0000',
      condition: 85,
      position: 0,
      speed: 1,
    }
    const horse2: Horse = {
      id: 2,
      name: 'Lightning Flash',
      color: '#00ff00',
      condition: 92,
      position: 0,
      speed: 1,
    }

    const results: RaceResultType[][] = [
      [
        { position: 1, horse: horse1, time: 10.0 },
        { position: 2, horse: horse2, time: 11.0 },
      ],
      [
        { position: 1, horse: horse1, time: 12.0 },
        { position: 2, horse: horse2, time: 13.0 },
      ],
    ]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Thunder Bolt') // Champion name
    expect(wrapper.text()).toContain('2 wins') // Champion wins
    expect(wrapper.text()).toContain('👑') // Crown emoji
  })

  it('handles single race result correctly', () => {
    const horse1: Horse = {
      id: 1,
      name: 'Thunder Bolt',
      color: '#ff0000',
      condition: 85,
      position: 0,
      speed: 1,
    }

    const results: RaceResultType[][] = [[{ position: 1, horse: horse1, time: 10.5 }]]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('1/6 completed')
    expect(wrapper.text()).toContain('1') // Different Winners
    expect(wrapper.text()).toContain('1') // Most Wins
    expect(wrapper.text()).toContain('10.50s') // Avg Winner Time
  })

  it('shows correct results count', () => {
    const horse1: Horse = {
      id: 1,
      name: 'Thunder Bolt',
      color: '#ff0000',
      condition: 85,
      position: 0,
      speed: 1,
    }

    const results: RaceResultType[][] = [
      [{ position: 1, horse: horse1, time: 10.0 }],
      [{ position: 1, horse: horse1, time: 11.0 }],
      [{ position: 1, horse: horse1, time: 12.0 }],
    ]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('3/6 completed')
    expect(wrapper.findAll('.race-result-card').length).toBe(3)
  })

  it('handles edge case with no winner times', () => {
    const results: RaceResultType[][] = [
      [], // Empty results array
    ]

    const store = makeStore(results)
    const wrapper = shallowMount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('0.00s') // Should show 0.00 for average time
    expect(wrapper.text()).toContain('0') // Different Winners should be 0
  })
})
