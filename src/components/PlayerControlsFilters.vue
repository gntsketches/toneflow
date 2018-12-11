<template>
  <div class="player-controls-filters">

    <div class="player-effects-left">

        <div class="player-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Time</div>
          <knob-control class="knob-control" v-model="playerDelayTime"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input id="playerDelayTime" type="number" v-model.lazy="playerDelayTime" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Feed</div>
          <knob-control class="knob-control" v-model="playerDelayFeedback"  :min="0" :max="1" :stepSize="0.05" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerDelayFeedback" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <br>
        <div class="button-esq toggle-delay" v-if="delayActive" @click="toggleDelayActive">Delay On</div>
        <div class="button-esq toggle-delay" v-else @click="toggleDelayActive">Delay Off</div>
        <div class="player-controls" >
          <div>Distortion</div>
          <knob-control class="knob-control" v-model="playerDistortion"  :min="0" :max="1" :stepSize="0.05" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerDistortion" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
    </div>

    <div class="player-effects-middle">
        <div class="player-controls">
          <div>Wet</div>
          <knob-control class="knob-control" v-model="playerFilterWet"  :min="0" :max="1" :stepSize="0.1" :size="40" ></knob-control>
          <input id="playerFilterWet" type="number" v-model.lazy="playerFilterWet" :min="0" :max="1" :step="0.1"  @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)"/>
        </div>
        <div class="player-controls">
          <div>Base</div>
          <knob-control class="knob-control" v-model="playerFilterBaseFrequency"  :min="50" :max="10000" :stepSize="50" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerFilterBaseFrequency" :min="50" :max="10000" :step="50" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Q</div>
          <knob-control class="knob-control" v-model="playerFilterQ"  :min="0" :max="100" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerFilterQ" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <br>
        <div class="player-controls">
          <div>Rolloff</div>
          <select v-model="playerFilterRolloff" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
            <option v-for="roll in rolloffs">{{ roll }}</option>
          </select>
        </div>
        <div class="player-controls">
          <div>Filter Type</div>
          <select v-model="playerFilterType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
            <option v-for="filter in filterTypes">{{ filter }}</option>
          </select>
        </div>

    </div>


    <div class="player-effects-right">

        <div class="player-controls">
          <div>LFO Freq</div>
          <knob-control class="knob-control" v-model="playerLFOFrequency"  :min="0" :max="20" :stepSize="0.1" :size="40" ></knob-control>
          <input id="playerLFOFrequency" type="number" v-model.lazy="playerLFOFrequency" :min="0" :max="20" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>LFO Depth</div>
          <knob-control class="knob-control" v-model="playerLFODepth"  :min="0" :max="1" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerLFODepth" :min="0" :max="1" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Octaves</div>
          <knob-control class="knob-control" v-model="playerLFOOctaves"  :min="0.1" :max="6" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerLFOOctaves" :min="0.1" :max="6" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <br>

        <div class="player-controls">
          <div>LFO Wave</div>
          <select v-model="playerLFOWaveType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)">
            <option v-for="wave in waveTypes">{{ wave }}</option>
          </select>
        </div>

    </div>


  </div>
</template>

<script>

// https://www.reddit.com/r/vuejs/comments/8izmhj/best_approach_to_x_y_coordinate_box/?st=jh475alr&sh=4266af8c

// import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl.vue'
import {bus} from '../main.js'

export default {

  name: "",

  components: {
    //'knob-control': VueKnobControl,
    'knob-control': KnobControl,
  },

  data: () => ({
    filterTypes: ['lowpass', 'highpass', 'bandpass', 'notch', 'allpass'],
    waveTypes: ['sine', 'triangle', 'sawtooth', 'square'],
    rolloffs: ['-12','-24','-48','-96'],
  }),

  computed: {
    delayActive() {
      return this.$store.state.playerParams.delayActive
    },
    playerDelayTime: {
      get(){ return Math.round(this.$store.state.playerParams.delayTime*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'delayTime', value:value }) },
    },
    playerDelayFeedback: {
      get(){ return Math.round(this.$store.state.playerParams.delayFeedback*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'delayFeedback', value:value }) },
    },
    playerDistortion: {
      get(){ return Math.round(this.$store.state.playerParams.distortion*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'distortion', value:value }) },
    },

    playerFilterWet: {
      get(){ return  Math.round(this.$store.state.playerParams.filterWet*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'filterWet', 'value':value }) },
    },
    playerFilterType: {
      get(){ return  this.$store.state.playerParams.filterType },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'filterType', 'value':value }) },
    },
    playerFilterRolloff: {
      get() { return this.$store.state.playerParams.filterRolloff },
      set(value) { this.$store.commit('updatePlayerParam', { 'param': 'filterRolloff', 'value': value }) }
    },
    playerFilterBaseFrequency: {
      get(){ return  Math.round(this.$store.state.playerParams.filterBaseFrequency*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'filterBaseFrequency', 'value':value }) },
    },
    playerFilterQ: {
      get(){ return  Math.round(this.$store.state.playerParams.filterQ*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'filterQ', 'value':value }) },
    },

    playerLFOWaveType: {
      get(){ return  this.$store.state.playerParams.LFOWaveType },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'LFOWaveType', 'value':value }) },
    },
    playerLFOFrequency: {
      get(){ return Math.round(this.$store.state.playerParams.LFOFrequency*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'LFOFrequency', 'value':value }) },
    },
    playerLFODepth: {
      get(){ return  Math.round(this.$store.state.playerParams.LFODepth*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'LFODepth', 'value':value }) },
    },
    playerLFOOctaves: {
      get(){ return  Math.round(this.$store.state.playerParams.LFOOctaves*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { 'param':'LFOOctaves', 'value':value }) },
    },
  },

  methods: {
    toggleDelayActive(){
      this.$store.commit('toggleDelayActive')
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'qwerty-filter')
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

.player-controls-filters {
  float: left;
  padding: 5px;
}

.player-controls {
  display: inline-block;
  background: #866;
  text-align: center;
  padding: 3px;
  margin: 1px;
}
.player-controls input {
  width: 40px;
  padding: 0;
  font-size:12px;
}
.stacking {

}


.player-effects-left{
  float: left;
  margin-right: 10px;
}
.player-effects-middle{
  float: left;
  margin-right: 10px;
}
.player-effects-right{
  float: left;
}

/*.toggle-delay {  defined in TrackSoundPanel
  width: 65px;
}*/

</style>
