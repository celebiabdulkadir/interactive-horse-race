import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseListItems from '../HorseListItems.vue'
import { createStore } from 'vuex'
import type { Horse, Race } from '../../store/types'

// Mock child components
vi.mock('../HorseRace.vue', () => ({
  default: { name: 'HorseRace', template: '<div class="horse-race-mock"></div>' },
}))

function makeStore(currentRace: Race | null = null, isRacing: boolean = false) {
  return createStore({
    modules: {
      races: {
        namespaced: true,
        getters: {
          currentRace: () => currentRace,
          isRacing: () => isRacing,
        },
      },
    },
  })
}

describe('HorseListItems.vue', () => {
  it('renders nothing when no current race', () => {
    const store = makeStore(null)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.find('.track-container').exists()).toBe(false)
  })

  it('renders track container when current race exists', () => {
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

    const store = makeStore(currentRace)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.find('.track-container').exists()).toBe(true)
    expect(wrapper.find('.track').exists()).toBe(true)
    expect(wrapper.find('.finish-line').exists()).toBe(true)
    expect(wrapper.find('.lanes-container').exists()).toBe(true)
  })

  it('renders correct number of lanes for horses', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 0, speed: 1 },
      { id: 2, name: 'Lightning Flash', color: '#00ff00', condition: 92, position: 50, speed: 1 },
      { id: 3, name: 'Storm Rider', color: '#0000ff', condition: 78, position: 25, speed: 1 },
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.findAll('.lane').length).toBe(3)
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

    const store = makeStore(currentRace)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    expect(wrapper.text()).toContain('Thunder Bolt')
    expect(wrapper.text()).toContain('Lightning Flash')
    expect(wrapper.findAll('.lane-number').length).toBe(2)
  })

  it('shows running animation when race is in progress', () => {
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

    const store = makeStore(currentRace, true)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    const horseElement = wrapper.find('.horse')
    expect(horseElement.classes()).toContain('running')
  })

  it('calculates horse progress correctly', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#ff0000', condition: 85, position: 600, speed: 1 }, // 50% progress
    ]

    const currentRace: Race = {
      id: 1,
      round: 1,
      distance: 1200,
      horses: horses,
      results: [],
      status: 'pending',
    }

    const store = makeStore(currentRace)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    const horseElement = wrapper.find('.horse')
    const style = horseElement.attributes('style')
    expect(style).toContain('left: calc(47.5%)') // 50% of 95% max
  })

  it('applies correct horse colors', () => {
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

    const store = makeStore(currentRace)
    const wrapper = mount(HorseListItems, {
      global: {
        plugins: [store],
      },
    })

    const lane = wrapper.find('.lane')
    const style = lane.attributes('style')
    expect(style).toContain('--horse-color: #ff0000')
  })
})
