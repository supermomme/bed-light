import Vue from 'vue'
import Vuex from 'vuex'
import { FeathersVuex } from './feathers-client'

Vue.use(Vuex)
Vue.use(FeathersVuex)

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

export default new Vuex.Store({
  plugins: [
    ...servicePlugins
  ],
  state: {
    isLoading: false,
    sidebarOpened: true,
    dialog: null,
    dialogMeta: {}
  },
  mutations: {
    closeDialog (state) {
      state.dialog = null
    },
    openDialog (state, n) {
      state.dialog = n
    },
    setDialogMeta (state, n) {
      state.dialogMeta = n
    }
  },
  actions: {
  },
  modules: {
  }
})
