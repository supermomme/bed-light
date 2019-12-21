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
                  <!--toggleDeviceState(device._id, component.key)-->
                  <v-switch
                    :disabled="device.status != 'CONNECTED'"
                    v-model="device.state[component.key]"
                    :label="`Turned ${device.state[component.key] ? 'on' : 'off'}`"
                    @change="patchDeviceState(device._id, device.state)"
                  ></v-switch>
                </template>
              </div>
              <v-alert :type="errorType(device.status)" v-if="device.status != 'CONNECTED'" prominent>
                {{ device.statusMessage }}
              </v-alert>
            </v-card-text>
          </v-list-item-content>
        </v-list-item>
      </v-card>
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
    devices () {
      return this.$store.getters['device/list']
    }
  },
  methods: {
    errorType (status) {
      if (status === 'INITIALIZING') return 'warning'
      return 'error'
    },
    patchDeviceState (id, state) {
      console.log('patch', id, state)
      this.$store.dispatch('device/patch', [
        id,
        { state }
      ])
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
