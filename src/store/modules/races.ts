import type { Module } from 'vuex'
import {
  RACE_DISTANCES,
  type Race,
  type RaceResult,
  type RaceSchedule,
  type RootState,
} from '../types'

export interface RacesState {
  schedule: RaceSchedule
  isRacing: boolean
  allResults: RaceResult[][]
}

const racesModule: Module<RacesState, RootState> = {
  namespaced: true,

  state: (): RacesState => ({
    schedule: {
      races: [],
      currentRound: 0,
      totalRounds: 6,
    },
    isRacing: false,
    allResults: [],
  }),

  mutations: {
    SET_RACE_SCHEDULE(state, races: Race[]) {
      state.schedule.races = races
      state.schedule.currentRound = 0
      state.allResults = []
    },

    START_RACE(state) {
      state.isRacing = true
      if (state.schedule.races[state.schedule.currentRound]) {
        state.schedule.races[state.schedule.currentRound].status = 'running'
      }
    },

    FINISH_RACE(state, results: RaceResult[]) {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      if (currentRace) {
        currentRace.results = results
        currentRace.status = 'finished'
        currentRace.winner = results[0]?.horse
        state.allResults.push(results)
      }
      state.isRacing = false
    },

    NEXT_ROUND(state) {
      if (state.schedule.currentRound < state.schedule.totalRounds - 1) {
        state.schedule.currentRound++
      }
    },

    RESET_RACES(state) {
      state.schedule.races = []
      state.schedule.currentRound = 0
      state.allResults = []
      state.isRacing = false
    },
  },

  actions: {
    generateRaceSchedule({ commit, rootGetters }) {
      const horses = rootGetters['horses/getAllHorses']
      if (horses.length === 0) {
        throw new Error('No horses available. Please generate horses first.')
      }

      const races: Race[] = []

      for (let round = 0; round < 6; round++) {
        // Get 10 random horses for this race
        const raceHorses = rootGetters['horses/getRandomHorses'](10)

        const race: Race = {
          id: round + 1,
          round: round + 1,
          distance: RACE_DISTANCES[round],
          horses: raceHorses,
          results: [],
          status: 'pending',
        }

        races.push(race)
      }

      commit('SET_RACE_SCHEDULE', races)
    },

    async startCurrentRace({ state, commit, dispatch }) {
      if (state.isRacing) return

      const currentRace = state.schedule.races[state.schedule.currentRound]
      if (!currentRace || currentRace.status !== 'pending') return

      commit('START_RACE')

      // Reset horse positions before starting
      await dispatch('horses/resetPositions', null, { root: true })

      // Simulate the race
      await dispatch('simulateRace', currentRace)
    },

    async simulateRace({ commit, dispatch }, race: Race) {
      const raceDistance = race.distance
      const raceDuration = 10000 // 10 seconds per race
      const updateInterval = 50 // Update every 50ms
      const totalUpdates = raceDuration / updateInterval

      return new Promise<void>((resolve) => {
        let updateCount = 0
        const raceInterval = setInterval(() => {
          updateCount++
          const progress = updateCount / totalUpdates

          // Update each horse's position with some randomness
          race.horses.forEach((horse) => {
            const baseProgress = progress
            const speedVariation = horse.speed * (0.8 + Math.random() * 0.4) // Speed variation
            const randomFactor = Math.random() * 0.1 // Small random factor
            const horseProgress = Math.min(1, baseProgress * speedVariation + randomFactor)

            const newPosition = horseProgress * raceDistance
            dispatch(
              'horses/updateHorsePosition',
              { horseId: horse.id, position: newPosition },
              { root: true },
            )
          })

          // Finish race when time is up
          if (updateCount >= totalUpdates) {
            clearInterval(raceInterval)

            // Calculate final results
            const sortedHorses = [...race.horses].sort((a, b) => {
              // Final race logic with condition and some randomness
              const aScore = a.condition + Math.random() * 20
              const bScore = b.condition + Math.random() * 20
              return bScore - aScore
            })

            const results: RaceResult[] = sortedHorses.map((horse, index) => ({
              position: index + 1,
              horse,
              time: raceDuration / 1000 + (Math.random() * 2 - 1), // Base time ± 1 second
            }))

            commit('FINISH_RACE', results)
            resolve()
          }
        }, updateInterval)
      })
    },

    nextRound({ state, commit }) {
      if (state.schedule.currentRound < state.schedule.totalRounds - 1) {
        commit('NEXT_ROUND')
      }
    },

    resetAll({ commit }) {
      commit('RESET_RACES')
    },
  },

  getters: {
    currentRace: (state) => {
      return state.schedule.races[state.schedule.currentRound] || null
    },

    allRaces: (state) => state.schedule.races,

    currentRound: (state) => state.schedule.currentRound + 1,

    totalRounds: (state) => state.schedule.totalRounds,

    isRacing: (state) => state.isRacing,

    allResults: (state) => state.allResults,

    isScheduleGenerated: (state) => state.schedule.races.length > 0,

    canStartRace: (state) => {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      return currentRace && currentRace.status === 'pending' && !state.isRacing
    },

    canMoveToNextRound: (state) => {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      return (
        currentRace &&
        currentRace.status === 'finished' &&
        state.schedule.currentRound < state.schedule.totalRounds - 1
      )
    },

    isAllRacesFinished: (state) => {
      return (
        state.schedule.currentRound === state.schedule.totalRounds - 1 &&
        state.schedule.races[state.schedule.currentRound]?.status === 'finished'
      )
    },
  },
}

export default racesModule
