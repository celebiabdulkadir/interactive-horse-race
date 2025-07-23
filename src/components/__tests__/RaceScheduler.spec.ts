import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import RaceScheduler from '../RaceScheduler.vue'
import { createStore } from 'vuex'
import type { Horse, Race } from '../../store/types'

function makeStore(horses: Horse[] = [], races: Race[] = [], currentRound: number = 1) {
  return createStore({
    modules: {
      horses: {
        namespaced: true,
        getters: {
          getAllHorses: () => horses,
        },
      },
      races: {
        namespaced: true,
        getters: {
          allRaces: () => races,
          currentRound: () => currentRound,
          totalRounds: () => 6,
        },
      },
    },
  })
}

describe('RaceScheduler.vue', () => {
  it('shows warning when no horses available', () => {
    const store = makeStore([], [])
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('⚠️ Generate horses first')
    expect(wrapper.findAll('.schedule-item').length).toBe(0)
  })

  it('shows empty schedule state when horses exist but no races', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
    ]
    const store = makeStore(horses, [])
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('No schedule')
    expect(wrapper.text()).toContain('Generate schedule to start racing')
  })

  it('renders race schedule when races exist', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
      { id: 2, name: 'Second Horse', color: '#000', condition: 60, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [],
        status: 'pending',
      },
      {
        id: 2,
        round: 2,
        distance: 1400,
        horses: horses,
        results: [],
        status: 'pending',
      },
    ]
    const store = makeStore(horses, races, 1)
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.findAll('.schedule-item').length).toBe(2)
    expect(wrapper.text()).toContain('R1')
    expect(wrapper.text()).toContain('R2')
    expect(wrapper.text()).toContain('1200m')
    expect(wrapper.text()).toContain('1400m')
  })

  it('highlights current race', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [],
        status: 'pending',
      },
      {
        id: 2,
        round: 2,
        distance: 1400,
        horses: horses,
        results: [],
        status: 'pending',
      },
    ]
    const store = makeStore(horses, races, 1) // Current round is 1
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    const scheduleItems = wrapper.findAll('.schedule-item')
    expect(scheduleItems[0].classes()).toContain('current')
    expect(scheduleItems[1].classes()).not.toContain('current')
  })

  it('shows different race statuses', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [{ position: 1, horse: horses[0], time: 10.5 }],
        status: 'finished',
        winner: horses[0],
      },
      {
        id: 2,
        round: 2,
        distance: 1400,
        horses: horses,
        results: [],
        status: 'running',
      },
      {
        id: 3,
        round: 3,
        distance: 1600,
        horses: horses,
        results: [],
        status: 'pending',
      },
    ]
    const store = makeStore(horses, races, 2)
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    const scheduleItems = wrapper.findAll('.schedule-item')
    expect(scheduleItems[0].classes()).toContain('finished')
    expect(scheduleItems[1].classes()).toContain('running')
    expect(scheduleItems[2].classes()).not.toContain('finished')
    expect(scheduleItems[2].classes()).not.toContain('running')

    expect(wrapper.text()).toContain('finished')
    expect(wrapper.text()).toContain('running')
    expect(wrapper.text()).toContain('pending')
    expect(wrapper.text()).toContain('🏁 Test Horse') // Winner display
  })

  it('displays round indicator correctly', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [],
        status: 'pending',
      },
    ]
    const store = makeStore(horses, races, 3) // Current round is 3
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('3/6') // Current round / total rounds
  })

  it('shows horse information in race details', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
      { id: 2, name: 'Lightning Flash', color: '#00ff00', condition: 92, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [],
        status: 'pending',
      },
    ]
    const store = makeStore(horses, races, 1)
    const wrapper = shallowMount(RaceScheduler, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('Thunder Bolt')
    expect(wrapper.text()).toContain('Lightning Flash')
    expect(wrapper.text()).toContain('2 total') // Horse count
  })
})
