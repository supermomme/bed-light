<template>
  <span>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link :to="{ name: 'Dashboard' }">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="$store.commit('openDialog', 'TestDialog')">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>TestDialog</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Home Control</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <slot />
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>

  </span>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: true
    }
  },
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>
