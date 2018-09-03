<template>
  <div class="track-controls">

    <div class="track-controls-left">
        <div class="track-number-lead" v-if="trackNumber===leadTrackNumber" >Lead</div>
        <div class="track-number" v-else>Track {{ trackNumber }}</div>
        <div v-if="track.hidePitches" class="toggle-hide-pitches" @click="toggleHidePitches">Show</div>
        <div v-else class="toggle-hide-pitches" @click="toggleHidePitches">Hide</div>
        <div class="toggle-sound-panel-wrapper">
            <div  class="toggleSoundPanel"
                v-bind:class="{ toggleSoundPanelOpen: track.soundPanel }"
                @click="toggleSoundPanel"
            ></div>
        </div>
        <div class="track-mute"
             v-bind:class="{ greyOut: track.muted }"
            @click="toggleTrackMute">
        M</div>
    </div>

    <div class="track-controls-right">
        <range-adjust :track-number="trackNumber" :track-id="trackId" ></range-adjust>
        <tune-changer :track-number="trackNumber" :track-id="trackId" ></tune-changer>
        <span>%</span>
        <input class="pitch-percent" type="number" min="0" max="100"
               :id="'changePitchPercent-'+trackId"
               v-model="pitchPercent"
               @focus="focusFunction"
               @keyup.enter="enterFunction($event)"
        />
        <span class="button-esq" @click="rememberTune">Remember</span>
        <span class="button-esq"
              v-bind:class="{ greyOut: track.rememberedTune.length === 0 }"
              @click="tuneReturn"
        >Return</span>

        <!--   {{ track.id }} -->
    </div>

  </div>

</template>

<script>

//import VueKnobControl from 'vue-knob-control'
import RangeAdjust from './RangeAdjust.vue'
import TuneChanger from './TuneChanger.vue'

export default {
  name: "",

  props: ["trackNumber", "trackId"],

  components: {
//    'knob-control': VueKnobControl,
    'range-adjust': RangeAdjust,
    'tune-changer': TuneChanger,
  },

  data: () => ({
  }),

  computed: {
    scene(){
      return this.$store.state.scenes[this.$store.state.editingSceneNumber]
    },
    track(){
      return this.scene.tracks[this.trackNumber]
    },
    soundPanel(){
      return this.track.soundPanel
    },
    leadTrackNumber() {
      return this.$store.getters.leadTrackNumber
    },
    pitchPercent: {
      get(){
        return this.scene.tracks[this.trackNumber].pitchPercent
      },
      set(value){
        this.$store.commit('updateTrackPitchPercent', { trackNumber: this.trackNumber, value: value })
      },
    },
  },

  methods: {
    toggleHidePitches(){
      this.$store.commit('toggleHidePitches', this.trackNumber)
    },
    toggleSoundPanel(){
      this.$store.commit('toggleSoundPanel', this.trackNumber)
    },
    toggleTrackMute(){
      this.$store.dispatch('toggleTrackMute', this.trackNumber)
    },
    rememberTune(){
      this.$store.commit('rememberTune', this.trackNumber)
    },
    tuneReturn(){
      this.$store.commit('tuneReturn', this.trackNumber)
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'track-controls')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
    },
  },
}

</script>

<style>

.track-controls {
}

.track-controls-left {
  float: left;
  background: #999;
  width: 38px;
  padding: 0 3px;
  font-size: 12px;
}

.track-number {
  padding: 4px 0;
  background: #aaa;
}

.track-number-lead {
  padding: 4px 0;
  background: #0c8;
  font-weight: bold;
}

.toggle-hide-pitches {
  padding: 4px;
  background: #abe;
  cursor: pointer;
}

.toggle-sound-panel-wrapper {
  padding: 2px;
  float: left;
  cursor: pointer;
}

.toggleSoundPanel {
  width: 0; height: 0;
  border-style: solid;
  padding: 0; margin: 0;
  border-width: 7px 0 7px 14px;
  border-color: transparent transparent transparent #007bff;
}
.toggleSoundPanelOpen {
  border-width: 14px 7px 0px 7px;
  border-color: #007bff transparent transparent transparent;
}

.track-mute {
  float: left;
  background: #abe;
  cursor: pointer;
  padding: 2px;
  margin: 1px 0 1px 3px;

}


.track-controls-right {
  float: left;
  font-size: 14px;
  padding: 0 3px;
}
.track-controls-right input {
  font-size: 12px;
}
.track-controls-right select {
  font-size: 12px;
}

.pitch-percent {
  width:25px;
}

</style>
