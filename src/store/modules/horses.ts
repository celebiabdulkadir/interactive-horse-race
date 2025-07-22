import type { Module } from 'vuex'
import { HORSE_COLORS, type Horse, type RootState } from '../types'

export interface HorsesState {
  horses: Horse[]
  totalHorses: number
}

const HORSE_NAMES = [
  'Thunder Bolt',
  'Lightning Flash',
  'Storm Rider',
  'Wind Walker',
  'Fire Spirit',
  'Golden Arrow',
  'Silver Streak',
  'Midnight Star',
  'Racing Rainbow',
  'Rocket Runner',
  'Racing Rebel',
  'Shadow Hunter',
  'Blazing Comet',
  'Diamond Dash',
  'Crimson Fury',
  'Mystic Wings',
  'Star Chaser',
  'Victory Charge',
  'Noble Knight',
  'Dream Catcher',
]

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

    UPDATE_HORSE_SPEED(state, { horseId, speed }: { horseId: number; speed: number }) {
      const horse = state.horses.find((h) => h.id === horseId)
      if (horse) {
        horse.speed = speed
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
          name: HORSE_NAMES[i - 1] || `Horse ${i}`,
          color: HORSE_COLORS[i - 1] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          condition: Math.floor(Math.random() * 100) + 1, // 1-100
          position: 0,
          speed: 0,
        }

        // Calculate speed with narrower range for competitive racing
        // Base speed (80%) + condition bonus (20%) + small random factor
        const baseSpeed = 0.8 // All horses get 80% base speed
        const conditionBonus = (horse.condition / 100) * 0.2 // Up to 20% bonus from condition
        const randomFactor = 0.9 + Math.random() * 0.2 // 90%-110% variation
        horse.speed = (baseSpeed + conditionBonus) * randomFactor

        horses.push(horse)
      }

      commit('SET_HORSES', horses)
    },

    updateHorsePosition({ commit }, payload: { horseId: number; position: number }) {
      commit('UPDATE_HORSE_POSITION', payload)
    },

    updateHorseSpeed({ commit }, payload: { horseId: number; speed: number }) {
      commit('UPDATE_HORSE_SPEED', payload)
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
