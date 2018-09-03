<template>
  <div class="player-controls-filters">

    <div class="player-controls">
      <div>Wet</div>
      <knob-control class="knob-control" v-model="playerFilterWet"  :min="0" :max="1" :stepSize="0.1" :size="50" ></knob-control>
      <input id="playerFilterWet" type="number" v-model="playerFilterWet" :min="0" :max="1" :step="0.1"  @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)"/>
    </div>

    <div class="player-controls">
      <div>Filter Type</div>
      <select v-model="playerFilterType">
        <option v-for="filter in filterTypes">{{ filter }}</option>
      </select>
    </div>
    <div class="player-controls">
      <div>Rolloff</div>
      <select v-model="playerFilterRolloff">
        <option v-for="roll in rolloffs">{{ roll }}</option>
      </select>
    </div>
    <div class="player-controls">
      <div>Base</div>
      <knob-control class="knob-control" v-model="playerFilterBaseFrequency"  :min="50" :max="10000" :stepSize="50" :size="50" ></knob-control>
      <input type="number" v-model="playerFilterBaseFrequency" :min="50" :max="10000" :step="50" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
    </div>
    <div class="player-controls">
      <div>Q</div>
      <knob-control class="knob-control" v-model="playerFilterQ"  :min="0" :max="100" :stepSize="1" :size="50" ></knob-control>
      <input type="number" v-model="playerFilterQ" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
    </div>

    <br>

    <div class="player-controls">
      <div>LFO Wave</div>
      <select v-model="playerLFOWaveType">
        <option v-for="wave in waveTypes">{{ wave }}</option>
      </select>
    </div>
    <div class="player-controls">
      <div>LFO Freq</div>
      <knob-control class="knob-control" v-model="playerLFOFrequency"  :min="0" :max="20" :stepSize="0.1" :size="50" ></knob-control>
      <input id="playerLFOFrequency" type="number" v-model="playerLFOFrequency" :min="0" :max="20" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
    </div>
    <div class="player-controls">
      <div>LFO Depth</div>
      <knob-control class="knob-control" v-model="playerLFODepth"  :min="0" :max="1" :stepSize="0.1" :size="50" ></knob-control>
      <input type="number" v-model="playerLFODepth" :min="0" :max="1" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
    </div>
    <div class="player-controls">
      <div>Octaves</div>
      <knob-control class="knob-control" v-model="playerLFOOctaves"  :min="0.1" :max="6" :stepSize="0.1" :size="50" ></knob-control>
      <input type="number" v-model="playerLFOOctaves" :min="0.1" :max="6" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
    </div>

  </div>
</template>

<script>

// https://www.reddit.com/r/vuejs/comments/8izmhj/best_approach_to_x_y_coordinate_box/?st=jh475alr&sh=4266af8c

// import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl.vue'


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
    playerFilterWet: {
      get(){ return  Math.round(this.$store.state.playerFilter.filterWet*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'filterWet', 'value':value }) },
    },

    playerFilterType: {
      get(){ return  this.$store.state.playerFilter.filterType },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'filterType', 'value':value }) },
    },
    playerFilterRolloff: {
      get() { return this.$store.state.playerFilter.filterRolloff },
      set(value) { this.$store.commit('updatePlayerFilter', { 'param': 'filterRolloff', 'value': value }) }
    },
    playerFilterBaseFrequency: {
      get(){ return  Math.round(this.$store.state.playerFilter.filterBaseFrequency*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'filterBaseFrequency', 'value':value }) },
    },
    playerFilterQ: {
      get(){ return  Math.round(this.$store.state.playerFilter.filterQ*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'filterQ', 'value':value }) },
    },

    playerLFOWaveType: {
      get(){ return  this.$store.state.playerFilter.LFOWaveType },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'LFOWaveType', 'value':value }) },
    },
    playerLFOFrequency: {
      get(){ return Math.round(this.$store.state.playerFilter.LFOFrequency*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'LFOFrequency', 'value':value }) },
    },
    playerLFODepth: {
      get(){ return  Math.round(this.$store.state.playerFilter.LFODepth*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'LFODepth', 'value':value }) },
    },
    playerLFOOctaves: {
      get(){ return  Math.round(this.$store.state.playerFilter.LFOOctaves*10)/10 },
      set(value){ this.$store.commit('updatePlayerFilter', { 'param':'LFOOctaves', 'value':value }) },
    },
  },

  methods: {
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'qwerty-filter')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
    },
  },

}

</script>

<style>

.player-controls-filters {
  float: left;
}

.player-controls {
  display: inline-block;
  background: #866;
  text-align: center;
  padding: 3px;
}
.player-controls input {
  width: 40px;
  padding: 0;
  font-size:12px;
}


</style>
