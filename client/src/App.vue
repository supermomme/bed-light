<template>
  <v-app id="inspire">
    <component :is="layout">
      <router-view />
    </component>
    <template v-if="dialogName != null">
      <component :is="dialog" />
    </template>
    <v-overlay :value="$store.state.isLoading">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

const requireLayoutComponents = require.context(
  '@/layouts', false, /.\.vue/
)
const LayoutComponents = requireLayoutComponents.keys()
  .map(filename => requireLayoutComponents(filename).default)

const requireDialogComponents = require.context(
  '@/dialogs', false, /.\.vue/
)
const DialogComponents = requireDialogComponents.keys()
  .map(filename => requireDialogComponents(filename).default)

export default {
  name: 'App',
  computed: {
    layout () {
      return LayoutComponents.find(component => component.name === this.$route.meta.layout) || 'div'
    },
    ...mapState({
      'dialogName': 'dialog'
    }),
    dialog () {
      return DialogComponents.find(component => component.name === this.dialogName) || 'div'
    }
  }
}
</script>

<style>
</style>
