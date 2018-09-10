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

          <div class="button-esq" v-if="this.scene.modulationStyle==='drift'" @click="morphSelectedNotes">Modulate</div>
          <div class="button-esq" v-else @click="morphSelectedNotes">Advance</div>

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

          <br>

          <div class="button-esq" v-if="this.scene.suspendChanges" @click="toggleSuspendChanges">Changes Suspended</div>
          <div class="button-esq" v-else @click="toggleSuspendChanges">Changes Active</div>

          <div class="button-esq" v-if="filterPitchesOnChange" v-on:click="toggleFilterOnChange">Filter On&nbsp</div>
          <div class="button-esq" v-else v-on:click="toggleFilterOnChange">Filter Off</div>

      </div>

      <div class="mode-options">

          <div>Modulation Weights</div>
          <!-- <div>C C# D D# E F F# G G# A A# B</div> -->
          <div class="mode-options-box">
              <div class="mode-option"><span>Dia</span>
                <input type="number" min="0" :value="modulationWeights['dia']" @input="updateModulationWeights('dia', $event)" @focus="focusFunction" />
              </div>
              <div class="mode-option"><span>Mel</span>
                <input type="number" min="0" :value="modulationWeights['mel']" @input="updateModulationWeights('mel', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Har</span>
                <input type="number" min="0" :value="modulationWeights['har']" @input="updateModulationWeights('har', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span>Dim</span>
                <input type="number" min="0" :value="modulationWeights['dim']" @input="updateModulationWeights('dim', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Aug</span>
                <input type="number" min="0" :value="modulationWeights['aug']" @input="updateModulationWeights('aug', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Chr</span>
                <input type="number" min="0" :value="modulationWeights['chr']" @input="updateModulationWeights('chr', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span>Maj</span>
                <input type="number" min="0" :value="modulationWeights['maj']" @input="updateModulationWeights('maj', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Min</span>
                <input type="number" min="0" :value="modulationWeights['min']" @input="updateModulationWeights('min', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Sus</span>
                <input type="number" min="0" :value="modulationWeights['sus']" @input="updateModulationWeights('sus', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span>Ma7</span>
                <input type="number" min="0" :value="modulationWeights['ma7']" @input="updateModulationWeights('ma7', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Dom</span>
                <input type="number" min="0" :value="modulationWeights['dom']" @input="updateModulationWeights('dom', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Mi7</span>
                <input type="number" min="0" :value="modulationWeights['mi7']" @input="updateModulationWeights('mi7', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span>Hdm</span>
                <input type="number" min="0" :value="modulationWeights['hdm']" @input="updateModulationWeights('hdm', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Dm7</span>
                <input type="number" min="0" :value="modulationWeights['dm7']" @input="updateModulationWeights('dm7', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Blu</span>
                <input type="number" min="0" :value="modulationWeights['blu']" @input="updateModulationWeights('blu', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option"><span>Pen</span>
                <input type="number" min="0" :value="modulationWeights['pen']" @input="updateModulationWeights('pen', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>Fth</span>
                <input type="number" min="0" :value="modulationWeights['fth']" @input="updateModulationWeights('fth', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option"><span>One</span>
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

export default {
    components: {
      'scene-info': SceneInfo,
      'piano-selector': PianoSelector,
    },
    data(){
      return {}
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
        if (modeInfo === '') return ''
        let mod = ''
        console.log('modeInfo.modulation', modeInfo.modulation)
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
        console.log(this.scene.harmonicForm)
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
      updateModulationWeights(modulationType, e){
        this.$store.commit('updateModulationWeights', { modulationType: modulationType, value: e.target.value } )
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

.mode-options {
  float: left;
  padding: 5px;
  text-align: center;
  background: #787;
}
.mode-options-box {
  float: left
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
