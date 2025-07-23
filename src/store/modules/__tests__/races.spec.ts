import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import racesModule from '../races'
import type { RacesState } from '../races'
import type { Race, Horse } from '../../types'

function getInitialState(): RacesState {
  return {
    schedule: {
      races: [],
      currentRound: 0,
      totalRounds: 6,
    },
    isRacing: false,
    allResults: [],
  }
}

describe('races Vuex module', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any

  beforeEach(() => {
    store = createStore({
      modules: {
        races: {
          ...racesModule,
          state: getInitialState(),
        },
        horses: {
          namespaced: true,
          getters: {
            getAllHorses: () =>
              Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                name: `Horse ${i + 1}`,
                color: '#fff',
                condition: 50,
                position: 0,
                speed: 1,
              })),
            getRandomHorses: () => (count: number) =>
              Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                name: `Horse ${i + 1}`,
                color: '#fff',
                condition: 50,
                position: 0,
                speed: 1,
              })),
          },
          actions: {
            resetPositions: vi.fn(),
            updateHorsePosition: vi.fn(),
            updateHorseSpeed: vi.fn(),
          },
        },
      },
    })
  })

  it('initializes with correct default state', () => {
    expect(store.state.races.schedule.races).toEqual([])
    expect(store.state.races.schedule.currentRound).toBe(0)
    expect(store.state.races.schedule.totalRounds).toBe(6)
    expect(store.state.races.isRacing).toBe(false)
    expect(store.state.races.allResults).toEqual([])
  })

  it('SET_RACE_SCHEDULE mutation sets races and resets round/results', () => {
    const races: Race[] = [
      { id: 1, round: 1, distance: 1200, horses: [], results: [], status: 'pending' },
    ]
    store.commit('races/SET_RACE_SCHEDULE', races)
    expect(store.state.races.schedule.races).toEqual(races)
    expect(store.state.races.schedule.currentRound).toBe(0)
    expect(store.state.races.allResults).toEqual([])
  })

  it('START_RACE mutation sets isRacing and updates race status', () => {
    const races: Race[] = [
      { id: 1, round: 1, distance: 1200, horses: [], results: [], status: 'pending' },
    ]
    store.commit('races/SET_RACE_SCHEDULE', races)
    store.commit('races/START_RACE')
    expect(store.state.races.isRacing).toBe(true)
    expect(store.state.races.schedule.races[0].status).toBe('running')
  })

  it('FINISH_RACE mutation sets results, status, winner, and stops racing', () => {
    const horse: Horse = {
      id: 1,
      name: 'Test',
      color: '#fff',
      condition: 50,
      position: 0,
      speed: 1,
    }
    const races: Race[] = [
      { id: 1, round: 1, distance: 1200, horses: [horse], results: [], status: 'pending' },
    ]
    store.commit('races/SET_RACE_SCHEDULE', races)
    store.commit('races/START_RACE')
    const results = [{ position: 1, horse, time: 10 }]
    store.commit('races/FINISH_RACE', results)
    expect(store.state.races.schedule.races[0].results).toEqual(results)
    expect(store.state.races.schedule.races[0].status).toBe('finished')
    expect(store.state.races.schedule.races[0].winner).toEqual(horse)
    expect(store.state.races.isRacing).toBe(false)
    expect(store.state.races.allResults[0]).toEqual(results)
  })

  it('NEXT_ROUND mutation increments currentRound', () => {
    store.commit('races/NEXT_ROUND')
    expect(store.state.races.schedule.currentRound).toBe(1)
  })

  it('RESET_RACES mutation resets races, round, results, and isRacing', () => {
    store.commit('races/RESET_RACES')
    expect(store.state.races.schedule.races).toEqual([])
    expect(store.state.races.schedule.currentRound).toBe(0)
    expect(store.state.races.allResults).toEqual([])
    expect(store.state.races.isRacing).toBe(false)
  })

  it('generateRaceSchedule action creates 6 races with 10 horses each', async () => {
    await store.dispatch('races/generateRaceSchedule')
    expect(store.state.races.schedule.races.length).toBe(6)
    store.state.races.schedule.races.forEach((race: Race, i: number) => {
      expect(race.id).toBe(i + 1)
      expect(race.horses.length).toBe(10)
      expect(race.status).toBe('pending')
    })
  })

  it('nextRound action commits NEXT_ROUND', async () => {
    store.state.races.schedule.currentRound = 0
    await store.dispatch('races/nextRound')
    expect(store.state.races.schedule.currentRound).toBe(1)
  })

  it('resetAll action commits RESET_RACES', async () => {
    store.state.races.schedule.races = [
      { id: 1, round: 1, distance: 1200, horses: [], results: [], status: 'pending' },
    ]
    await store.dispatch('races/resetAll')
    expect(store.state.races.schedule.races).toEqual([])
    expect(store.state.races.schedule.currentRound).toBe(0)
    expect(store.state.races.allResults).toEqual([])
    expect(store.state.races.isRacing).toBe(false)
  })
})
