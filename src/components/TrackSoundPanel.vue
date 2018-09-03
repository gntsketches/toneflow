<template>

    <div class="sound-panel">

        <change-track-wave :track-number="trackNumber" :track-id="trackId" ></change-track-wave>

        <div class="track-controls">
          <div>Gain</div>
          <knob-control class="knob-control" v-model="gain"  :min="0" :max="2" :stepSize="0.01" :size="50" ></knob-control>
          <input :id="'trackGain-'+trackId" type="number" v-model="gain" :min="0" :max="2" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Delay Time</div>
          <knob-control class="knob-control" v-model="delayTime"  :min="0" :max="1" :stepSize="0.01" :size="50" ></knob-control>
          <input type="number" v-model="delayTime" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Delay Feed</div>
          <knob-control class="knob-control" v-model="delayFeedback"  :min="0" :max="1" :stepSize="0.01" :size="50" ></knob-control>
          <input type="number" v-model="delayFeedback" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Distortion</div>
          <knob-control class="knob-control" v-model="distortion"  :min="0" :max="1" :stepSize="0.01" :size="50" ></knob-control>
          <input type="number" v-model="distortion" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

<!--
        <div class="track-controls">
          <div>Duration</div>
          <knob-control class="knob-control" v-model="duration"  :min="0" :max="4" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="duration" :min="0" :max="4" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
-->

        <div class="track-controls">
          <div>Duration</div>
          <select v-model="durationRelative">
            <option v-for="duration in relativeDurations">{{ duration }}</option>
          </select>
        </div>

        <div class="track-controls">
          <div>Attack</div>
          <knob-control class="knob-control" v-model="attack"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="attack" :min="0" :max="10" :step="0.005" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Decay</div>
          <knob-control class="knob-control" v-model="decay"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="decay" :min="0" :max="10" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Sustain</div>
          <knob-control class="knob-control" v-model="sustain"  :min="0" :max="1" :stepSize="0.05" :size="50" ></knob-control>
          <input type="number" v-model="sustain" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Release</div>
          <knob-control class="knob-control" v-model="release"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="release" :min="0" :max="10" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Wet</div>
          <knob-control class="knob-control" v-model="trackFilterWet"  :min="0" :max="1" :stepSize="0.1" :size="50" ></knob-control>
          <input :id="'trackFilterWet-'+trackId" type="number" v-model="trackFilterWet" :min="0" :max="1" :step="0.1"  @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)"/>
        </div>

        <div class="track-controls">
          <div>Filter Type</div>
          <select v-model="trackFilterType">
            <option v-for="filter in filterTypes">{{ filter }}</option>
          </select>
        </div>
        <div class="track-controls">
          <div>Rolloff</div>
          <select v-model="trackFilterRolloff">
            <option v-for="roll in rolloffs">{{ roll }}</option>
          </select>
        </div>
        <div class="track-controls">
          <div>Base</div>
          <knob-control class="knob-control" v-model="trackFilterBaseFrequency"  :min="50" :max="10000" :stepSize="50" :size="50" ></knob-control>
          <input type="number" v-model="trackFilterBaseFrequency" :min="50" :max="10000" :step="50" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Q</div>
          <knob-control class="knob-control" v-model="trackFilterQ"  :min="0" :max="100" :stepSize="1" :size="50" ></knob-control>
          <input type="number" v-model="trackFilterQ" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>LFO Wave</div>
          <select v-model="trackLFOWaveType">
            <option v-for="wave in waveTypes">{{ wave }}</option>
          </select>
        </div>
        <div class="track-controls">
          <div>LFO Freq</div>
          <knob-control class="knob-control" v-model="trackLFOFrequency"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input :id="'trackLFOFrequency-'+trackId" type="number" v-model="trackLFOFrequency" :min="0" :max="10" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>LFO Depth</div>
          <knob-control class="knob-control" v-model="trackLFODepth"  :min="0" :max="1" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="trackLFODepth" :min="0" :max="1" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="track-controls">
          <div>Octaves</div>
          <knob-control class="knob-control" v-model="trackLFOOctaves"  :min="0.1" :max="6" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="trackLFOOctaves" :min="0.1" :max="6" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>



    </div>

</template>


<script>

import ChangeTrackWave from './ChangeTrackWave.vue'
//import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl'


export default {
  name: "",

  props: ['trackNumber', 'trackId'],

  components: {
    'change-track-wave': ChangeTrackWave,
    //'knob-control': VueKnobControl,
    'knob-control': KnobControl,

  },

  data: () => ({
    relativeDurations: ['32n', '16n', '8n', '4n', '2n', '1m', '2m', '4m'],
    filterTypes: ['lowpass', 'highpass', 'bandpass', 'notch', 'allpass'],
    waveTypes: ['sine', 'triangle', 'sawtooth', 'square'],
    rolloffs: ['-12','-24','-48','-96'],
  }),

  computed: {
    scene(){
      return this.$store.state.scenes[this.$store.state.editingSceneNumber]
    },
    track(){
      return this.scene.tracks[this.trackNumber]
    },
    gain: {
      get(){ return Math.round(this.track.gain*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'gain', trackNumber: this.trackNumber, value:value }) },
    },
    delayTime: {
      get(){ return Math.round(this.track.delayTime*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'delayTime', trackNumber: this.trackNumber, value:value }) },
    },
    delayFeedback: {
      get(){ return Math.round(this.track.delayFeedback*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'delayFeedback', trackNumber: this.trackNumber, value:value }) },
    },
    distortion: {
      get(){ return Math.round(this.track.distortion*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'distortion', trackNumber: this.trackNumber, value:value }) },
    },
    duration: {
      get(){ return Math.round(this.track.noteDuration*10)/10 },
      set(value){ this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: value } ) },
    },
    durationRelative: {
      get(){ return this.track.noteDuration },
      set(value){ this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: value } ) },
    },
    attack: {
      get(){ return Math.round(this.track.attack*1000)/1000 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'attack', trackNumber: this.trackNumber, value:value }) },
    },
    decay: {
      get(){ return Math.round(this.track.decay*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'decay', trackNumber: this.trackNumber, value:value }) },
    },
    sustain: {
      get(){ return Math.round(this.track.sustain*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'sustain', trackNumber: this.trackNumber, value:value }) },
    },
    release: {
      get(){ return Math.round(this.track.release*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'release', trackNumber: this.trackNumber, value:value }) },
    },


    trackFilterWet: {
      get(){ return  Math.round(this.track.filterWet*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'filterWet', trackNumber: this.trackNumber, 'value':value }) },
    },

    trackFilterType: {
      get(){ return  this.track.filterType },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'filterType', trackNumber: this.trackNumber, 'value':value }) },
    },
    trackFilterRolloff: {
      get() { return this.track.filterRolloff },
      set(value) { this.$store.dispatch('updateTrackSoundParams', { 'param': 'filterRolloff', trackNumber: this.trackNumber, 'value': value }) }
    },
    trackFilterBaseFrequency: {
      get(){ return  Math.round(this.track.filterBaseFrequency*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'filterBaseFrequency', trackNumber: this.trackNumber, 'value':value }) },
    },
    trackFilterQ: {
      get(){ return  Math.round(this.track.filterQ*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'filterQ', trackNumber: this.trackNumber, 'value':value }) },
    },

    trackLFOWaveType: {
      get(){ return  this.track.LFOWaveType },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'LFOWaveType', trackNumber: this.trackNumber, 'value':value }) },
    },
    trackLFOFrequency: {
      get(){ return Math.round(this.track.LFOFrequency*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'LFOFrequency', trackNumber: this.trackNumber, 'value':value }) },
    },
    trackLFODepth: {
      get(){ return  Math.round(this.track.LFODepth*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'LFODepth', trackNumber: this.trackNumber, 'value':value }) },
    },
    trackLFOOctaves: {
      get(){ return  Math.round(this.track.LFOOctaves*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { 'param':'LFOOctaves', trackNumber: this.trackNumber, 'value':value }) },
    },

  },

  methods: {
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


/*.track-controls-filters {
  float: left;
}*/

.track-controls {
  display: inline-block;
  background: #866;
  text-align: center;
  padding: 3px;
}
.track-controls input {
  width: 40px;
  padding: 0;
  font-size:12px;
}

</style>
