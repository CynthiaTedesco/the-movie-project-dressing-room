import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Global store
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// Modules
import movies from './movies/index'

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null
    },
    mutations,
    getters,
    actions,
    modules: {
      namespaced: true,
      movies
    }
  })
}

export default createStore
