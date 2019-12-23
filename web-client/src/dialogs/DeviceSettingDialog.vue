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
        Setting for {{ device.deviceName }}
      </v-card-title>

      <v-card-text>
        <div v-for="component in device.settingComponents" :key="component.key">
          <p v-if="component.type === 'SPACER'" class="mt-3" />
          <p v-else-if="component.type === 'HEAD'" class="headline">
            {{ component.label }}
          </p>
          <template v-else-if="component.type === 'NUMBER'">
            <v-text-field
              :value="component.key.split('.').reduce((o, v) => o[v], device.setting)"
              :label="component.label"
              @change="change(component.key, $event)"
              type="number"
            ></v-text-field>
          </template>
          <template v-else-if="component.type === 'SELECT'">
            <v-select
              :value="component.key.split('.').reduce((o, v) => o[v], device.setting)"
              :items="component.selectable"
              :label="component.label"
              @change="change(component.key, $event)"
            ></v-select>
          </template>
          <template v-else-if="component.type === 'SLIDER'">
            <v-slider
              class="mt-3"
              :value="component.key.split('.').reduce((o, v) => o[v], device.setting)"
              :label="component.label"
              @change="change(component.key, $event)"
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

          <template v-else>
            {{ component.type }} not found!
          </template>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'DeviceSettingDialog',
  data: () => {
    return {
      toSend: {}
    }
  },
  computed: {
    device () {
      return this.$store.getters['device/get'](this.$store.state.dialogMeta.deviceId)
    }
  },
  methods: {
    change (key, val) {
      this.toSend[key] = val
    },
    ...mapMutations([
      'closeDialog'
    ]),
    save () {
      let data = Object.keys(this.toSend).reduce((prev, cur) => {
        prev[`setting.${cur}`] = this.toSend[cur]
        return prev
      }, {})
      this.$store.dispatch('device/patch', [this.$store.state.dialogMeta.deviceId, data])
      this.closeDialog()
    }
  }
}
</script>
