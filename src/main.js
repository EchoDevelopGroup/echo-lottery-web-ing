import '../vendor/element/index.css'
import './main.css'
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import * as api from '@/api'

Vue.use(ElementUI)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window._ = () => {
  window.api = api
  window.app = app
}
