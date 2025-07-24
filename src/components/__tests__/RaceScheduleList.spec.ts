import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceScheduleList from '../RaceScheduleList.vue'
import { createStore } from 'vuex'
import type { Horse, Race } from '../../store/types'

function makeStore(races: Race[] = [], currentRound: number = 1) {
  return createStore({
    modules: {
      races: {
        namespaced: true,
        getters: {
          allRaces: () => races,
          currentRound: () => currentRound,
        },
      },
    },
  })
}

describe('RaceScheduleList.vue', () => {
  it('renders empty when no races', () => {
    const store = makeStore([])
    const wrapper = mount(RaceScheduleList, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.findAll('.schedule-item').length).toBe(0)
  })

  it('renders race schedule items', () => {
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
    const store = makeStore(races, 1)
    const wrapper = mount(RaceScheduleList, {
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
    const store = makeStore(races, 1)
    const wrapper = mount(RaceScheduleList, {
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
    const store = makeStore(races, 2)
    const wrapper = mount(RaceScheduleList, {
      global: {
        plugins: [store],
      },
    })

    const scheduleItems = wrapper.findAll('.schedule-item')
    expect(scheduleItems[0].classes()).toContain('finished')
    expect(scheduleItems[1].classes()).toContain('running')
    expect(scheduleItems[2].classes()).not.toContain('finished')
  })

  it('shows winner information for finished races', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
    ]
    const races: Race[] = [
      {
        id: 1,
        round: 1,
        distance: 1200,
        horses: horses,
        results: [{ position: 1, horse: horses[0], time: 10.5 }],
        status: 'finished',
      },
    ]
    const store = makeStore(races, 1)
    const wrapper = mount(RaceScheduleList, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Thunder Bolt')
    expect(wrapper.text()).toContain('Winner Time:')
    expect(wrapper.text()).toContain('10.50s')
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
    const store = makeStore(races, 1)
    const wrapper = mount(RaceScheduleList, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Thunder Bolt')
    expect(wrapper.text()).toContain('Lightning Flash')
    expect(wrapper.text()).toContain('2 total')
  })

  it('displays horse conditions', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
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
    const store = makeStore(races, 1)
    const wrapper = mount(RaceScheduleList, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('85')
  })
})
