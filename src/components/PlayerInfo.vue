<template>
  <div class="player-info-wrap">

      <div class="player-param-settings">
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[0].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 0
                      }"
             @click="activatePlayerParamSettings(0)"
        >Default</div>
        <div class="param-setting"
             :class="{paramIsSet: this.$store.state.playerParamSettings[1].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 1
                      }"
             @click="activatePlayerParamSettings(1)"
             @contextmenu="assignPlayerParamSetting(1, $event)"
        >1</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[2].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 2
                      }"
             @click="activatePlayerParamSettings(2)"
             @contextmenu="assignPlayerParamSetting(2, $event)"
        >2</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[3].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 3
                      }"
             @click="activatePlayerParamSettings(3)"
             @contextmenu="assignPlayerParamSetting(3, $event)"
        >3</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[4].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 4
                      }"
             @click="activatePlayerParamSettings(4)"
             @contextmenu="assignPlayerParamSetting(4, $event)"
        >4</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[5].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 5
                      }"
             @click="activatePlayerParamSettings(5)"
             @contextmenu="assignPlayerParamSetting(5, $event)"
        >5</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[6].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 6
                      }"
             @click="activatePlayerParamSettings(6)"
             @contextmenu="assignPlayerParamSetting(6, $event)"
        >6</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[7].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 7
                      }"
             @click="activatePlayerParamSettings(7)"
             @contextmenu="assignPlayerParamSetting(7, $event)"
        >7</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[8].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 8
                      }"
             @click="activatePlayerParamSettings(8)"
             @contextmenu="assignPlayerParamSetting(8, $event)"
        >8</div>
        <div class="param-setting"
             :class="{paramIsSet: this.playerParamSettings[9].assigned,
                      currentParam: this.$store.state.playerParamCurrent == 9
                      }"
             @click="activatePlayerParamSettings(9)"
             @contextmenu="assignPlayerParamSetting(9, $event)"
        >9</div>
      </div>

      <div class="player-controls-options-left">

        <!-- <span class="player-controls-options-left-text">Oct</span> -->
        <div class="octave-changer "@click="changeQwertyOctave('decrement')" >-</div>
        <div class="octave-changer" @click="changeQwertyOctave('increment')" >+</div>

        <!-- these selects had: @change="enterFunction($event)"    -->
        <select v-model:value="QWERTYDisplay" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)" >
          <option v-for="option in QWERTYDisplayOptions">{{ option }}</option>
        </select>

        <select id="playerInstrumentType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)"
          v-model:value="storePlayerInstrumentType"
        >
          <option v-for="instrumentType in instrumentTypeOptions" >{{ instrumentType }}</option>
        </select>

        <select id="playerWaveType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)"
          v-if="this.playerParams.instrumentType === 'polySynth' || this.playerParams.instrumentType === 'monoSynth'"
          v-model:value="storePlayerWaveType"
        >
          <option v-for="waveName in waveNameOptions" >{{ waveName }}</option>
        </select>

        <select id="playerSampleType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)"
          v-else
          v-model:value="storePlayerSampleType"
        >
          <option v-for="sampleOption in sampleOptions" >{{ sampleOption }}</option>
        </select>

    </div>

      <div class="player-controls-knobs-left">

        <div class="player-controls">
          <div>Gain</div>
          <knob-control class="knob-control" v-model="playerGain"  :min="0" :max="2" :stepSize="0.01" :size="40" ></knob-control>
          <input id="playerGain" type="number" v-model.lazy="playerGain" :min="0" :max="2" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls">
          <div>Attack</div>
          <knob-control class="knob-control" v-model="playerAttack"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input id="playerAttack" type="number" v-model.lazy="playerAttack" :min="0" :max="10" :step="0.005" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" v-bind:class="{ greyOut: storePlayerInstrumentType === 'pianoSample' }">
          <div>Decay</div>
          <knob-control class="knob-control" v-model="playerDecay"  :min="0" :max="10" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerDecay" :min="0" :max="10" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls" v-bind:class="{ greyOut: storePlayerInstrumentType === 'pianoSample' }">
          <div>Sustain</div>
          <knob-control class="knob-control" v-model="playerSustain"  :min="0" :max="1" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerSustain" :min="0" :max="1" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>
        <div class="player-controls">
          <div>Release</div>
          <knob-control class="knob-control" v-model="playerRelease"  :min="0" :max="30" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerRelease" :min="0" :max="30" :step="0.05" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls" v-if="this.$store.state.playerParams.instrumentType === 'monoSynth'">
          <div>Portamento</div>
          <knob-control class="knob-control" v-model="playerPortamento"  :min="0" :max="1" :stepSize="0.01" :size="40" ></knob-control>
          <input id="playerPortamento" type="number" v-model.lazy="playerPortamento" :min="0" :max="1" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <br>

        <select class="player-controls" v-model="playerModulationType" @focus="focusFunction" @change="enterFunction($event)" @blur="enterFunction($event)"
                v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') &&
                      (this.playerParams.waveType === 'amsine'     || this.playerParams.waveType === 'amtriangle' ||
                      this.playerParams.waveType === 'amsawtooth' || this.playerParams.waveType === 'amsquare'   ||
                      this.playerParams.waveType === 'fmsine'     || this.playerParams.waveType === 'fmtriangle' ||
                      this.playerParams.waveType === 'fmsawtooth' || this.playerParams.waveType === 'fmsquare')"
        >
          <option v-for="modulationType in modulationTypes">{{ modulationType }}</option>
        </select>

        <div class="player-controls"
              v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') &&
                    (this.playerParams.waveType === 'amsine'     || this.playerParams.waveType === 'amtriangle' ||
                    this.playerParams.waveType === 'amsawtooth' || this.playerParams.waveType === 'amsquare'   ||
                    this.playerParams.waveType === 'fmsine'     || this.playerParams.waveType === 'fmtriangle' ||
                    this.playerParams.waveType === 'fmsawtooth' || this.playerParams.waveType === 'fmsquare')"
        >
          <div>Harmonicity</div>
          <knob-control class="knob-control" v-model="playerHarmonicity"  :min="0" :max="4" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerHarmonicity" :min="0" :max="4" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls"
              v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') &&
                    (this.playerParams.waveType === 'fmsine'     || this.playerParams.waveType === 'fmtriangle' ||
                    this.playerParams.waveType === 'fmsawtooth' || this.playerParams.waveType === 'fmsquare')"
        >
          <div>Mod. Index</div>
          <knob-control class="knob-control" v-model="playerModulationIndex"  :min="0" :max="4" :stepSize="0.01" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerModulationIndex" :min="0" :max="4" :step="0.01" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls"
              v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') &&
                    (this.playerParams.waveType === 'fatsine'     || this.playerParams.waveType === 'fattriangle' ||
                    this.playerParams.waveType === 'fatsawtooth' || this.playerParams.waveType === 'fatsquare')"
        >
          <div>Count</div>
          <knob-control class="knob-control" v-model="playerCount"  :min="1" :max="10" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerCount" :min="1" :max="10" :step="1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls"
              v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') &&
                    (this.playerParams.waveType === 'fatsine' || this.playerParams.waveType === 'fattriangle' ||
                    this.playerParams.waveType === 'fatsawtooth' || this.playerParams.waveType === 'fatsquare')"
        >
          <div>Spread</div>
          <knob-control class="knob-control" v-model="playerSpread"  :min="0" :max="1200" :stepSize="1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerSpread" :min="0" :max="1200" :step="1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>

        <div class="player-controls" v-if="(this.playerParams.instrumentType === 'monoSynth' || this.playerParams.instrumentType === 'polySynth') && this.playerParams.waveType === 'pwm'">
          <div>Mod. Frequency</div>
          <knob-control class="knob-control" v-model="playerModulationFrequency"  :min="0" :max="100" :stepSize="0.1" :size="40" ></knob-control>
          <input type="number" v-model.lazy="playerModulationFrequency" :min="0" :max="100" :step="0.1" @focus="focusFunction" @keyup.enter="enterFunction($event)" @blur="enterFunction($event)" />
        </div>


    </div>

  </div>
</template>


<script>


//import VueKnobControl from 'vue-knob-control'
import KnobControl from './KnobControl.vue'
import {bus} from '../main.js'



export default {
  name: "",

  components: {
    //'knob-control': VueKnobControl,
    'knob-control': KnobControl,
  },

  data: () => ({
    QWERTYDisplayOptions: ['Rows-Octave', 'Rows-Fifth', 'Clusters'],
    instrumentTypeOptions: ['monoSynth', 'polySynth', 'sampler'],
    sampleOptions: ['gtrSwell', 'gtrMute', 'bassGtr', 'piano', 'elecPno1', 'elecPno2', 'elecPno3', 'marimba', 'strings'],
    waveNameOptions: [
      'sine','triangle','sawtooth','square',
      'amsine','amtriangle','amsawtooth','amsquare',
      'fmsine','fmtriangle','fmsawtooth','fmsquare',
      'fatsine','fattriangle','fatsawtooth','fatsquare',
      'pwm',
    ],
    modulationTypes: ['sine', 'triangle', 'sawtooth', 'square'],
  }),

  computed: {

    playerParamSettings(){
      console.log('settings', this.$store.state.playerParamSettings)
      return this.$store.state.playerParamSettings
    },
    playerParams(){
      return this.$store.state.playerParams
    },
    QWERTYDisplay: {
      get(){ return this.playerParams.keyToQwertyDisplay },
      set(value){ this.$store.commit('changeQwertyDisplay', value ) },
    },
    storePlayerInstrumentType: {
      get(){ return this.playerParams.instrumentType },
      set(value){ this.$store.commit('changePlayerInstrumentType', value ) },
    },
    storePlayerWaveType: {
      get(){ return this.playerParams.waveType },
      set(value){ this.$store.commit('changePlayerWaveType', value ) },
    },
    storePlayerSampleType: {
      get(){ return this.playerParams.sampleType },
      set(value){ this.$store.commit('changePlayerSampleType', value ) },
    },

    playerGain: {
      get(){ return Math.round(this.playerParams.gain*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'gain', value:value }) },
    },
    playerAttack: {
      get(){ return Math.round(this.playerParams.attack*1000)/1000 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'attack', 'value':value }) },
    },
    playerDecay: {
      get(){ return Math.round(this.playerParams.decay*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'decay', 'value':value }) },
    },
    playerSustain: {
      get(){ return Math.round(this.playerParams.sustain*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'sustain', 'value':value }) },
    },
    playerRelease: {
      get(){ return Math.round(this.playerParams.release*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'release', 'value':value }) },
    },
    playerPortamento: {
      get(){ return Math.round(this.playerParams.portamento*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'portamento', 'value':value }) },
    },
    playerModulationType: {
      get(){ return this.playerParams.modulationType },
      set(value){ this.$store.commit('updatePlayerParam', { param:'modulationType', value:value }) },
    },
    playerHarmonicity: {
      get(){ return Math.round(this.playerParams.harmonicity*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'harmonicity', value:value }) },
    },
    playerModulationIndex: {
      get(){ return Math.round(this.playerParams.modulationIndex*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'modulationIndex', value:value }) },
    },
    playerCount: {
      get(){ return this.playerParams.count },
      set(value){ this.$store.commit('updatePlayerParam', { param:'count', value:value }) },
    },
    playerSpread: {
      get(){ return Math.round(this.playerParams.spread*10)/10 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'spread', value:value }) },
    },
    playerModulationFrequency: {
      get(){ return Math.round(this.playerParams.modulationFrequency*100)/100 },
      set(value){ this.$store.commit('updatePlayerParam', { param:'modulationFrequency', value:value }) },
    },
  },

  methods: {
    changeQwertyOctave(change){
      this.$store.commit('changeQwertyOctave', change)
    },
    assignPlayerParamSetting(settingNumber, e){
      e.preventDefault()
      this.$store.commit('assignPlayerParamSetting', settingNumber)
    },
    activatePlayerParamSettings(settingNumber){
      this.$store.commit('activatePlayerParamSettings', settingNumber)
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'qwerty-info')
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

.player-info-wrap {
  float: left;
  padding: 5px;
  /*width: 300px;*/
}

.player-param-settings {

}

.param-setting {
  display: inline-block;
  min-width: 20px;
  background: #777;
  color: black;
  padding: 2px;
  border: 1px solid transparent;
  margin: 2px 0 2px 0px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
}

.paramIsSet {
  background: #a554a4;
}

.currentParam {
  border: 1px solid #0f0;
}

.player-controls-options-left {
  /*float:left;*/
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
  font-size:12px;
}
.player-controls input {
  width: 40px;
  padding: 0;
  font-size:12px;
}


</style>
