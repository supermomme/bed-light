<template>
  <div>
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        :items="modeNamesAndIds"
        label="Mode"
        :value="modeId"
        @input="setMode"
        outlined
      />
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'modeId',
      'modeNamesAndIds'
    ])
  },
  methods: {
    ...mapActions([
      'setMode'
    ])
  }
}
</script>
