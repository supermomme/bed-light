<template>
  <div class="home">
    <v-container>
      <v-btn v-for="gadget in gadgets" :key="gadget.id" outlined large color="primary" @click="openSelectModeDialog(gadget.id)">{{ gadget.name }}</v-btn>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  watch: {
    '$route': {
      handler: 'fetch',
      immediate: true
    }
  },
  computed: {
    gadgets () {
      return this.$store.getters['gadget/list']
    }
  },
  methods: {
    openSelectModeDialog (gadgetId) {
      this.$store.commit('setDialogMeta', { gadgetId })
      this.$store.commit('openDialog', 'AlphaDialDialog')
    },
    async fetch () {
      await this.$store.dispatch('gadget/find')
      await this.$store.dispatch('mode/find')
      console.log('fetch')
    }
  }
}
</script>
