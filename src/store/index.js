import Vue from 'vue'
import Vuex from 'vuex'
import { makeLocalStorage, now } from '@/util'

Vue.use(Vuex)

export const localLogin = makeLocalStorage('echo_lottery_login')

export default new Vuex.Store({
  state: {
    username: '',
    password: '',
    autoLogin: 0 // 自动登录有效期至 单位毫秒
  },
  getters: {
    username: state => state.username,
    password: state => state.password,
    autoLogin: state => state.autoLogin
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setPassword(state, password) {
      state.password = password
    },
    setAutoLogin(state, autoLogin) {
      state.autoLogin = autoLogin
    }
  },
  actions: {
    loadLogin({ commit }) {
      const login = localLogin.get()
      if (login !== null) {
        if (now() < login.autoLogin) {
          commit('setUsername', login.username)
          commit('setPassword', login.password)
          commit('setAutoLogin', login.autoLogin)
        } else {
          localLogin.set({
            username: '',
            password: '',
            autoLogin: 0
          })
        }
      }
    },
    saveLogin({ state }) {
      if (state.autoLogin > 0) {
        const login = {
          username: state.username,
          password: state.password,
          autoLogin: state.autoLogin
        }
        localLogin.set(login)
      } else {
        localLogin.set({
          username: '',
          password: '',
          autoLogin: 0
        })
      }
    }
  },
  modules: {}
})
