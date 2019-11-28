<template>
  <v-dialog
    :value="true"
    width="500"
    @click:outside="closeDialog()"
  >
    <v-card>
      <v-card-title
        class="headline"
        primary-title
      >
        Alpha Dial
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              :disabled="matrix.isTransitioning"
              v-model="transition"
              label="Transition time in ms"
            >
              <template v-slot:prepend-inner>
                <v-icon @click="transition -= 100">
                  mdi-minus
                </v-icon>
              </template>
              <template v-slot:append>
                <v-icon @click="transition += 100">
                  mdi-plus
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" v-for="(mode, name) in matrix.modes" :key="mode.id">
            <v-slider
              :disabled="matrix.isTransitioning"
              v-model="mode.alpha"
              :label="name"
              min="0"
              max="1"
              step="0.01"
              :thumb-size="27"
              :thumb-label="true"
            >
              <template v-slot:thumb-label="value">
                {{ Math.round(value.value*100)}}
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-if="matrix.isTransitioning"
          color="error"
          depressed
          @click="stopAllTransitions()"
        >
          Stop all transitions
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="matrix.isTransitioning"
          color="primary"
          outlined
          @click="send()"
        >
          Senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'AlphaDialDialog',
  data () {
    return {
      transition: 500
    }
  },
  computed: {
    matrix () {
      return this.$store.getters['matrix/get'](this.$store.state.dialogMeta.matrixId)
    }
  },
  methods: {
    ...mapMutations([
      'closeDialog'
    ]),
    send () {
      let data = {
        'cmd': 'setModeAlpha',
        'modes': { },
        'transitionTime': this.transition
      }

      for (const modeId in this.matrix.modes) {
        if (this.matrix.modes.hasOwnProperty(modeId)) {
          data.modes[modeId] = this.matrix.modes[modeId].alpha
        }
      }
      this.$store.dispatch('matrix/patch', [this.$store.state.dialogMeta.matrixId, data])
      this.closeDialog()
    },
    stopAllTransitions () {
      this.$store.dispatch('matrix/patch', [this.$store.state.dialogMeta.matrixId, {
        cmd: 'stopTransitions'
      }])
    }
  }
}
</script>
