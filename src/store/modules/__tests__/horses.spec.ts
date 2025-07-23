import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import horsesModule from '../horses'
import type { HorsesState } from '../horses'
import type { Horse } from '../../types'

function getInitialState(): HorsesState {
  return {
    horses: [],
    totalHorses: 20,
  }
}

describe('horses Vuex module', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any

  beforeEach(() => {
    store = createStore({
      modules: {
        horses: {
          ...horsesModule,
          state: getInitialState(),
        },
      },
    })
  })

  it('initializes with empty horses array', () => {
    expect(store.state.horses.horses).toEqual([])
    expect(store.state.horses.totalHorses).toBe(20)
  })

  it('SET_HORSES mutation sets horses', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test', color: '#fff', condition: 50, position: 0, speed: 1 },
    ]
    store.commit('horses/SET_HORSES', horses)
    expect(store.state.horses.horses).toEqual(horses)
  })

  it('UPDATE_HORSE_POSITION mutation updates position', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test', color: '#fff', condition: 50, position: 0, speed: 1 },
    ]
    store.commit('horses/SET_HORSES', horses)
    store.commit('horses/UPDATE_HORSE_POSITION', { horseId: 1, position: 42 })
    expect(store.state.horses.horses[0].position).toBe(42)
  })

  it('UPDATE_HORSE_SPEED mutation updates speed', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test', color: '#fff', condition: 50, position: 0, speed: 1 },
    ]
    store.commit('horses/SET_HORSES', horses)
    store.commit('horses/UPDATE_HORSE_SPEED', { horseId: 1, speed: 3.14 })
    expect(store.state.horses.horses[0].speed).toBe(3.14)
  })

  it('RESET_HORSE_POSITIONS mutation resets all positions to 0', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Test', color: '#fff', condition: 50, position: 99, speed: 1 },
      { id: 2, name: 'Test2', color: '#000', condition: 60, position: 88, speed: 2 },
    ]
    store.commit('horses/SET_HORSES', horses)
    store.commit('horses/RESET_HORSE_POSITIONS')
    expect(store.state.horses.horses.every((h: Horse) => h.position === 0)).toBe(true)
  })

  it('generateHorses action generates 20 horses', async () => {
    await store.dispatch('horses/generateHorses')
    expect(store.state.horses.horses.length).toBe(20)
    store.state.horses.horses.forEach((horse: Horse, i: number) => {
      expect(horse.id).toBe(i + 1)
      expect(typeof horse.name).toBe('string')
      expect(typeof horse.color).toBe('string')
      expect(typeof horse.condition).toBe('number')
      expect(horse.position).toBe(0)
      expect(typeof horse.speed).toBe('number')
    })
  })

  it('updateHorsePosition action commits UPDATE_HORSE_POSITION', async () => {
    await store.dispatch('horses/generateHorses')
    const horse = store.state.horses.horses[0]
    await store.dispatch('horses/updateHorsePosition', { horseId: horse.id, position: 77 })
    expect(store.state.horses.horses[0].position).toBe(77)
  })

  it('updateHorseSpeed action commits UPDATE_HORSE_SPEED', async () => {
    await store.dispatch('horses/generateHorses')
    const horse = store.state.horses.horses[0]
    await store.dispatch('horses/updateHorseSpeed', { horseId: horse.id, speed: 2.5 })
    expect(store.state.horses.horses[0].speed).toBe(2.5)
  })

  it('resetPositions action commits RESET_HORSE_POSITIONS', async () => {
    await store.dispatch('horses/generateHorses')
    store.state.horses.horses[0].position = 99
    await store.dispatch('horses/resetPositions')
    expect(store.state.horses.horses.every((h: Horse) => h.position === 0)).toBe(true)
  })
})
