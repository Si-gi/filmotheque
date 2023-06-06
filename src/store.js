import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filmotheque: [],
  },
  getters: {
    lafilmotheque: state => {
      return state.filmotheque
    }
  },
  mutations: {
    SET_FILM: (state, leFilm) => {
      state.listeProduits.push(leFilm)
    },
    DELETE_FILM: (state,indexProduit) => {
      state.filmotheque.splice(state.filmotheque.indexOf(indexProduit), 1)
    }
  },
  actions: {

  }
})
