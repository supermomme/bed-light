<template>
  <div class="home">
    <v-container>
      <v-card
        class="mx-auto"
        max-width="344"
        outlined
        v-for="device in devices"
        :key="device._id"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">{{device.deviceName}}</v-list-item-title>
            <v-card-text>
              <div v-for="component in device.frontendComponents" :key="component.key">
                <template v-if="component.type === 'SWITCH'">
                  {{ device.state[component.key] == true }}
                  <v-switch
                    :disabled="device.status != 'CONNECTED'"
                    :input-value="component.key.split('.').reduce((o, v) => o[v], device.state)"
                    :label="`Turned ${device.state[component.key] ? 'on' : 'off'}`"
                    @change="patchDeviceState(device._id, device.state, component.key, $event)"
                  ></v-switch>
                </template>

                <template v-else-if="component.type === 'SLIDER'">
                  <!--toggleDeviceState(device._id, component.key)-->
                  <v-slider
                    :disabled="device.status != 'CONNECTED'"
                    :value="component.key.split('.').reduce((o, v) => o[v], device.state)"
                    :label="component.label"
                    @change="patchDeviceState(device._id, device.state, component.key, $event)"
                    :min="component.min"
                    :max="component.max"
                    step="0.01"
                  ></v-slider>
                </template>

              </div>
              <v-alert :type="errorType(device.status)" v-if="device.status != 'CONNECTED'" prominent>
                {{ device.statusMessage }}
              </v-alert>
              <!--<pre>{{ device}}</pre>-->
            </v-card-text>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-container>
  </div>
</template>

<script>
let _ = require('lodash')

export default {
  name: 'Dashboard',
  watch: {
    '$route': {
      handler: 'fetch',
      immediate: true
    }
  },
  computed: {
    devices () {
      return this.$store.getters['device/list']
    }
  },
  methods: {
    errorType (status) {
      if (status === 'INITIALIZING') return 'warning'
      return 'error'
    },
    patchDeviceState (id, state, key, newVal) {
      _.set(state, key, newVal)
      this.$store.dispatch('device/patch', [ id, { state } ])
    },
    openSelectModeDialog (gadgetId) {
      this.$store.commit('setDialogMeta', { gadgetId })
      this.$store.commit('openDialog', 'AlphaDialDialog')
    },
    async fetch () {
      await this.$store.dispatch('device/find')
      console.log('fetch')
    }
  }
}

</script>
