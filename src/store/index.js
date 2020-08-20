import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    password: ''
  },
  getters: {
    username: state => state.username,
    password: state => state.password
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setPassword(state, password) {
      state.password = password
    }
  },
  actions: {},
  modules: {}
})
