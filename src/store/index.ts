import { createStore } from 'vuex'
import horsesModule from './modules/horses'
import racesModule from './modules/races'

export default createStore({
  modules: {
    horses: horsesModule,
    races: racesModule,
  },

  strict: import.meta.env.NODE_ENV !== 'production',
})
