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
          <!-- :class="{ greyOut: !this.scene.autoModulate }" -->
          <div class="button-esq"
          v-else @click="toggleModulationStyle"
          >Form</div>
          <!-- :class="{ greyOut: !this.scene.autoModulate }" -->

          <div class="button-esq" v-if="this.scene.autoModulate" @click="autoModulate('off')">Auto On&nbsp</div>
          <div class="button-esq" v-else @click="autoModulate('on')">Auto Off</div>

          <div class="button-esq" v-if="this.scene.modulationStyle==='drift'" @click="morphSelectedNotes">Modulate</div>
          <div class="button-esq" v-else @click="morphSelectedNotes">Advance</div>


          <br>
          <div class="modulate-per-lead-changes">
            <span>Modulate per # Lead Changes:</span>
            <input type="number" min="1"
                   v-model="modulatePerLeadChanges"
                   @focus="focusFunction"
                   @keyup.enter="enterFunction"
            />
          </div>
          <!--
          <div class="updates-pending">
              <div>No changes queued</div>
          </div>
          <br>
          -->

      </div>

      <div class="mode-options">

          <div>Modulation Weights</div>
          <!-- ? note-limit (1-9) -->
          <div class="mode-options-box">
              <div class="mode-option">Diatonic
                  <input type="number" min="0" :value="modulationWeights['dia']" @input="updateModulationWeights('dia', $event)" @focus="focusFunction" />
              </div>
              <div class="mode-option">Melodic Min
                <input type="number" min="0" :value="modulationWeights['mel']" @input="updateModulationWeights('mel', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option">Harmonic Min
                <input type="number" min="0" :value="modulationWeights['har']" @input="updateModulationWeights('har', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
          <div class="mode-options-box">
              <div class="mode-option">Diminshed
                <input type="number" min="0" :value="modulationWeights['dim']" @input="updateModulationWeights('dim', $event)" @focus="focusFunction"  @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option">Augmented
                <input type="number" min="0" :value="modulationWeights['aug']" @input="updateModulationWeights('aug', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
              <div class="mode-option">Chromatic
                <input type="number" min="0" :value="modulationWeights['chr']" @input="updateModulationWeights('chr', $event)" @focus="focusFunction" @keyup.enter="enterFunction" />
              </div>
          </div>
      </div>

      <div class="modulation-options-2">
          <div class="mod-op-2-button button-esq" v-if="filterPitchesOnChange" v-on:click="toggleFilterOnChange">Filter On&nbsp</div>
              <div class="mod-op-2-button button-esq" v-else v-on:click="toggleFilterOnChange">Filter Off</div>
          <div class="mod-op-2-button button-esq" @click="rememberAllTunes" >Remember</div>
          <div class="mod-op-2-button button-esq"
               @click="returnAllTunes"
               v-bind:class="{ greyOut: !tunesRemembered }"
          >Return</div>
      </div>

      <div class="fill-and-distribute">
        <div class="button-esq random-fill" v-on:click='fill' >Fill</div>
        <br>
        <div class="button-esq random-distribute" v-on:click='distribute' >Distribute</div>
        <br>
        <span>Fill Length:</span>
        <input  type="number" min="1"
                v-bind:value="length"
                v-on:change="updateSelectedLength"
                @focus="focusFunction"
                @keyup.enter="enterFunction"
        ></input>
        <br>

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
      length(){
        /* // tracking length of lead track tune:
        let leadTrackTuneLength = this.$store.getters.toneTunes[this.$store.getters.leadTrackNumber].length
        console.log(leadTrackTuneLength)
        let length = ''
        if (leadTrackTuneLength === 0) { length = this.scene.selectedLength }
        else length = leadTrackTuneLength
        return length */
        let length = this.scene.selectedLength
        if (length === 0) { return 8 }
        else { return length }
      },
      tunesRemembered(){
        let remembered = false
        for (let i=0; i < this.scene.tracks.length; i++) {
          if (this.scene.tracks[i].rememberedTune.length > 0) { remembered = true }
        }
        return remembered
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
      morphSelectedNotes(){
        this.$store.dispatch('morphSelectedNotes', true)
      },
      toggleModulationStyle(){
        this.$store.dispatch('toggleModulationStyle')
      },
      autoModulate(onOrOff){
        this.$store.dispatch('autoModulate', onOrOff)
      },
      handleHarmonicFormEntry(e){
          this.$store.dispatch('buildHarmonicForm', e.target.value)
          this.enterFunction(e)  // this will blur the input, which may redundantly call this function again. so for now we need this if:
          if (this.scene.editingForm) { this.toggleEditingForm() }
      },
      updateModulationWeights(modulationType, e){
        this.$store.commit('updateModulationWeights', { modulationType: modulationType, value: e.target.value } )
      },
      updateSelectedLength(e){
        this.$store.commit('updateSelectedLength', e.target.value)
      },
      updateSelectedPitchPercent(e){
        this.$store.commit('updateSelectedPitchPercent', e.target.value)
      },
      rememberAllTunes(){
        this.$store.dispatch('rememberAllTunes')
      },
      returnAllTunes(){
        this.$store.dispatch('returnAllTunes')
      },
      fill(){
        this.$store.dispatch('fill')
      },
      distribute(){
        this.$store.dispatch('distribute')
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

.updates-pending div {
  /*min-width: 100px;*/
  background: #ddd;
  padding: 1px;
  margin: 3px;
}

.modulation-options {
  float: left;
  padding: 5px;
  background: #877;
}

.modulation-options-2 {
  float: left;
  padding: 5px;
  background: #877;
  text-align: center;
}
.modulation-options-2 div {
  display: block;
  margin: 3px;
}

.modulate-per-lead-changes {
  margin: 5px 0;
  padding: 5px;
  background: #888;
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
  padding: 0 1px;
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


.fill-and-distribute {
  float:left;
  padding: 5px;
}
.random-fill {
  margin-bottom: 3px;
}
.random-distribute {
  margin-bottom: 3px;
}


</style>
