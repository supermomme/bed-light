<template>
  <div class="home">
    <v-container>
      <v-card
        class="mx-auto pb-1"
        max-width="344"
        outlined
        v-for="device in devices"
        :key="device._id"
        :disabled="device.status != 'CONNECTED'"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              {{device.deviceName}}
            </v-list-item-title>
            <v-card-text>
              <div v-for="component in device.frontendComponents" :key="component.key">
                <template v-if="component.type === 'SWITCH'">
                  {{ device.state[component.key] == true }}
                  <v-switch
                    :input-value="component.key.split('.').reduce((o, v) => o[v], device.state)"
                    :label="`Turned ${device.state[component.key] ? 'on' : 'off'}`"
                    @change="patchState(device._id, component.key, $event)"
                  ></v-switch>
                </template>

                <template v-else-if="component.type === 'SLIDER'">
                  <v-slider
                    :value="component.key.split('.').reduce((o, v) => o[v], device.state)"
                    :label="component.label"
                    @change="patchState(device._id, component.key, $event)"
                    :min="component.min"
                    :max="component.max"
                    :step="component.step"
                    :thumb-size="component.thumbSize"
                    :thumb-label="component.thumbLabel"
                  >
                  <template v-slot:thumb-label="value">
                    {{ Math.round( ((value.value - component.min) * 100) / (component.max - component.min) ) }}
                  </template>
                  </v-slider>
                </template>

              </div>
              <v-alert :type="errorType(device.status)" v-if="device.status != 'CONNECTED'" prominent>
                {{ device.statusMessage }}
              </v-alert>
            </v-card-text>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <v-spacer />
          <v-btn text small @click="openSettingsDialog(device._id)">Settings</v-btn>
        </v-card-actions>
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
    patchState (id, key, newVal) {
      this.$store.dispatch('device/patch', [ id, { [`state.${key}`]: newVal } ])
    },
    openSettingsDialog (deviceId) {
      this.$store.commit('setDialogMeta', { deviceId })
      this.$store.commit('openDialog', 'DeviceSettingDialog')
    },
    async fetch () {
      await this.$store.dispatch('device/find')
      console.log('fetch')
    }
  }
}

</script>
