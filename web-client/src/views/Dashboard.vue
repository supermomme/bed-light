<template>
  <div class="home">
    <v-container>
      <v-btn v-for="matrix in matrices" :key="matrix.id" outlined large color="primary" @click="openSelectModeDialog(matrix.id)">{{ matrix.name }}</v-btn>
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
    matrices () {
      return this.$store.getters['matrix/list']
    }
  },
  methods: {
    openSelectModeDialog (matrixId) {
      this.$store.commit('setDialogMeta', { matrixId })
      this.$store.commit('openDialog', 'AlphaDialDialog')
    },
    async fetch () {
      await this.$store.dispatch('matrix/find')
      await this.$store.dispatch('mode/find')
      console.log('fetch')
    }
  }
}
</script>
