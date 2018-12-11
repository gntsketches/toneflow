<template lang="html">

<div class="change-track-wave">
  <select @change="handleWaveChange" v-bind:value="waveNames[trackNumber]">
    <option v-for="waveName in waveNameOptions" >{{ waveName }}</option>
  </select>
<!--  #: {{ trackNumber}} id: {{ trackId }} -->
</div>

</template>

<script>

  export default {

  props: ['trackNumber', 'trackId'],

  data() {
    return {
      waveNameOptions: [
        'sine','triangle','sawtooth','square',
        'amsine','amtriangle','amsawtooth','amsquare',
        'fmsine','fmtriangle','fmsawtooth','fmsquare',
        'fatsine','fattriangle','fatsawtooth','fatsquare',
        /*'pulse', (read link in the API...)*/ 'pwm',
      ],
    }
  },

  computed: {
    waveNames() {
      let waveNames = []
      let scene = this.$store.state.scenes[this.$store.state.editingSceneNumber]
      scene.tracks.forEach( (track, index) => {
        waveNames.push(track.waveType)
      })
      return waveNames
    }
  },

  methods: {
    handleWaveChange: function (e) {
      this.waveName = e.target.value
      this.$store.dispatch('changeTrackWave', { trackNumber: this.trackNumber, wave: e.target.value })
    },

/*    handleSendRangeHigh: function (e) {
      this.$store.commit('adjustRange', { range: 'high', pitch: e.target.value })
    }, */

  },


}

</script>

<style>

.change-track-wave{
  display: block;
  padding: 2px 0;
}

</style>
