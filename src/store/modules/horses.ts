import type { Module } from 'vuex'
import { HORSE_COLORS, type Horse, type RootState } from '../types'

export interface HorsesState {
  horses: Horse[]
  totalHorses: number
}

const horsesModule: Module<HorsesState, RootState> = {
  namespaced: true,

  state: (): HorsesState => ({
    horses: [],
    totalHorses: 20,
  }),

  mutations: {
    SET_HORSES(state, horses: Horse[]) {
      state.horses = horses
    },

    UPDATE_HORSE_POSITION(state, { horseId, position }: { horseId: number; position: number }) {
      const horse = state.horses.find((h) => h.id === horseId)
      if (horse) {
        horse.position = position
      }
    },

    RESET_HORSE_POSITIONS(state) {
      state.horses.forEach((horse) => {
        horse.position = 0
      })
    },
  },

  actions: {
    generateHorses({ commit, state }) {
      const horses: Horse[] = []

      for (let i = 1; i <= state.totalHorses; i++) {
        const horse: Horse = {
          id: i,
          name: `Horse ${i}`,
          color: HORSE_COLORS[i - 1] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          condition: Math.floor(Math.random() * 100) + 1, // 1-100
          position: 0,
          speed: 0,
        }

        // Calculate speed based on condition (higher condition = higher speed potential)
        horse.speed = (horse.condition / 100) * (Math.random() * 0.5 + 0.75) // 0.75-1.25 multiplier

        horses.push(horse)
      }

      commit('SET_HORSES', horses)
    },

    updateHorsePosition({ commit }, payload: { horseId: number; position: number }) {
      commit('UPDATE_HORSE_POSITION', payload)
    },

    resetPositions({ commit }) {
      commit('RESET_HORSE_POSITIONS')
    },
  },

  getters: {
    getAllHorses: (state) => state.horses,

    getRandomHorses:
      (state) =>
      (count: number = 10) => {
        const shuffled = [...state.horses].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, Math.min(count, state.horses.length))
      },

    getHorseById: (state) => (id: number) => {
      return state.horses.find((horse) => horse.id === id)
    },

    totalHorsesCount: (state) => state.totalHorses,
  },
}

export default horsesModule
