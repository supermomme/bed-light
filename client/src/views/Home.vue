<template>
  <v-container>
    <!--v-row v-for="(matrix, matrixId) in matricies" :key="matrix.id">
      <v-col cols="12">
        <v-select
          :items="modeNamesAndIds"
          :label="'Mode of ' + matrix.name"
          :value="matrix.modeInfo.id"
          @input="checkoutMode(matrixId, $event)"
          outlined
        />
      </v-col>
      <v-col cols="12">
        modes
      </v-col>
    </v-row-->
    <div v-if="matrix">
      <v-row>
        <v-col cols="12"><h3>{{ matrix.name }}</h3></v-col>
        <v-col cols="12">
          <v-select
            :items="modeNamesAndIds"
            label="Mode"
            v-model="matrix.modeInfo.id"
            @input="updateMode"
            outlined
          />
        </v-col>
        <v-col cols="12" v-for="conf in matrix.modeInfo.config" :key="conf.id">
          <v-subheader class="pl-0">{{ conf.name }}</v-subheader>
          <v-row>
            <v-col
              cols="12"
              v-if="conf.type === 'slider' && conf.canBeMinMax === false"
            >
              <v-slider
                v-model="newConfig[conf.id].value"
                :thumb-size="25"
                thumb-label="always"
                :min="conf.min"
                :max="conf.max"
                @change="updateMode"
              ></v-slider>
            </v-col>

            <v-col
              cols="12"
              v-else-if="conf.type === 'slider' && conf.canBeMinMax === true"
            >
              <v-switch
                v-model="newConfig[conf.id].useRange"
                label="Use Range (random)"
                @change="updateMode"
              />
              <v-range-slider
                v-if="newConfig[conf.id].useRange"
                v-model="newConfig[conf.id].range"
                :thumb-size="25"
                thumb-label="always"
                :min="conf.min"
                :max="conf.max"
                @change="updateMode"
              />
              <v-slider
                v-else
                v-model="newConfig[conf.id].value"
                :thumb-size="25"
                thumb-label="always"
                :min="conf.min"
                :max="conf.max"
                @change="updateMode"
              />
            </v-col>

            <v-col
              cols="12"
              v-else-if="conf.type === 'number' && conf.canBeMinMax === false"
            >
            </v-col>

          </v-row>
        </v-col>
      </v-row>
      <pre>{{ matrix }}</pre>
    </div>

  </v-container>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      matrix: null,
      modes: [],
      newConfig: {}
    }
  },
  created () {
    this.$io.on('matricies', (...args) => this.newMatricies(...args))
    this.$io.on('modes', (...args) => this.newModes(...args))
    this.$io.emit('reqMatricies')
    this.$io.emit('reqModes')
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
    }
  },
  methods: {
    newMatricies (n) {
      console.log(n)
      // if (JSON.stringify(this.matrix) === JSON.stringify(n[0])) return
      for (const key in n[0].modeConfig) {
        if (n[0].modeConfig.hasOwnProperty(key)) {
          if (this.newConfig[key] === undefined) this.newConfig[key] = {}
          if (Array.isArray(n[0].modeConfig[key])) {
            this.newConfig[key].range = n[0].modeConfig[key]
          } else {
            this.newConfig[key].value = n[0].modeConfig[key]
          }
        }
      }
      this.matrix = n[0]
      console.log()
    },
    newModes (n) {
      this.modes = n
    },
    updateMode () {
      let config = {}
      for (const key in this.newConfig) {
        if (this.newConfig.hasOwnProperty(key)) {
          if (this.newConfig[key].useRange) {
            config[key] = this.newConfig[key].range
          } else {
            config[key] = this.newConfig[key].value
          }
        }
      }

      this.$io.emit('setMode', {
        matrixId: 0,
        modeId: this.matrix.modeInfo.id,
        config
      })
    }
  }
}
</script>
