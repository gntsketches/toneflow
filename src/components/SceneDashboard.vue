<template>

<div class="scene-dashboard">

  <scene-info></scene-info>
  <piano-selector></piano-selector>

  <div class="random-entry">

      <div>

          <input v-show="scene.editingForm" class="harmonic-form-regex" type="text"
            ref="formInput"
            :value="harmonicFormString"
            @focus="focusFunction"
            @keyup.enter="handleHarmonicFormEntry($event)"
            @blur="handleHarmonicFormEntry($event)"
            placeholder="Enter modulation form, eg: -a -b -a -c"
            spellcheck="false"
          ></input>
          <div v-if="!scene.editingForm" class="harmonic-form-display" @click="toggleEditingForm">
              <span v-if="harmonicFormArray.length === 0">Enter modulation form, eg: -a -b -a -c</span>
              <span class="harmonic-form-step" v-for="(step, index) in harmonicFormArray" v-if="harmonicFormArray.length > 0">
                  <span :class="{ currentFormStep: scene.formStep === index }">{{ step }}</span>,
              </span>
          </div>


      </div>

      <div class="modulation-options">
          <div class="mode-advance-meter">
            <div v-if="this.scene.autoModulate" v-bind:style="{ width: progressTillChange + '%' }"></div>
          </div>
          <span>=></span>
          <div class="mode-advance-title">
              <div v-if="this.nextModulation != '' && !(this.scene.autoModulate === false && this.scene.modulationStyle==='drift')">
                  {{ nextModulation }}
              </div>
          </div>

          <br>

          <div class="button-esq"
          v-if="this.scene.modulationStyle === 'drift'" @click="toggleModulationStyle"
          >Drift</div>
          <div class="button-esq"
          v-else @click="toggleModulationStyle"
          >Form</div>

          <div class="button-esq" v-if="this.scene.autoModulate" @click="autoModulate('off')">Auto On&nbsp</div>
          <div class="button-esq" v-else @click="autoModulate('on')">Auto Off</div>

          <div class="modulate-per-lead-changes" :class="{ greyOut: !this.scene.autoModulate }">
            <span>per</span>
            <input type="number" min="1"
                   v-model="modulatePerLeadChanges"
                   @focus="focusFunction"
                   @keyup.enter="enterFunction"
            />
          </div>

          <div class="button-esq" v-if="this.scene.modulationStyle==='drift'" @click="morphSelectedNotes">Modulate</div>
          <div class="button-esq" v-else @click="morphSelectedNotes">Advance</div>

          <br>

          <div class="button-esq" v-if="this.scene.suspendChanges" @click="toggleSuspendChanges">Changes Suspended</div>
          <div class="button-esq" v-else @click="toggleSuspendChanges">Changes Active</div>

          <div class="button-esq" v-if="filterPitchesOnChange" v-on:click="toggleFilterOnChange">Filter On&nbsp</div>
          <div class="button-esq" v-else v-on:click="toggleFilterOnChange">Filter Off</div>

          <div class="button-esq increment-weights" @click="incrementModulationWeights">+ Types</div>

      </div>

      <div class="mode-options">

          <div>
              <div class="root-pitch-selector">
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('C') > -1 }"
                        @click="updateSelectedRootPitches('C')"
                        @contextmenu="soloSelectedRootPitch('C', $event)">
                  C</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('Cs') > -1 }"
                        @click="updateSelectedRootPitches('Cs')"
                        @contextmenu="soloSelectedRootPitch('Cs', $event)">
                  C#</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('D') > -1 }"
                        @click="updateSelectedRootPitches('D')"
                        @contextmenu="soloSelectedRootPitch('D', $event)">
                  D</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('Ds') > -1 }"
                        @click="updateSelectedRootPitches('Ds')"
                        @contextmenu="soloSelectedRootPitch('Ds', $event)">
                  D#</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('E') > -1 }"
                        @click="updateSelectedRootPitches('E')"
                        @contextmenu="soloSelectedRootPitch('E', $event)">
                  E</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('F') > -1 }"
                        @click="updateSelectedRootPitches('F')"
                        @contextmenu="soloSelectedRootPitch('F', $event)">
                  F</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('Fs') > -1 }"
                        @click="updateSelectedRootPitches('Fs')"
                        @contextmenu="soloSelectedRootPitch('Fs', $event)">
                  F#</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('G') > -1 }"
                        @click="updateSelectedRootPitches('G')"
                        @contextmenu="soloSelectedRootPitch('G', $event)">
                  G</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('Gs') > -1 }"
                        @click="updateSelectedRootPitches('Gs')"
                        @contextmenu="soloSelectedRootPitch('Gs', $event)">
                  G#</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('A') > -1 }"
                        @click="updateSelectedRootPitches('A')"
                        @contextmenu="soloSelectedRootPitch('A', $event)">
                  A</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('As') > -1 }"
                        @click="updateSelectedRootPitches('As')"
                        @contextmenu="soloSelectedRootPitch('As', $event)">
                  A#</div>
                  <div class="root-pitch-option"
                        :class="{ rootPitchOptionSelected: this.selectedRootPitches.indexOf('B') > -1 }"
                        @click="updateSelectedRootPitches('B')"
                        @contextmenu="soloSelectedRootPitch('B', $event)">
                  B</div>

                  <div class="button-esq all-root-pitches" @click="updateSelectedRootPitches('all')">All Roots</div>

              </div>
          </div>

          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('dia')" @contextmenu="soloModulationWeight('dia', $event)" >Dia</span>
                <input type="number" min="0" :value="modulationWeights['dia']" @input="updateModulationWeights('dia', $event)" @focus="focusFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('mel')" @contextmenu="soloModulationWeight('mel', $event)" >Mel</span>
                <input type="number" min="0" :value="modulationWeights['mel']" @input="updateModulationWeights('mel', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('har')" @contextmenu="soloModulationWeight('har', $event)" >Har</span>
                <input type="number" min="0" :value="modulationWeights['har']" @input="updateModulationWeights('har', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('dim')" @contextmenu="soloModulationWeight('dim', $event)" >Dim</span>
                <input type="number" min="0" :value="modulationWeights['dim']" @input="updateModulationWeights('dim', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('aug')" @contextmenu="soloModulationWeight('aug', $event)" >Aug</span>
                <input type="number" min="0" :value="modulationWeights['aug']" @input="updateModulationWeights('aug', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('chr')" @contextmenu="soloModulationWeight('chr', $event)" >Chr</span>
                <input type="number" min="0" :value="modulationWeights['chr']" @input="updateModulationWeights('chr', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('maj')" @contextmenu="soloModulationWeight('maj', $event)" >Maj</span>
                <input type="number" min="0" :value="modulationWeights['maj']" @input="updateModulationWeights('maj', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('min')" @contextmenu="soloModulationWeight('min', $event)" >Min</span>
                <input type="number" min="0" :value="modulationWeights['min']" @input="updateModulationWeights('min', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('sus')" @contextmenu="soloModulationWeight('sus', $event)" >Sus</span>
                <input type="number" min="0" :value="modulationWeights['sus']" @input="updateModulationWeights('sus', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('maj')" @contextmenu="soloModulationWeight('ma7', $event)" >Ma7</span>
                <input type="number" min="0" :value="modulationWeights['ma7']" @input="updateModulationWeights('ma7', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('dom')" @contextmenu="soloModulationWeight('dom', $event)" >Dom</span>
                <input type="number" min="0" :value="modulationWeights['dom']" @input="updateModulationWeights('dom', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('mi7')" @contextmenu="soloModulationWeight('mi7', $event)" >Mi7</span>
                <input type="number" min="0" :value="modulationWeights['mi7']" @input="updateModulationWeights('mi7', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('hdm')" @contextmenu="soloModulationWeight('hdm', $event)" >Hdm</span>
                <input type="number" min="0" :value="modulationWeights['hdm']" @input="updateModulationWeights('hdm', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('dm7')" @contextmenu="soloModulationWeight('dm7', $event)" >Dm7</span>
                <input type="number" min="0" :value="modulationWeights['dm7']" @input="updateModulationWeights('dm7', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('blu')" @contextmenu="soloModulationWeight('blu', $event)" >Blu</span>
                <input type="number" min="0" :value="modulationWeights['blu']" @input="updateModulationWeights('blu', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span @click="changeToModeType('pen')" @contextmenu="soloModulationWeight('pen', $event)" >Pen</span>
                <input type="number" min="0" :value="modulationWeights['pen']" @input="updateModulationWeights('pen', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('fth')" @contextmenu="soloModulationWeight('fth', $event)" >Fth</span>
                <input type="number" min="0" :value="modulationWeights['fth']" @input="updateModulationWeights('fth', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span @click="changeToModeType('one')" @contextmenu="soloModulationWeight('one', $event)" >One</span>
                <input type="number" min="0" :value="modulationWeights['one']" @input="updateModulationWeights('one', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
      </div>

  </div>

</div>

</template>


<script>
import SceneInfo from './SceneInfo.vue'
import PianoSelector from './PianoSelector.vue'
import {modeData as MODEDATA} from "../modeData"


export default {
    components: {
      'scene-info': SceneInfo,
      'piano-selector': PianoSelector,
    },
    data(){
      return {
      }
    },
    computed: {
      scene(){
        return this.$store.state.scenes[this.$store.state.editingSceneNumber]
      },
      progressTillChange(){
        // is this expensive? Maybe there is a way to save some calc time?
        let leadTrack = this.scene.tracks[this.$store.getters.leadTrackNumber]
        let leadTuneLength = this.$store.getters.toneTunes[this.$store.getters.leadTrackNumber].length
        if (leadTuneLength === 0) { return 0}
        let stepsNeeded = leadTrack.changePer * leadTuneLength * this.scene.modulatePerLeadChanges
        let modCycleSteps = this.scene.modulationCycles * leadTrack.changePer * leadTuneLength
        let currentChangeCycleSteps = leadTrack.changeCycles * leadTuneLength
        let stepsSoFar = modCycleSteps + currentChangeCycleSteps + leadTrack.toneTuneIndex
        let progress = stepsSoFar / stepsNeeded * 100
        return progress <= 100 ? progress :  100 // if modulatePerLeadChanges is dropped during the cycle, stepsSoFar may exceed stepsNeeded
      },
      nextModulation(){
        let modeInfo = this.scene.nextModulation
        //console.log('modeInfo', modeInfo)
        if (modeInfo === '') return ''
        let mod = ''
        switch (modeInfo.modulation) {
          case 'dia': mod = 'diatonic'; break;
          case 'mel': mod = 'melodic min'; break;
          case 'har': mod = 'harmonic min'; break;
          case 'dim': mod = 'diminished'; break;
          case 'aug': mod = 'augmented'; break;
          case 'chr': mod = 'chromatic'; break;
          case 'maj': mod = 'major triad'; break;
          case 'min': mod = 'minor triad'; break;
          case 'sus': mod = 'suspended triad'; break;
          case 'ma7': mod = 'major 7'; break;
          case 'dom': mod = 'dominant 7'; break;
          case 'mi7': mod = 'minor 7'; break;
          case 'hdm': mod = 'half-diminshed'; break;
          case 'dm7': mod = 'diminished 7'; break;
          case 'blu': mod = 'blues'; break;
          case 'pen': mod = 'pentatonic'; break;
          case 'fth': mod = 'fifth'; break;
          case 'one': mod = '(one note)'; break;
        }
        let modulation = modeInfo.modeBase + ' ' + mod
        if (modulation.charAt(1) === 's') { modulation = spliceSlice(modulation, 1, 1, '#') }
        return modulation
      },
      harmonicFormString(){
        let form = this.scene.harmonicForm
        return form.join(', ')
        //return "working on it..."
      },
      harmonicFormArray(){
        return this.scene.harmonicForm
      },
      modulatePerLeadChanges: {
        get(){
          return this.scene.modulatePerLeadChanges
        },
        set(value){
          this.$store.commit('updateModulatePerLeadChanges', value)
        },
      },
      selectedRootPitches(){
        return this.scene.selectedRootPitches
      },
      modulationWeights() {
       return this.scene.modulationWeights
      },
      filterPitchesOnChange(){
        return this.scene.filterPitchesOnChange
      },
    },

    methods: {
      toggleEditingForm(){
        this.$store.commit('toggleEditingForm')
        if (this.scene.editingForm) {
          // https://forum.vuejs.org/t/how-to-set-focus-to-input/10672/7 // using just 'formInput', I think this is ok because only one scene is rendered at a time.
          this.$nextTick(() => this.$refs.formInput.focus())
        }
      },
      handleHarmonicFormEntry(e){
        this.$store.dispatch('buildHarmonicForm', e.target.value)
        this.enterFunction(e)  // this will blur the input, which may redundantly call this function again. so for now we need this if:
        if (this.scene.editingForm) { this.toggleEditingForm() }
      },
      morphSelectedNotes(){
        this.$store.dispatch('morphSelectedNotes', true)
      },
      toggleModulationStyle(){
        this.$store.dispatch('toggleModulationStyle')
      },
      autoModulate(onOrOff){
        this.$store.dispatch('autoModulate', onOrOff)
      },
      toggleSuspendChanges(){
        this.$store.commit('toggleSuspendChanges')
      },
      updateSelectedRootPitches(rootPitch){
        this.$store.commit('updateSelectedRootPitches', rootPitch)
      },
      soloSelectedRootPitch(rootPitch, e){
        e.preventDefault()
        this.$store.commit('updateSelectedRootPitches', 'clear')
        this.$store.commit('updateSelectedRootPitches', rootPitch)
      },
      updateModulationWeights(modulationType, e){
        this.$store.commit('updateModulationWeights', { modulationType: modulationType, value: e.target.value } )
      },
      incrementModulationWeights(){
        let modulationTypes = ['dia', 'mel', 'har', 'dim', 'aug', 'chr', 'maj', 'min', 'sus', 'ma7', 'dom', 'mi7', 'hdm', 'dm7', 'blu', 'pen', 'fth', 'one']
        modulationTypes.forEach( (type, index) => {
          this.$store.commit('updateModulationWeights', { modulationType: type, value: 'increment' } )
        })
      },
      changeToModeType(modulationType){
        let modeInfo = pickMode(MODEDATA, modulationType, this.scene.lastMode, this.selectedRootPitches)
        if (this.scene.autoModulate){
          this.$store.commit('updateNextModulation', modeInfo) // an alternate style to employ this...
        } else {
          this.$store.commit('updateSelectedMode', modeInfo)
        }
      },
      soloModulationWeight(modulationType, e){
        // https://stackoverflow.com/questions/41303982/vue-js-how-to-handle-click-and-dblclick-events-on-same-element
        e.preventDefault()
        let modulationTypes = ['dia', 'mel', 'har', 'dim', 'aug', 'chr', 'maj', 'min', 'sus', 'ma7', 'dom', 'mi7', 'hdm', 'dm7', 'blu', 'pen', 'fth', 'one']
        modulationTypes.forEach( (type, index) => {
          this.$store.commit('updateModulationWeights', { modulationType: type, value: 0 } )
        })
        this.$store.commit('updateModulationWeights', { modulationType: modulationType, value: 1 } )
      },
      toggleFilterOnChange(){
        this.$store.commit('toggleFilterOnChange')
      },
      focusFunction(){
        console.log("focussing")
        this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
        this.$store.commit('changeActiveRegion', 'scene-dashboard')
      },
      enterFunction(event){
        event.target.blur()
        this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
      },
    },

}

</script>


<style>


.scene-dashboard {
  background: #667;
/*  margin: 0 0 10px 0;*/
  width: 99%;
  margin: 0;   /* vs 0 auto... bumps it in a bit... */
  position: relative;
}
.scene-dashboard:after {
    content: "";
    display: table;
    clear: both;
}

.scene-dashboard button {
  width: 100px;
  cursor: pointer;
}

.scene-dashboard input {
  width: 35px;
}

.harmonic-form-regex {
  margin: 3px;
  padding: 2px;
  min-width: 600px;
  background: white;
  font-family: helvetica;
  font-size: 14px;
  color: #333;
}

.harmonic-form-display {
  margin: 3px;
  padding: 5px;
  min-width: 600px;
  background: white;
  font-family: helvetica;
  font-size: 14px;
  color: grey;
}

.harmonic-form-step {
  color: black;
}

.currentFormStep {
  background: #bcd;
  font-weight: bold;
  color: black;
  text-decoration: underline;
}

.modulation-options {
  float: left;
  padding: 5px;
  background: #877;
}

.modulate-per-lead-changes {
  font-size: 12px;
  display: inline-block;
}


.increment-weights {
  display: inline-block;
}

.mode-options {
  float: left;
  padding: 5px;
  text-align: center;
  background: #787;
}

.root-pitch-selector {
  display: inline-block;
}

.root-pitch-option {
  display: inline-block;
  width: 24px;
  background: black;
  color: grey;
  border: 2px solid transparent;
}

.rootPitchOptionSelected {
  background: #afa;
  color: black;
  border: 2px solid green;
}

.all-root-pitches {

}

.mode-options-box {
  float: left;
}
.mode-option {
  float: none;
  background: #3fb;
  margin: 3px;
  padding-right: 1px;
}
.mode-option span {
  padding-right: 2px;
}
.mode-option input {
  float: right;
}
.mode-option:after {
    content: "";
    display: table;
    clear: both;
}

.random-entry {
  float: left;
  background: #778;
}

.mode-advance-meter {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
  /*  margin: 0 auto 20px auto; */
}
.mode-advance-meter div{
  height: 14px;
  background: blue;
}
.mode-advance-title {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
}
.mode-advance-title div {
  font-size: 14px;
  overflow: hidden;
  mix-height: 10px;
  /*vertical-align: bottom;*/
}


</style>
