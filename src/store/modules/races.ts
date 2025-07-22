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

    // NEW: Mark race as showing results but keep animation running
    FIRST_HORSE_FINISHED(state) {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      if (currentRace) {
        currentRace.showingResults = true // New flag for showing results
        // DON'T change status to 'finished' yet - keep it 'running'
      }
    },

    // Only fully finish when ALL horses are done
    FINISH_RACE(state, results: RaceResult[]) {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      if (currentRace) {
        currentRace.results = results
        currentRace.status = 'finished' // NOW we can mark as finished
        currentRace.winner = results[0]?.horse
        currentRace.showingResults = true
        if (!state.allResults[state.schedule.currentRound]) {
          state.allResults.push(results)
        } else {
          state.allResults[state.schedule.currentRound] = results
        }
      }
      state.isRacing = false // NOW we can stop racing
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

    UPDATE_RACE_RESULTS(state, { raceIndex, results }) {
      if (state.schedule.races[raceIndex]) {
        state.schedule.races[raceIndex].results = results
        // Update the overall results array
        if (state.allResults[raceIndex]) {
          state.allResults[raceIndex] = results
        } else {
          state.allResults.push(results)
        }
      }
    },

    ADD_HORSE_TO_RESULTS(state, { horse, finishTime, position }) {
      const raceIndex = state.schedule.currentRound
      const race = state.schedule.races[raceIndex]
      if (race) {
        // Initialize results array if not exists
        if (!race.results) {
          race.results = []
        }

        // Add or update this horse in the results
        const existingIndex = race.results.findIndex((r) => r.horse.id === horse.id)
        const newResult = { position, horse, time: finishTime }

        if (existingIndex >= 0) {
          race.results[existingIndex] = newResult
        } else {
          race.results.push(newResult)
        }

        // Resort results by position
        race.results.sort((a, b) => a.position - b.position)

        // Update winner if this is first place
        if (position === 1) {
          race.winner = horse
        }
      }
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

    async simulateRace({ commit, dispatch, state }, race: Race) {
      const raceDistance = race.distance

      return new Promise<void>((resolve) => {
        const startTime = performance.now()
        const finishedHorses = new Set()
        const horseConfigs = new Map()
        const lastPositions = new Map() // Track last position to prevent going backwards
        let firstHorseFinished = false
        let finishPosition = 1

        // Configure each horse's racing parameters ONCE
        race.horses.forEach((horse) => {
          // Distance factor: Longer races need more speed to finish in reasonable time
          const distanceFactor = raceDistance / 1000 // Normalize to 1km baseline

          // Calculate target race duration (30-60 seconds depending on distance)
          const targetDuration = 30 + distanceFactor * 30 // 30s for 1km, 60s for 2km

          // Calculate required speed to finish in target duration
          const requiredSpeed = raceDistance / targetDuration

          // Apply horse's condition to required speed
          const adjustedSpeed = requiredSpeed * (0.8 + (horse.condition / 100) * 0.4)

          // Add 5% randomization (±2.5% variation)
          const randomVariation = 0.975 + Math.random() * 0.05 // 97.5% - 102.5%
          const finalSpeed = adjustedSpeed * randomVariation

          horseConfigs.set(horse.id, {
            speed: finalSpeed,
            startDelay: Math.random() * 300,
            // REMOVED: speedVariation since we now have proper randomization above
          })

          lastPositions.set(horse.id, 0) // Initialize position
        })

        const updateRace = (currentTime: number) => {
          const elapsed = currentTime - startTime
          let allFinished = true

          race.horses.forEach((horse) => {
            // Skip if horse already finished
            if (finishedHorses.has(horse.id)) {
              return
            }

            const config = horseConfigs.get(horse.id)
            const lastPosition = lastPositions.get(horse.id) || 0

            if (!config || elapsed < config.startDelay) {
              allFinished = false
              return
            }

            const adjustedElapsed = elapsed - config.startDelay

            // IMPROVED: Distance-based movement calculation
            const baseDistance = (adjustedElapsed / 1000) * config.speed // Direct speed in m/s

            // No additional variation needed since speed is already randomized
            const newPosition = Math.min(raceDistance, baseDistance)

            // CRITICAL: Never go backwards!
            const finalPosition = Math.max(lastPosition, newPosition)
            lastPositions.set(horse.id, finalPosition)

            // Update position
            dispatch(
              'horses/updateHorsePosition',
              { horseId: horse.id, position: finalPosition },
              { root: true },
            )

            // Check if horse just finished
            if (finalPosition >= raceDistance && !finishedHorses.has(horse.id)) {
              const finishTime = adjustedElapsed / 1000
              finishedHorses.add(horse.id)

              console.log(`🏁 ${horse.name} finished in position ${finishPosition}!`)

              // Add to results immediately
              commit('ADD_HORSE_TO_RESULTS', {
                horse,
                finishTime,
                position: finishPosition,
              })

              // FIXED: Trigger first horse finished
              if (!firstHorseFinished) {
                firstHorseFinished = true
                commit('FIRST_HORSE_FINISHED')
                console.log('🎉 RESULTS SHOWING NOW!')
              }

              finishPosition++
            }

            if (finalPosition < raceDistance) {
              allFinished = false
            }
          })

          if (allFinished) {
            console.log('🏆 All horses finished!')
            const currentRace = state.schedule.races[state.schedule.currentRound]
            const finalResults = currentRace?.results || []
            commit('FINISH_RACE', finalResults)
            resolve()
          } else {
            requestAnimationFrame(updateRace)
          }
        }

        requestAnimationFrame(updateRace)
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

    // New getter to check if we should show results
    isShowingResults: (state) => {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      const showing = currentRace?.showingResults || false
      console.log('🔍 isShowingResults:', showing)
      return showing
    },

    // Update existing getters
    canStartRace: (state) => {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      return currentRace && currentRace.status === 'pending' && !state.isRacing
    },

    // Current race results for live display
    currentRaceResults: (state) => {
      const currentRace = state.schedule.races[state.schedule.currentRound]
      const results = currentRace?.results || []
      console.log('🔍 currentRaceResults:', results.length)
      return results
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
