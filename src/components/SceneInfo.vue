<template>

  <div class="scene-info">

    <input
      class="scene-title"
      v-model.lazy="sceneTitle"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    >

    <span>BPM</span>
    <input id="BPMInput" type="number" min="1"
      :value="getBPM"
      @change="changeTempo"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    >
    <!--      @keyup.enter="$event.target.blur()" -->

    <span>Lead#</span>
    <!-- how does focus & enter work on select? it does work in the DOM https://jsfiddle.net/0eh6z947/ -->
    <!-- https://stackoverflow.com/questions/50434769/receive-event-object-in-vuex-v-model-setter?noredirect=1#comment87903913_50434769 -->
    <!-- note that v-model set is only called when the value changes. @keyup.enter="enterFunction($event)" doesn't work, is it possible to get enter to work on this some other way? For the moment looks like you'd need to use the global keyup listener (blur selects, possibly testing for active element as region)  -->
    <select id="leadSelect"
      v-model:value="leadTrackNumberAdjust"
      @focus="focusFunction"
      @change="enterFunction($event)"
      @blur="enterFunction($event)"
      >
      <option
        v-for="(track, index) in scene.tracks "
        :key="Math.random().toString().slice(2)"
      >{{ index+1 }}</option>
    </select>

    <div class="button-esq" v-on:click="resetScene" >Reset Scene</div>

    <br>

    <span>Load Qwerty:</span>

    <select id="qwertySettingOnSceneChange"
      v-model:value="qwertySettingOnSceneChange"
      @focus="focusFunction"
      @change="enterFunction($event)"
      @blur="enterFunction($event)"
    >
      <option v-for="setting in qwertySettings">{{ setting }}</option>
    </select>

    <span>Change scene on:</span>
    <select id="sceneChangeIncrement"
      v-model:value="sceneChangeIncrement"
      @focus="focusFunction"
      @change="enterFunction($event)"
      @blur="enterFunction($event)"
    >
      <option v-for="increment in changeIncrements">{{ increment }}</option>
    </select>

    <br>

    <span>Chain Reps</span>
    <input type="number" min="0"
      v-model:value="chainAdvancePer"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
      @blur="enterFunction($event)"
    >
    <div class="scene-advance-meter">
      <div v-if="scene.started && (this.$store.state.sceneAdvanceTriggered || this.$store.state.sceneAdvanceCued || this.$store.state.chain)"
        v-bind:style="{ width: sceneAdvanceProgress + '%' }">
        <span v-if="scene.sceneChangeIncrement==='Form' && scene.formStep===-1" class="loading-harmonic-form-message" >loading...</span>
      </div>
    </div>
    <span>=></span>
    <div class="scene-advance-title">
      <div v-if="this.$store.state.sceneAdvanceTriggered || this.$store.state.sceneAdvanceCued || this.$store.state.chain" >{{ advanceSceneTitle }}</div>
    </div>

    <br>

    <div class="track-options">

        <div class="button-esq" @click="rememberAllTunes" >Remember Tracks</div>
        <div class="button-esq"
             @click="returnAllTunes"
             v-bind:class="{ greyOut: !tunesRemembered }"
        >Return Tracks</div>

        <span>on Scene Change:</span>

        <div class="track-options">
            <input class="reset-option" type="checkbox" v-model="resetRememberedOnSceneChange">
        </div>

    </div>

    <br>

    <div class="button-esq random-fill" v-on:click='fill' >Fill Track</div>
    <input  type="number" min="1"
            v-bind:value="length"
            v-on:change="updateSelectedLength"
            @focus="focusFunction"
            @keyup.enter="enterFunction"
            @blur="enterFunction($event)"
    >
    <div class="button-esq random-distribute" v-on:click='distribute' >Distribute</div>

    <div class="button-esq add-track" v-on:click='addTrack' >Add New Track</div>


  </div>

</template>


<script>

  /*https://forum.vuejs.org/t/how-to-listen-for-an-enter-on-an-element-ui-form/11631 */
  import {bus} from '../main.js'


export default {

  data:() => ({
    changeIncrements: ['Lead Cycle', 'Lead Change', 'Modulation', 'Form'],
    stepsTowardSceneChange: 0,
  }),

  computed: {
    scene(){
      return this.$store.state.scenes[this.$store.state.editingSceneNumber]
    },
    toneTunes(){
      return this.$store.getters.toneTunes
    },
    sceneTitle: {
      get(){
        return this.scene.title
      },
      set(title){
        this.$store.dispatch('updateSceneTitle', title)
      },
    },
    leadTrackNumberAdjust: {
      get(){
        let leadTrackNumber = ''
        this.scene.tracks.forEach( (track, index) => {
          if (track.id === this.scene.leadTrackId) { leadTrackNumber = index }
        })
        return leadTrackNumber+1
      },
      set(value){
        this.$store.commit('updateLeadTrack', value-1 )
      },
    },
    leadTrackNumber(){
      let leadTrackNumber = ''
      this.scene.tracks.forEach( (track, index) => {
        if (track.id === this.scene.leadTrackId) { leadTrackNumber = index }
      })
      return leadTrackNumber
    },
    leadTrackStep(){
      return this.scene.tracks[this.leadTrackNumber].toneTuneIndex
    },
    getBPM(){
      return this.scene.bpm
    },
    sceneChangeIncrement: {
      get(){
        return this.scene.sceneChangeIncrement
      },
      set(increment){
        this.$store.commit('setSceneChangeIncrementType', increment)
      },
    },
    chainAdvancePer: {
      get(){
        return this.scene.chainAdvancePer
      },
      set(value){
        console.log(value)
        this.$store.commit('updateChainAdvancePer', value)
      },
    },
    sceneAdvanceProgress(){

      let leadTrack = this.scene.tracks[this.leadTrackNumber]
      let leadTrackTune = this.toneTunes[this.leadTrackNumber]

      switch (this.scene.sceneChangeIncrement){
          case 'Lead Cycle':
              if (this.$store.state.chain) {
                let stepsNeeded = leadTrackTune.length * this.scene.chainAdvancePer
                let wellThoughtOutVariableName = leadTrackTune.length * this.scene.chainIncrement + leadTrack.toneTuneIndex
                let stepsSoFar = (wellThoughtOutVariableName === 0) ? stepsNeeded : wellThoughtOutVariableName
                let stepPercent = stepsSoFar/stepsNeeded * 100 // isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
                return stepPercent
              } else {
                let stepsNeeded = leadTrackTune.length
                let stepsSoFar = (leadTrack.toneTuneIndex === 0) ? stepsNeeded : leadTrack.toneTuneIndex
                let stepPercent = stepsSoFar/stepsNeeded * 100 // isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
                return stepPercent
              }
              break

          case 'Lead Change':
              if (this.$store.state.chain) {
                let stepsNeeded = leadTrackTune.length * leadTrack.changePer * this.scene.chainAdvancePer
                let veryWellThoughtOutVariableName = (leadTrackTune.length * leadTrack.changePer * this.scene.chainIncrement)
                                                  + (leadTrackTune.length * leadTrack.changeCycles)
                                                  + leadTrack.toneTuneIndex
                let stepsSoFar = (veryWellThoughtOutVariableName === 0) ? stepsNeeded : veryWellThoughtOutVariableName
                let stepPercent = stepsSoFar/stepsNeeded * 100 // isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
                return stepPercent
              } else {
                let stepsNeeded = leadTrackTune.length * leadTrack.changePer
                let veryWellThoughtOutVariableName2 = leadTrackTune.length * leadTrack.changeCycles + leadTrack.toneTuneIndex
                let stepsSoFar = (veryWellThoughtOutVariableName2 === 0) ? stepsNeeded : veryWellThoughtOutVariableName2
                let stepPercent = stepsSoFar/stepsNeeded * 100 // isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
                return stepPercent
              }
              break

          case 'Modulation':
              if (this.$store.state.chain){
                  if (leadTrackTune.length === 0) { return 0 }
                  let stepsNeeded = leadTrackTune.length * leadTrack.changePer * this.scene.modulatePerLeadChanges  * this.scene.chainAdvancePer
                  let chainSteps = this.scene.chainIncrement * this.scene.modulatePerLeadChanges * leadTrack.changePer * leadTrackTune.length
                  let modCycleSteps = this.scene.modulationCycles * leadTrack.changePer * leadTrackTune.length
                  let currentChangeCycleSteps = leadTrack.changeCycles * leadTrackTune.length
                  let stepsByCycleCount = chainSteps + modCycleSteps + currentChangeCycleSteps + leadTrack.toneTuneIndex

                  let modProgBarDisplayCount = (this.scene.chainIncrement === 0 &&
                                                this.scene.modulationCycles === 0 && leadTrack.changeCycles === 0 &&
                                                leadTrack.toneTuneIndex === 0 && this.scene.started)
                                                ? stepsNeeded : stepsByCycleCount
                  let progress = modProgBarDisplayCount / stepsNeeded * 100
                  return progress <= 100 ? progress :  100 // if modulatePerLeadChanges is dropped during the cycle, stepsSoFar may exceed stepsNeeded
              } else {
                  if (leadTrackTune.length === 0) { return 0 }
                  let stepsNeeded = leadTrackTune.length * leadTrack.changePer * this.scene.modulatePerLeadChanges
                  let currentChangeCycleSteps = leadTrack.changeCycles * leadTrackTune.length
                  let modCycleSteps = this.scene.modulationCycles * leadTrack.changePer * leadTrackTune.length
                  let stepsByCycleCount = modCycleSteps + currentChangeCycleSteps + leadTrack.toneTuneIndex
                  let modProgBarDisplayCount = (this.scene.modulationCycles === 0 && leadTrack.changeCycles === 0 &&
                                                leadTrack.toneTuneIndex === 0 && this.scene.started)
                                                ? stepsNeeded : stepsByCycleCount
                  let progress = modProgBarDisplayCount / stepsNeeded * 100
                  return progress <= 100 ? progress :  100 // if modulatePerLeadChanges is dropped during the cycle, stepsSoFar may exceed stepsNeeded
              }
              break

          case 'Form':
              let stepsNeeded = 0
              if (this.$store.state.chain){
                  stepsNeeded = leadTrack.changePer * leadTrackTune.length * this.scene.modulatePerLeadChanges * this.scene.harmonicForm.length * this.scene.chainAdvancePer
              } else {
                  stepsNeeded = leadTrack.changePer * leadTrackTune.length * this.scene.modulatePerLeadChanges * this.scene.harmonicForm.length
              }
              if (this.scene.formStep === -1){
                  return 0
              }
              if (this.stepsTowardSceneChange >= stepsNeeded) {
                  this.stepsTowardSceneChange = 0
                  return 100
              } else {
                  return (this.stepsTowardSceneChange/stepsNeeded) * 100
              }
              break
      }
    },
    advanceSceneTitle(){
      return this.$store.getters.advanceSceneTitle
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
    resetRememberedOnSceneChange: {
      get(){
        return this.scene.resetRememberedOnSceneChange
      },
      set(){
        this.$store.commit('toggleResetRememberedOnSceneChange')
      },
    },
    qwertySettings(){
      let qwertySettings = ['none', 'default']
      this.$store.state.playerParamSettings.forEach( (setting, index) => {
        if (setting.assigned && index!= 0){ qwertySettings.push(index) } // index.toString() not needed, it automatically makes it a string
      })
      return qwertySettings
    },
    qwertySettingOnSceneChange: {
      get(){
        let loadQwerty = this.scene.loadQwertySettingOnSceneChange
        if (loadQwerty == 0) { return 'default' }
        return loadQwerty  // works because JS is loosely typed! livin' dangerous...
      },
      set(value){
        console.log(typeof value, value)
        switch (value){
          case 'none':
            this.$store.commit('updateLoadQwertySettingOnSceneChange', value)
            break
          case 'default':
            this.$store.commit('updateLoadQwertySettingOnSceneChange', 0)
            break
          default:  // otherwise it's a string with a number value
            this.$store.commit('updateLoadQwertySettingOnSceneChange', value) //parseInt(value, 10))
        }
      },
    },

  },

  watch: {   // watchers expensive? https://www.reddit.com/r/vuejs/comments/9w57sz/performance_cost_of_emit/
    leadTrackStep: function (val) {
      if ( ! (this.scene.sceneChangeIncrement === "Form" && this.scene.formStep===-1 ) &&
           this.scene.suspendChanges === false )  {
        this.stepsTowardSceneChange++
      }
      if (this.scene.started === false) {
        this.stepsTowardSceneChange = 0
      }
    },

  },

  methods: {
    resetScene(){
      this.$store.commit('resetScene')
    },
    changeTempo(e){
      console.log("changing tempo")
      if (e.target.value > 0){ this.$store.commit('changeTempo', e) }
    },
    focusFunction(){
      console.log("focussing")
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', '')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
      bus.$emit('clearKeyFromDown', 'Enter')
    },
    fill(){
      this.$store.dispatch('fill')
    },
    distribute(){
      this.$store.dispatch('distribute')
    },
    updateSelectedLength(e){
      this.$store.commit('updateSelectedLength', e.target.value)
    },
    rememberAllTunes(){
      this.$store.dispatch('rememberAllTunes')
    },
    returnAllTunes(){
      this.$store.dispatch('returnAllTunes')
    },
    addTrack(){
      this.$store.dispatch('addTrack')
    },

  },

  created: function () {
  },

}

/*
case 'Form':
    if (this.$store.state.chain){
        let stepsNeeded = leadTrack.changePer * leadTrackTune.length * this.scene.modulatePerLeadChanges * this.scene.harmonicForm.length *this.scene.chainAdvancePer
        let excessivelyWellThoughtOutVariableName = (leadTrackTune.length * leadTrack.changePer * this.scene.modulationCycles)
                                          + (leadTrackTune.length * leadTrack.changePer * this.scene.chainIncrement)
                                          + (leadTrackTune.length * leadTrack.changeCycles)
                                          + leadTrack.toneTuneIndex
    } else {
        let stepsNeeded = leadTrack.changePer * leadTrackTune.length * this.scene.modulatePerLeadChanges * this.scene.harmonicForm.length
        console.log('form', leadTrackTune.length * leadTrack.changePer * this.scene.modulatePerLeadChanges * this.scene.formStep)
        console.log('mod', leadTrackTune.length * leadTrack.changePer * this.scene.modulationCycles)
        console.log('change', leadTrackTune.length * leadTrack.changeCycles)
        console.log('step', leadTrack.toneTuneIndex)
        console.log('*')
        let variableName = (leadTrackTune.length * leadTrack.changePer * this.scene.modulatePerLeadChanges * this.scene.formStep)
                            + (leadTrackTune.length * leadTrack.changePer * this.scene.modulationCycles)
                            + (leadTrackTune.length * leadTrack.changeCycles)
                            + leadTrack.toneTuneIndex
        if (variableName < 0) { return 0 }
        let stepsSoFar = (variableName === 0) ? stepsNeeded : variableName
        let stepPercent = stepsSoFar/stepsNeeded * 100 // isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
        return stepPercent
    }

    break
*/

</script>


<style>

.scene-info {
  background: #b77;
  margin: 0 0 10px 0;
  float: left;
}

.scene-info input {
  width: 60px;
  margin: 3px;
}

.scene-info span {
  margin: 0px 0 0 3px;
}

/* whaaa why isn't this overriding? */
.scene-title {
  width: 100px;
}

.scene-advance-meter {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
  /*  margin: 0 auto 20px auto; */
}
.scene-advance-meter div{
  height: 14px;
  background: blue;
}
.loading-harmonic-form-message {
  font-size: 12px;
}
.scene-advance-title {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
}
.scene-advance-title div {
  font-size: 14px;
  overflow: hidden;
}

.track-options {
  display: inline-block;
}
.track-options input {
  width: 35px;
}

.random-fill {
}
.random-distribute {
}

.reset-option {
/* sort of a pain in the ass to try and style a checkbox... */
}

/*
.image-button {
  display: inline-block;
  background: #aaf;
  border-radius: 100%;
  text-align: center;
}
img {
  <div class="image-button"><img src="../assets/headphones1.png" /></div>
  width: 50%;
}
*/
</style>
