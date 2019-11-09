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
        Modus Auswählen
        <v-spacer></v-spacer>
        <v-btn icon @click="fetchM">
          <v-icon>mdi-cloud-download-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select
              :items="modeNamesAndIds"
              label="Mode"
              v-model="modeId"
              @change="updateConfig"
              outlined
            />
          </v-col>
          <v-col cols="12" v-for="conf in configInfo" :key="conf.id">
            <v-subheader class="pl-0">{{ conf.name }}</v-subheader>
            <v-row>
              <v-col
                cols="12"
                v-if="conf.type === 'slider' && conf.canBeMinMax === false"
              >
                <v-slider
                  v-model="config[conf.id].value"
                  :thumb-size="25"
                  thumb-label="always"
                  :min="conf.min"
                  :max="conf.max"
                ></v-slider>
              </v-col>

              <v-col
                cols="12"
                v-else-if="conf.type === 'slider' && conf.canBeMinMax === true"
              >
                <v-switch
                  v-model="config[conf.id].useRange"
                  label="Use Range (random)"
                />
                <v-range-slider
                  v-if="config[conf.id].useRange"
                  v-model="config[conf.id].range"
                  :thumb-size="25"
                  thumb-label="always"
                  :min="conf.min"
                  :max="conf.max"
                />
                <v-slider
                  v-else
                  v-model="config[conf.id].value"
                  :thumb-size="25"
                  thumb-label="always"
                  :min="conf.min"
                  :max="conf.max"
                />
              </v-col>

              <v-col
                cols="12"
                v-else-if="conf.type === 'number' && conf.canBeMinMax === false"
              >
              </v-col>

            </v-row>
          </v-col>
          {{ configInfo }}
          {{ config }}
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
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
  name: 'SelectModeDialog',
  data () {
    return {
      modeId: 'FullRainbow',
      configInfo: [],
      config: {}
    }
  },
  computed: {
    modeNamesAndIds () {
      return this.modes.reduce((prev, cur, index) => {
        prev.push({
          text: cur.name,
          value: cur.id
        })
        return prev
      }, [])
    },
    modes () {
      return this.$store.getters['mode/list']
    }
  },
  methods: {
    async fetchM () {
      let matrix = await this.$store.dispatch('matrix/get', this.$store.state.dialogMeta.matrixId)

      console.log(matrix)
      let res = {}
      for (const key in matrix.modeConfig) {
        if (matrix.modeConfig.hasOwnProperty(key)) {

          res[key] = {}
          if (Array.isArray(matrix.modeConfig[key])) {
            res[key].useRange = true
            res[key].range = matrix.modeConfig[key]
          } else {
            res[key].useRange = false
            res[key].value = matrix.modeConfig[key]
          }
        }
      }
      console.log(res)
      this.config = res
      this.modeId = matrix.modeId
      let mode = this.modes.find(o => o.id === this.modeId)
      if (mode === undefined) {
        this.configInfo = []
        this.config = {}
        return
      }
      this.configInfo = mode.config
    },
    updateConfig () {
      let mode = this.modes.find(o => o.id === this.modeId)
      if (mode === undefined) {
        this.configInfo = []
        this.config = {}
        return
      }
      this.configInfo = mode.config
      let res = {}
      for (let i = 0; i < this.configInfo.length; i++) {
        res[this.configInfo[i].id] = {}
        if (this.configInfo[i].canBeMinMax) {
          if (Array.isArray(this.configInfo[i].default)) {
            res[this.configInfo[i].id].useRange = true
            res[this.configInfo[i].id].range = this.configInfo[i].default
          } else {
            res[this.configInfo[i].id].useRange = false
            res[this.configInfo[i].id].value = this.configInfo[i].default
          }
        } else {
          res[this.configInfo[i].id].value = this.configInfo[i].default
        }
      }
      console.log(res)
      this.config = res
    },
    ...mapMutations([
      'closeDialog'
    ]),
    send () {
      let config = {}
      for (const key in this.config) {
        if (this.config.hasOwnProperty(key)) {
          config[key] = this.config[key].useRange ? this.config[key].range : this.config[key].value
        }
      }
      this.$store.dispatch('matrix/patch', [this.$store.state.dialogMeta.matrixId, {
        modeId: this.modeId,
        config
      }])
      this.closeDialog()
    }
  }
}
</script>
