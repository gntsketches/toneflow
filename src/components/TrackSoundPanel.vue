<template>

    <div class="sound-panel">

        <div class="track-controls">
            <select class="stacking-select" v-model="instrumentType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
              <option v-for="instrument in instrumentTypes">{{ instrument }}</option>
            </select>

            <select class="stacking-select" v-if="this.track.instrumentType === 'monoSynth' || this.track.instrumentType ==='polySynth'"
                    v-model="waveType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)" >
              <option v-for="waveName in waveNameOptions" >{{ waveName }}</option>
            </select>


            <select class="stacking-select" v-else
                    v-model="sampleType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
              <option v-for="sample in sampleOptions">{{ sample }}</option>
            </select>

            <select class="stacking-select" v-model="modulationType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)"
                    v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                          (this.track.waveType === 'amsine'     || this.track.waveType === 'amtriangle' ||
                          this.track.waveType === 'amsawtooth' || this.track.waveType === 'amsquare'   ||
                          this.track.waveType === 'fmsine'     || this.track.waveType === 'fmtriangle' ||
                          this.track.waveType === 'fmsawtooth' || this.track.waveType === 'fmsquare' ) "
            >
              <option v-for="modulationType in modulationTypes">{{ modulationType }}</option>
            </select>

        </div>

        <div class="track-controls">
          <div>Gain</div>
          <knob-control class="knob-control" v-model="gain"  :min="0" :max="2" :stepSize="0.01" :size="40" ></knob-control>
          <input :id="'trackGain-'+trackId" type="number" v-model.lazy="gain" :min="0" :max="2" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Duration</div>
          <select v-model="durationRelative" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
            <option v-for="duration in relativeDurations">{{ duration }}</option>
          </select>
        </div>

        <!--
                <div class="track-controls">
                  <div>Duration</div>
                  <knob-control class="knob-control" v-model="duration"  :min="0" :max="4" :stepSize="0.1" :size="40" ></knob-control>
                  <input type="number" v-model.lazy="duration" :min="0" :max="4" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
                </div>
        -->

        <div class="track-controls">
          <div>Attack</div>
          <knob-control class="knob-control" v-model="attack"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="attack" :min="0" :max="10" :step="0.005" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Decay</div>
          <knob-control class="knob-control" v-model="decay"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="decay" :min="0" :max="10" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Sustain</div>
          <knob-control class="knob-control" v-model="sustain"  :min="0" :max="1" :stepSize="0.05" :size="40" ></knob-control>
          <input type="number" v-model.lazy="sustain" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Release</div>
          <knob-control class="knob-control" v-model="release"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="release" :min="0" :max="10" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls" v-if="this.track.instrumentType === 'monoSynth'">
          <div>Portamento</div>
          <knob-control class="knob-control" v-model="portamento"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="portamento" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls"
              v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                    (this.track.waveType === 'amsine'     || this.track.waveType === 'amtriangle' ||
                    this.track.waveType === 'amsawtooth' || this.track.waveType === 'amsquare'   ||
                    this.track.waveType === 'fmsine'     || this.track.waveType === 'fmtriangle' ||
                    this.track.waveType === 'fmsawtooth' || this.track.waveType === 'fmsquare' ) "
        >
          <div>Harmonicity</div>
          <knob-control class="knob-control" v-model="harmonicity"  :min="0" :max="4" :stepSize="0.001" :size="40" ></knob-control>
          <input type="number" v-model.lazy="harmonicity" :min="0" :max="4" :step="0.001" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls"
              v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                    (this.track.waveType === 'fmsine'     || this.track.waveType === 'fmtriangle' ||
                    this.track.waveType === 'fmsawtooth' || this.track.waveType === 'fmsquare' ) "
        >
          <div>Mod. Index</div>
          <knob-control class="knob-control" v-model="modulationIndex"  :min="0" :max="4" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="modulationIndex" :min="0" :max="4" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls"
              v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                    (this.track.waveType === 'fatsine'     || this.track.waveType === 'fattriangle' ||
                    this.track.waveType === 'fatsawtooth' || this.track.waveType === 'fatsquare' ) "
        >
          <div>Count</div>
          <knob-control class="knob-control" v-model="count"  :min="1" :max="10" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="count" :min="1" :max="10" :step="1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls"
              v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                    (this.track.waveType === 'fatsine'     || this.track.waveType === 'fattriangle' ||
                    this.track.waveType === 'fatsawtooth' || this.track.waveType === 'fatsquare' ) "
        >
          <div>Spread</div>
          <knob-control class="knob-control" v-model="spread"  :min="0" :max="1200" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="spread" :min="0" :max="1200" :step="1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls"
              v-if="(this.track.instrumentType === 'monoSynth' || this.track.instrumentType === 'polySynth') &&
                     this.track.waveType === 'pwm'">
          <div>Mod. Frequency</div>
          <knob-control class="knob-control" v-model="modulationFrequency"  :min="0" :max="100" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="modulationFrequency" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

<!-- EFFECTS **************************************************************************** -->

        <div class="button-esq toggle-delay" v-if="delayActive" @click="toggleDelayActive">Delay On</div>
        <div class="button-esq toggle-delay" v-else @click="toggleDelayActive">Delay Off</div>

        <div class="track-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Time</div>
          <knob-control class="knob-control" v-model="delayTime"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input :id="'trackDelayTime-'+trackId" type="number" v-model.lazy="delayTime" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Feed</div>
          <knob-control class="knob-control" v-model="delayFeedback"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="delayFeedback" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Distortion</div>
          <knob-control class="knob-control" v-model="distortion"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="distortion" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-filter-rolloff-wrap">
            <div class="track-filter-n-rolloff">
              <div>Filter Type</div>
              <select v-model="trackFilterType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
                <option v-for="filter in filterTypes">{{ filter }}</option>
              </select>
            </div>

            <div class="track-filter-n-rolloff">
              <div>Rolloff</div>
              <select v-model="trackFilterRolloff" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
                <option v-for="roll in rolloffs">{{ roll }}</option>
              </select>
            </div>
        </div>

        <div class="track-controls">
          <div>Wet</div>
          <knob-control class="knob-control" v-model="trackFilterWet"  :min="0" :max="1" :stepSize="0.1" :size="40" ></knob-control>
          <input :id="'trackFilterWet-'+trackId" type="number" v-model.lazy="trackFilterWet" :min="0" :max="1" :step="0.1"  @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)"/>
        </div>

        <div class="track-controls">
          <div>Base</div>
          <knob-control class="knob-control" v-model="trackFilterBaseFrequency"  :min="50" :max="10000" :stepSize="50" :size="40" ></knob-control>
          <input type="number" v-model.lazy="trackFilterBaseFrequency" :min="50" :max="10000" :step="50" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Q</div>
          <knob-control class="knob-control" v-model="trackFilterQ"  :min="0" :max="100" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="trackFilterQ" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>LFO Wave</div>
          <select v-model="trackLFOWaveType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
            <option v-for="wave in waveTypes">{{ wave }}</option>
          </select>
        </div>

        <div class="track-controls">
          <div>LFO Freq</div>
          <knob-control class="knob-control" v-model="trackLFOFrequency"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input :id="'trackLFOFrequency-'+trackId" type="number" v-model.lazy="trackLFOFrequency" :min="0" :max="10" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>LFO Depth</div>
          <knob-control class="knob-control" v-model="trackLFODepth"  :min="0" :max="1" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="trackLFODepth" :min="0" :max="1" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="track-controls">
          <div>Octaves</div>
          <knob-control class="knob-control" v-model="trackLFOOctaves"  :min="0.1" :max="6" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="trackLFOOctaves" :min="0.1" :max="6" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>



    </div>

</template>


<script>

//import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl'
import {bus} from '../main.js'


export default {

  name: "",

  props: ['trackNumber', 'trackId'],

  components: {
    //'knob-control': VueKnobControl,
    'knob-control': KnobControl,

  },

  data: () => ({
    instrumentTypes: ['monoSynth', 'polySynth', 'sampler'],
    sampleOptions: ['gtrSwell', 'gtrMute', 'bassGtr', 'piano', 'elecPno1', 'elecPno2', 'elecPno3', 'digiHarp', 'marimba', 'strings'],
    waveNameOptions: [
      'sine','triangle','sawtooth','square', 'amsine','amtriangle','amsawtooth','amsquare',
    'fmsine','fmtriangle','fmsawtooth','fmsquare', 'fatsine','fattriangle','fatsawtooth','fatsquare', 'pwm',
],
    modulationTypes: ['sine', 'triangle', 'sawtooth', 'square'],
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
    delayActive(){
      return this.track.delayActive
    },
    instrumentType: {
      get(){ return this.track.instrumentType },
      set(value){ this.$store.dispatch('changeTrackInstrumentOrSample', { param:'instrumentType', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    waveType: {
      get(){ return this.track.waveType },
      set(value){ this.$store.dispatch('changeTrackWave', { trackNumber: this.trackNumber, wave: value }) },
    },
    sampleType: {
      get(){ return this.track.sampleType },
      set(value){ this.$store.dispatch('changeTrackInstrumentOrSample', { param:'sampleType', trackNumber: this.trackNumber, value: value, track: this.track }) }
    },
    gain: {
      get(){ return Math.round(this.track.gain*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'gain', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    portamento: {
      get(){ return Math.round(this.track.portamento*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'portamento', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    modulationType: {
      get(){ return this.track.modulationType },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'modulationType', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    harmonicity: {
      get(){ return Math.round(this.track.harmonicity*1000)/1000 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'harmonicity', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    modulationIndex: {
      get(){ return Math.round(this.track.modulationIndex*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'modulationIndex', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    count: {
      get(){ return this.track.count },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'count', trackNumber: this.trackNumber, track:this.track, value:value }) },
    },
    spread: {
      get(){ return Math.round(this.track.spread*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'spread', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    modulationFrequency: {
      get(){ return Math.round(this.track.modulationFrequency*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'modulationFrequency', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    delayTime: {
      get(){ return Math.round(this.track.delayTime*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'delayTime', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    delayFeedback: {
      get(){ return Math.round(this.track.delayFeedback*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'delayFeedback', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    distortion: {
      get(){ return Math.round(this.track.distortion*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'distortion', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    /*duration: {
      get(){ return Math.round(this.track.noteDuration*10)/10 },
      set(value){ this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: value } ) },
    },*/
    durationRelative: {
      get(){ return this.track.noteDuration },
      set(value){ this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: value } ) },
    },
    attack: {
      get(){ return Math.round(this.track.attack*1000)/1000 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'attack', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    decay: {
      get(){ return Math.round(this.track.decay*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'decay', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    sustain: {
      get(){ return Math.round(this.track.sustain*100)/100 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'sustain', trackNumber: this.trackNumber, value:value, track:this.track }) },
    },
    release: {
      get(){ return Math.round(this.track.release*10)/10 },
      set(value){ this.$store.dispatch('updateTrackSoundParams', { param:'release', trackNumber: this.trackNumber, value:value, track:this.track }) },
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
    toggleDelayActive(){
      this.$store.commit('toggleTrackDelay', this.trackNumber)
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'track-controls')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
      bus.$emit('clearKeyFromDown', 'Enter')
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
  margin-left: 1px;
  font-size:12px;
}
.track-controls input {
  width: 40px;
  padding: 0;
  font-size:12px;
}

.stacking-select {
  display: block;
}

.toggle-delay {
  width: 55px;
  text-align: center;
}

.track-filter-rolloff-wrap {
  display: inline-block;
  padding: 1px;
}

.track-filter-n-rolloff {
  display: block;
  background: #866;
  text-align: center;
  padding: 2px;
  margin-left: 1px;
  font-size:12px;

}


</style>
