import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
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
    const wrapper = mount(RaceResult, {
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
    const wrapper = mount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.findAll('.race-result-card').length).toBe(2)
    expect(wrapper.text()).toContain('2/6 completed')
  })

  it('displays race result cards with correct information', () => {
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
    ]

    const store = makeStore(results)
    const wrapper = mount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    // Check that race result cards are rendered
    expect(wrapper.findAll('.race-result-card').length).toBe(1)

    // Check that horse names are displayed
    expect(wrapper.text()).toContain('Thunder Bolt')
    expect(wrapper.text()).toContain('Lightning Flash')

    // Check that times are displayed
    expect(wrapper.text()).toContain('10.50s')
    expect(wrapper.text()).toContain('11.20s')

    // Check that round information is displayed
    expect(wrapper.text()).toContain('R1')
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
    const wrapper = mount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('3/6 completed')
    expect(wrapper.findAll('.race-result-card').length).toBe(3)
  })

  it('displays podium positions with medals', () => {
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
        { position: 3, horse: horse3, time: 12.0 },
      ],
    ]

    const store = makeStore(results)
    const wrapper = mount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    // Check that medals are displayed
    expect(wrapper.text()).toContain('🥇')
    expect(wrapper.text()).toContain('🥈')
    expect(wrapper.text()).toContain('🥉')
  })

  it('handles empty results array', () => {
    const results: RaceResultType[][] = [
      [], // Empty results array
    ]

    const store = makeStore(results)
    const wrapper = mount(RaceResult, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('1/6 completed')
    expect(wrapper.findAll('.race-result-card').length).toBe(1)
  })
})
