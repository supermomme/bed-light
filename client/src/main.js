import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import socketio from 'socket.io-client'

const io = socketio({
  path: '/api/socket.io/'
})

Vue.config.productionTip = false
Vue.prototype.$io = io

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
