import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HorseGenerator from '../HorseGenerator.vue'
import { createStore } from 'vuex'
import type { Horse } from '../../store/types'

function makeStore(horses: Horse[] = []) {
  return createStore({
    modules: {
      horses: {
        namespaced: true,
        state: {
          horses: [...horses],
          totalHorses: 20,
        },
        mutations: {
          SET_HORSES(state, newHorses: Horse[]) {
            state.horses = newHorses
          },
        },
        getters: {
          getAllHorses: (state) => state.horses,
        },
      },
    },
  })
}

describe('HorseGenerator.vue', () => {
  it('renders empty state when no horses', () => {
    const store = makeStore([])
    const wrapper = shallowMount(HorseGenerator, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('No horses yet')
    expect(wrapper.findAll('.horse-item').length).toBe(0)
  })

  it('renders horses when present', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
      { id: 2, name: 'Second Horse', color: '#000', condition: 60, position: 0, speed: 1 },
    ]
    const store = makeStore(horses)
    const wrapper = shallowMount(HorseGenerator, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.findAll('.horse-item').length).toBe(2)
    expect(wrapper.text()).toContain('Test Horse')
    expect(wrapper.text()).toContain('Second Horse')
  })

  it('reacts to changes in horses', async () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test Horse', color: '#fff', condition: 80, position: 0, speed: 1 },
    ]
    const store = makeStore(horses)
    const wrapper = shallowMount(HorseGenerator, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.findAll('.horse-item').length).toBe(1)
    // Simulate horses array update
    store.commit('horses/SET_HORSES', [
      ...horses,
      { id: 2, name: 'New Horse', color: '#abc', condition: 70, position: 0, speed: 1 },
    ])
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('New Horse')
    expect(wrapper.findAll('.horse-item').length).toBe(2)
  })
})
