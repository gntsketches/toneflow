<template>
  <div class="player-info-wrap">

      <div class="player-controls-options-left">

        <div class="player-controls-options-left-text">Octave:</div>
        <div class="octave-changer "@click="changeQwertyOctave('decrement')" >-</div>
        <div class="octave-changer" @click="changeQwertyOctave('increment')" >+</div>

        <div class="player-controls-options-left-text">Layout:</div>
        <select v-model:value="QWERTYDisplay" @change="enterFunction($event)">
          <option v-for="option in QWERTYDisplayOptions">{{ option }}</option>
        </select>

        <br><br>

        <div class="player-controls-options-left-text">Wave Type:</div>
        <select id="playerWaveType"
          v-model:value="storePlayerWaveType"
          @change="enterFunction($event)"
        >
          <option>sine</option>
          <option>triangle</option>
          <option>sawtooth</option>
          <option>square</option>
        </select>

        <br><br>
        <div class="button-esq" v-if="delayActive" @click="toggleDelayActive">Delay On</div>
        <div class="button-esq" v-else @click="toggleDelayActive">Delay Off</div>


    </div>

      <div class="player-controls-knobs-left">

        <div class="player-controls">
          <div>Gain</div>
          <knob-control class="knob-control" v-model="playerGain"  :min="0" :max="2" :stepSize="0.1" :size="50" ></knob-control>
          <input id="playerGain" type="number" v-model="playerGain" :min="0" :max="2" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" >
          <div>Distortion</div>
          <knob-control class="knob-control" v-model="playerDistortion"  :min="0" :max="1" :stepSize="0.05" :size="50" ></knob-control>
          <input type="number" v-model="playerDistortion" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Time</div>
          <knob-control class="knob-control" v-model="playerDelayTime"  :min="0" :max="1" :stepSize="0.01" :size="50" ></knob-control>
          <input type="number" v-model="playerDelayTime" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" v-bind:class="{ greyOut: !delayActive }" >
          <div>Delay Feed</div>
          <knob-control class="knob-control" v-model="playerDelayFeedback"  :min="0" :max="1" :stepSize="0.05" :size="50" ></knob-control>
          <input type="number" v-model="playerDelayFeedback" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <br>

        <div class="player-controls">
          <div>Attack</div>
          <knob-control class="knob-control" v-model="playerAttack"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input id="playerAttack" type="number" v-model="playerAttack" :min="0" :max="10" :step="0.005" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Decay</div>
          <knob-control class="knob-control" v-model="playerDecay"  :min="0" :max="10" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="playerDecay" :min="0" :max="10" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Sustain</div>
          <knob-control class="knob-control" v-model="playerSustain"  :min="0" :max="1" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="playerSustain" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Release</div>
          <knob-control class="knob-control" v-model="playerRelease"  :min="0" :max="30" :stepSize="0.1" :size="50" ></knob-control>
          <input type="number" v-model="playerRelease" :min="0" :max="30" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

    </div>

  </div>
</template>


<script>


//import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl.vue'

export default {
  name: "",

  components: {
    //'knob-control': VueKnobControl,
    'knob-control': KnobControl,
  },

  data: () => ({
    QWERTYDisplayOptions: ['Rows-Octave', 'Clusters'],
  }),

  computed: {
    delayActive() {
      return this.$store.state.playerParams.delayActive
    },
    storePlayerWaveType: {
      get(){ return this.$store.state.playerParams.waveType },
      set(value){ this.$store.commit('changePlayerWaveType', value ) },
    },
    QWERTYDisplay: {
      get(){ return this.$store.state.keyToQwertyDisplay },
      set(value){ this.$store.commit('changeQwertyDisplay', value ) },
    },
    playerGain: {
      get(){ return Math.round(this.$store.state.playerParams.gain*10)/10 },
      set(value){ this.$store.commit('adjustSoundParam', { param:'gain', paramPercent:value }) },
    },
    playerDistortion: {
      get(){ return Math.round(this.$store.state.playerParams.distortion*10)/10 },
      set(value){ this.$store.commit('adjustSoundParam', { param:'distortion', paramPercent:value }) },
    },
    playerDelayTime: {
      get(){ return Math.round(this.$store.state.playerParams.delayTime*10)/10 },
      set(value){ this.$store.commit('adjustSoundParam', { param:'delayTime', paramPercent:value }) },
    },
    playerDelayFeedback: {
      get(){ return Math.round(this.$store.state.playerParams.delayFeedback*10)/10 },
      set(value){ this.$store.commit('adjustSoundParam', { param:'delayFeedback', paramPercent:value }) },
    },

    playerAttack: {
      get(){ return Math.round(this.$store.state.playerADSR.attack*1000)/1000 },
      set(value){ this.$store.commit('updatePlayerADSR', { 'adsr':'attack', 'value':value }) },
    },
    playerDecay: {
      get(){ return Math.round(this.$store.state.playerADSR.decay*10)/10 },
      set(value){ this.$store.commit('updatePlayerADSR', { 'adsr':'decay', 'value':value }) },
    },
    playerSustain: {
      get(){ return Math.round(this.$store.state.playerADSR.sustain*10)/10 },
      set(value){ this.$store.commit('updatePlayerADSR', { 'adsr':'sustain', 'value':value }) },
    },
    playerRelease: {
      get(){ return Math.round(this.$store.state.playerADSR.release*10)/10 },
      set(value){ this.$store.commit('updatePlayerADSR', { 'adsr':'release', 'value':value }) },
    },
  },

  methods: {
    changeQwertyOctave(change){
      this.$store.commit('changeQwertyOctave', change)
    },
    toggleDelayActive(){
      this.$store.commit('toggleDelayActive')
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'qwerty-info')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
    },
  },
}
</script>

<style>

.player-info-wrap {
  float: left;
  /*width: 300px;*/
}

.player-controls-options-left {
  float:left;
}

.player-controls-knobs-left {
  float:left;
}

.player-controls-options-left-text {
  padding: 3px;
}

.octave-changer {
  display: inline-block;
  cursor: pointer;
  background: #aaf;
  width: 15px;
  text-align: center;
  padding: 2px;
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
