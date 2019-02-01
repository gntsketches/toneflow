<template>
  <div id="app" class="app" >

      <global-controls></global-controls>

      <div class="app-main">
          <play-n-tabs></play-n-tabs>
          <scene-dashboard></scene-dashboard>
          <!--  Ed# {{ editingTrackNumber }} | EdId: {{ editingTrackId }}  -->
          <tracks></tracks>
          <player-UI :down="down" :playerInstrument="playerInstrument"></player-UI>
      </div>

      <info></info>

  </div>
</template>

<script>


//import Tone from 'tone'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import {AudioManager as AM} from "./AudioManager"
import {generalKeyDispatchTable as generalKeyDispatchTable} from "./dispatchTables"
import {tuneEntryDispatchTable as tuneEntryDispatchTable} from "./dispatchTables"
import {keypress as keypress} from "./dispatchTables"
import {bus} from './main.js'
import GlobalControls from './components/GlobalControls.vue'
import PlayNTabs from './components/PlayNTabs'
import SceneDashboard from './components/SceneDashboard.vue'
import Tracks from './components/Tracks.vue'
import PlayerUI from './components/PlayerUI.vue'
import Info from './components/Info.vue'
import draggable from 'vuedraggable'


export default {
    name: 'app',
    components: {
      'global-controls': GlobalControls,
      'play-n-tabs': PlayNTabs,
      'scene-dashboard': SceneDashboard,
      'tracks': Tracks,
      'player-UI': PlayerUI,
      'info': Info,
      'draggable': draggable,
    },

    data() {
      return {
        down: [],
        monoSynthKey: '',
        scheduleId: '',
        playerInstrument: '',
        playerGain: new Tone.Gain(),
        playerDelay: new Tone.FeedbackDelay(0, 0),
        playerDistortion: new Tone.Distortion(),
        playerAutoFilter: new Tone.AutoFilter("4n")
      }
    },


    computed: {

      // PLAYING
      playing(){
        return this.$store.state.playing
      },
      scene(){
        return this.$store.state.scenes[this.$store.state.editingSceneNumber]
      },
      bpm(){
        return this.scene.bpm
      },
      tracks(){
        return this.scene.tracks
      },
      leadTrack(){
        let leadTrack = {}
        this.scene.tracks.forEach( (track, index) => {
          if (track.id === this.scene.leadTrackId) { leadTrack = track }
        })
        return leadTrack
      },
      leadTrackNumber(){
        return this.$store.getters.leadTrackNumber
      },
      toneTunes(){
        return this.$store.getters.toneTunes
      },

      // Player Params Basics
      storePlayerInstrumentType(){
        return this.$store.state.playerParams.instrumentType
      },
      storePlayerSampleType(){
        return this.$store.state.playerParams.sampleType
      },
      storePlayerWaveType(){
        return this.$store.state.playerParams.waveType
      },
      storePlayerGain(){
        return this.$store.state.playerParams.gain
      },
      storePlayerAttack(){
        return this.$store.state.playerParams.attack
      },
      storePlayerDecay(){
        return this.$store.state.playerParams.decay
      },
      storePlayerSustain(){
        return this.$store.state.playerParams.sustain
      },
      storePlayerRelease(){
        return this.$store.state.playerParams.release
      },
      storePlayerPortamento(){
        return this.$store.state.playerParams.portamento
      },
      storePlayerHarmonicity(){
        return this.$store.state.playerParams.harmonicity
      },
      storePlayerModulationType(){
        return this.$store.state.playerParams.modulationType
      },
      storePlayerModulationIndex(){
        return this.$store.state.playerParams.modulationIndex
      },
      storePlayerCount(){
        //console.log('count',this.$store.state.playerParams.count)
        return this.$store.state.playerParams.count
      },
      storePlayerSpread(){
        return this.$store.state.playerParams.spread
      },
      storePlayerModulationFrequency(){
        return this.$store.state.playerParams.modulationFrequency
      },
      // Player Params Effects
      storePlayerDelayTime(){
        return this.$store.state.playerParams.delayTime
      },
      storePlayerDelayFeedback(){
        return this.$store.state.playerParams.delayFeedback
      },
      storePlayerDistortion(){
        return this.$store.state.playerParams.distortion
      },
      storePlayerFilterWet(){
        return this.$store.state.playerParams.filterWet
      },
      storePlayerBaseFrequency(){
        return this.$store.state.playerParams.filterBaseFrequency
      },
      storePlayerFilterType(){
        return this.$store.state.playerParams.filterType
      },
      storePlayerFilterRolloff() {
        return this.$store.state.playerParams.filterRolloff
      },
      storePlayerFilterQ(){
        return this.$store.state.playerParams.filterQ
      },
      storePlayerLFOWaveType(){
        return this.$store.state.playerParams.LFOWaveType
      },
      storePlayerLFOFrequency(){
        return this.$store.state.playerParams.LFOFrequency
      },
      storePlayerLFODepth(){
        return this.$store.state.playerParams.LFODepth
      },
      storePlayerLFOOctaves(){
        return this.$store.state.playerParams.LFOOctaves
      },

      // EDITING
      activeRegion(){ // maybe this should be specific to scene?
        return this.$store.state.activeRegion
      },
      editingTrackNumber(){
        return this.scene.editingTrackNumber
      },
      editingTune(){
        return this.scene.tracks[this.editingTrackNumber].tune
      },
      editingTrackId(){ // currently this is only used to display info for debugging
        return this.scene.editingTrackId
      },
      editingIndex(){
        return this.scene.editingIndex
      },
      pitchSets(){
        return this.$store.getters.pitchSets
      },

    },


    watch: {
      playing: function(playing){
        if(playing) { this.play() }
        else { this.stop() }
      },
      // Player Params Basics
      storePlayerInstrumentType: function(storePlayerInstrumentType){
        this.updatePlayerStuff()
      },
      storePlayerSampleType: function(storePlayerSampleType){
        this.updatePlayerStuff()
      },
      storePlayerWaveType: function(storePlayerWaveType){
        this.playerInstrument.set({ "oscillator": { "type": storePlayerWaveType } })
      },
      storePlayerGain: function(storePlayerGain){ // doesn't work with arrow function! need to think about that.
        this.playerGain.gain.value = storePlayerGain
      },
      storePlayerAttack: function(storePlayerAttack){
        console.log('check attack', this.playerInstrument)
        if (this.storePlayerInstrumentType === 'polySynth' || this.storePlayerInstrumentType === 'monoSynth'){
          this.playerInstrument.set({ 'envelope': { attack: storePlayerAttack } })
        } else if (this.$store.state.playerParams.instrumentType === 'sampler'){
          this.playerInstrument.set({ 'attack': storePlayerAttack })
          console.log('check attack2', this.playerInstrument)
        }
      },
      storePlayerDecay: function(storePlayerDecay){
        if (this.storePlayerInstrumentType === 'polySynth'){
          this.playerInstrument.set({ 'envelope': { decay: storePlayerDecay } })
        }
      },
      storePlayerSustain: function(storePlayerSustain){
        if (this.storePlayerInstrumentType === 'polySynth'){
          this.playerInstrument.set({ 'envelope': { sustain: storePlayerSustain } })
        }
      },
      storePlayerRelease: function(storePlayerRelease){
        if (this.storePlayerInstrumentType === 'polySynth' || this.storePlayerInstrumentType === 'monoSynth'){
          this.playerInstrument.set({ 'envelope': { release: storePlayerRelease } })
        } else if (this.$store.state.playerParams.instrumentType === 'sampler'){
          this.playerInstrument.set({ 'release': storePlayerRelease })
          //this.playerInstrument.set({ 'envelope': { release: storePlayerRelease } })
          console.log('player release', this.playerInstrument.release)
        }
      },
      storePlayerPortamento: function(storePlayerPortamento){
        this.playerInstrument.set({ 'portamento': storePlayerPortamento })
      },
      storePlayerHarmonicity: function(storePlayerHarmonicity){
        this.playerInstrument.set({ 'oscillator': { 'harmonicity': storePlayerHarmonicity} })
      },
      storePlayerModulationType: function(storePlayerModulationType){
        this.playerInstrument.set({ 'oscillator': { 'modulationType' : storePlayerModulationType } })
      },
      storePlayerModulationIndex: function(storePlayerModulationIndex){
        this.playerInstrument.set({ 'oscillator': { 'modulationIndex' : storePlayerModulationIndex } })
      },
      storePlayerSpread: function(storePlayerSpread){
        this.playerInstrument.set({ 'oscillator': { 'spread' : storePlayerSpread } })
      },
      storePlayerCount: function(storePlayerCount){
        //console.log('osc', this.playerInstrument.oscillator)
        //console.log('pre count?', this.playerInstrument)
        this.playerInstrument.set({ 'oscillator': { 'count' : storePlayerCount } })
      },
      storePlayerModulationFrequency: function(storePlayerModulationFrequency){
        this.playerInstrument.set({ 'oscillator': { 'modulationFrequency' : storePlayerModulationFrequency } })
      },
      // Player Params Effects
      storePlayerDelayTime: function(storePlayerDelayTime){
        this.playerDelay.delayTime.value = storePlayerDelayTime
      },
      storePlayerDelayFeedback: function(storePlayerDelayFeedback){
        this.playerDelay.feedback.value = storePlayerDelayFeedback
      },
      storePlayerDistortion: function(storePlayerDistortion){
        this.playerDistortion.distortion = storePlayerDistortion
      },
      storePlayerFilterWet: function(storePlayerFilterWet){
        this.playerAutoFilter.wet.value = storePlayerFilterWet
      },
      storePlayerFilterType: function(storePlayerFilterType) {
        this.playerAutoFilter.filter.type = storePlayerFilterType
      },
      storePlayerFilterRolloff: function(storePlayerFilterRolloff) {
        this.playerAutoFilter.filter.rolloff = storePlayerFilterRolloff
      },
      storePlayerBaseFrequency: function(storePlayerBaseFrequency){
        this.playerAutoFilter.baseFrequency = storePlayerBaseFrequency
      },
      storePlayerFilterQ: function(storePlayerFilterQ){
        this.playerAutoFilter.filter.Q.value = storePlayerFilterQ
      },
      storePlayerLFOWaveType: function(storePlayerLFOWaveType) {
        this.playerAutoFilter.type = storePlayerLFOWaveType
      },
      storePlayerLFOFrequency: function(storePlayerLFOFrequency){
        this.playerAutoFilter.frequency.value = storePlayerLFOFrequency
      },
      storePlayerLFODepth: function(storePlayerLFODepth){
        this.playerAutoFilter.depth.value = storePlayerLFODepth
      },
      storePlayerLFOOctaves: function(storePlayerLFOOctaves){
        this.playerAutoFilter.octaves = storePlayerLFOOctaves
      },
    },


    methods : {

      checkForTrackChanges(track, index){
        //console.log(index, "ttI", track.toneTuneIndex)
        if (this.scene.started === false) { this.$store.commit('startScene') }

        // IF LEAD TRACK, CHECK CHANGE AND MODULATION TRIGGERS
        if (track.id === this.scene.leadTrackId){
          if (track.toneTuneIndex === 0 && this.scene.modulationTriggered){
            this.$store.dispatch('morphSelectedNotes')
            this.$store.commit('toggleModulationTriggered', false)
          }
          if (track.toneTuneIndex === 0 && track.changeTriggered){
            this.$store.dispatch('changeTune', { trackIndex: index, all: false } )
            this.$store.commit('toggleTrackChangeTriggered', { index: index, bool: false } )
          }
          if (this.$store.state.sceneAdvanceTriggered){
            this.$store.commit('resetScene')
            if (this.scene.resetRememberedOnSceneChange) {
              this.$store.dispatch('returnAllTunes')
            }
            if (this.$store.state.editingSceneNumber >= this.$store.state.scenes.length-1 &&
              this.$store.state.chain && this.$store.state.chainLoop === false) {
              this.togglePlay()
              // there is some reason these have to come after in this if-block, why?
              this.$store.commit('updateFormStep', 'zero')  // having this here feels rather cludgey. there must be a cleaner way to do this formStep & sceneAdvanceTriggered biz
              this.$store.dispatch('changeScene')
              this.$store.commit('setSceneAdvanceTriggered', false)
              return
            }
            this.$store.commit('updateFormStep', 'zero')  // having this here feels rather cludgey. there must be a cleaner way to do this formStep & sceneAdvanceTriggered biz
            console.log("changing scene")
            this.$store.dispatch('changeScene')
            this.$store.commit('setSceneAdvanceTriggered', false)
          }
          if (this.$store.state.chain && this.$store.state.sceneChangeNumber === this.$store.state.editingSceneNumber) {
            this.$store.dispatch('setUpSceneChange', 'forward')
          }
        } else {
          // CHANGE OTHER TRACKS
          if (track.toneTuneIndex === 0 && track.changeTriggered){
            this.$store.dispatch('changeTune', { trackIndex: index, all: false } )
            this.$store.commit('toggleTrackChangeTriggered', { index: index, bool: false } )
          }
        }
      },

      advanceAndPlayTrack(track, index, time){

        // ESTABLISH TONETUNE
        let toneTune = this.toneTunes[index] // 'pass-by-reference', more complicated than I thought. When this is above CHECK CHANGE ANS MODULATION TIGEERS, play function gets the old array after change... https://stackoverflow.com/questions/7744611/pass-variables-by-reference-in-javascript

        // PLAY NOTES
        let pitch = toneTune[track.toneTuneIndex]
        if (pitch != 0){
          if (track.toneTuneIndex === toneTune.length-1 && this.$store.state.sceneAdvanceTriggered) {
            AM.scenes[this.scene.title].instruments[index].triggerAttackRelease(pitch, '16n', time) // corrects for last note duration bleed-over on scene change
          } else {
            AM.scenes[this.scene.title].instruments[index].triggerAttackRelease(pitch, track.noteDuration, time)
          }
        }

        // ADVANCE TRACK STEP and TRIGGERS CASCADE
        if (track.toneTuneIndex < toneTune.length-1) {
            this.$store.commit('changeToneTuneIndex', {change:'increment', index:index} )

        } else {
            this.$store.commit('changeToneTuneIndex', {change:'zero', index:index} )
            this.$store.dispatch('checkChainIncrementAndTriggerAdvance', { track: track, increment: 'Lead Cycle' }  )
            this.$store.dispatch('checkAdvanceCueVsChangeIncrement', { track: track, increment: 'Lead Cycle', index: index } )

            if (track.changeCycles < track.changePer-1 && !(track.changePer === 0) && !this.scene.suspendChanges) {
                this.$store.commit('changeCycles', {change:'increment', index:index} )

            } else if (!(track.changePer === 0) && !this.scene.suspendChanges) {
                this.$store.commit('changeCycles', { change:'zero', index: index} )
                this.$store.commit('toggleTrackChangeTriggered', { index: index, bool: true })
                this.$store.dispatch('checkChainIncrementAndTriggerAdvance', { track: track, increment: 'Lead Change' }  )
                this.$store.dispatch('checkAdvanceCueVsChangeIncrement', { track: track, increment: 'Lead Change', index: index } )

                // LEAD TRACK QUEUES MODULATION
                if (track.id === this.scene.leadTrackId && this.scene.autoModulate) {
                    if (this.scene.modulationCycles < this.scene.modulatePerLeadChanges-1){
                      this.$store.commit('updateModulationCycles', 'increment')

                    } else {
                      this.$store.commit('updateModulationCycles', 'zero')
                      this.$store.commit('toggleModulationTriggered', true)
                      this.$store.dispatch('checkChainIncrementAndTriggerAdvance', { track: track, increment: 'Modulation' }  )
                      this.$store.dispatch('checkAdvanceCueVsChangeIncrement', { track: track, increment: 'Modulation', index: index } )
                    }
                }
            }
        }
      },

      playEntryPitch(pitch){
        let sceneTitle = this.scene.title //console.log(AM.scenes[sceneTitle])
        if (pitch != ' ') {
          AM.scenes[sceneTitle].instruments[this.editingTrackNumber].triggerAttackRelease(pitch, '8n' )
        }
      },

      toggleEntrySound(){
        this.$store.commit('toggleEntrySound')
      },
      togglePlay(){
        this.$store.commit('togglePlay')
      },
  		play(){
        const d = new Date
        this.$store.commit('updateStartTime', d.getTime())
        Tone.Transport.start()
      },   // .start('+0.1')
  		stop(){
        Tone.Transport.stop()
      },


      /** KEY ENTRY *****************************************************************************************************
      *
      *******************************************************************************************************************/

      onkeydown(e) {
        //console.log(e)
        if(e.key === ' ' && !this.scene.editingForm) {
          e.preventDefault()
          //return  /* return prevents spacebar from playing previous pitch (gives error, but can be used musically) */
        }

  			if(this.down.indexOf(e.key) === -1) { 	// this.down.indexOf(e.key) === -1 ? this.down.push(e.key) : return;  // can't use return in this way
  				this.down.push(e.key);
          //console.log("entering down:", e.key)
          //console.log("down:", this.down)
          //joined', this.down.join('-'))

          if (this.activeRegion==='' && e.key==='Enter') { this.down = [] } // this prevents 'Enter' from getting stuck in down when a select is focussed. It works but feeling a bit suspicious. (Or perhaps more conditions are needed here?)

          for (var k in generalKeyDispatchTable) {
            if (generalKeyDispatchTable.hasOwnProperty(k) && this.down.indexOf(k) > -1) {
              generalKeyDispatchTable[k].bind(this)()
            }
          }

  	      switch (this.activeRegion) {
  		      case "tune-entry":
              for (var k in tuneEntryDispatchTable) {
                // https://www.reddit.com/r/vuejs/comments/8j84cv/vuejs_and_keyboard_input_data_structure/?st=jh9vg13f&sh=4140f0ad // https://jsperf.com/hasownproperty-overkill/1
                if (tuneEntryDispatchTable.hasOwnProperty(k) && this.down.indexOf(k) > -1) {
                  tuneEntryDispatchTable[k].bind(this)()
                  break
                }
              }
              // Note Entry
              if ( (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Octave" && this.$store.state.noteKeys_RowsOctave.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Fifth" && this.$store.state.noteKeys_RowsFifth.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Clusters" && this.$store.state.noteKeys_Clusters.indexOf(e.key) > -1)
              ){
                let pitch = this.$store.getters.qwertyVals[e.key]
                //console.log("pitch", pitch)
                if (this.$store.state.entrySound) { this.playEntryPitch(pitch) }
                if (this.editingIndex === this.editingTune.length-1) {
                  this.$store.dispatch('noteEntry', { change:'fromEndcap', pitch:pitch })
                } else {
                  this.$store.dispatch('noteEntry', { change:'currentNote', pitch:pitch })
                }
              }
              break;

  		      case "qwerty-player":
              if ( (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Octave" && this.$store.state.noteKeys_RowsOctave.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Fifth" && this.$store.state.noteKeys_RowsFifth.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Clusters" && this.$store.state.noteKeys_Clusters.indexOf(e.key) > -1)
                ) {
                this.playerInstrument.triggerAttack(this.$store.getters.qwertyVals[e.key], Tone.context.currentTime)
              }
              if (this.down.indexOf('ArrowUp') > -1) {
                this.playerInstrument.set('detune', 100)
              }
              if (this.down.indexOf('ArrowDown') > -1) {
                this.playerInstrument.set('detune', -100)
              }
              if (this.down.indexOf('ArrowLeft') > -1) {
                this.playerInstrument.set('detune', -200)
              }
              if (this.down.indexOf('ArrowRight') > -1) {
                this.playerInstrument.set('detune', 200)
              }
  		        break

            case "piano-selector":
              console.log("qwertyVals", this.$store.getters.qwertyVals)
              if ( (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Octave" && this.$store.state.noteKeys_RowsOctave.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Rows-Fifth" && this.$store.state.noteKeys_RowsFifth.indexOf(e.key) > -1) ||
                   (this.$store.state.playerParams.keyToQwertyDisplay === "Clusters" && this.$store.state.noteKeys_Clusters.indexOf(e.key) > -1)
              ){
                let note = this.$store.getters.qwertyVals[e.key].slice(0,-1)
                this.$store.commit('updateSelectedNotes', note)
              }
    		      break

  		      default:
  		        //console.log("active-region: default")
              break
  	      };
        }
  	  },

  	  onkeyup(e){
        //console.log(e, e.key)
  	    if(this.down.indexOf(e.key) > -1) {
  	      let newdown = remove(this.down, e.key)
          let capitals = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?']
          newdown.forEach( (item, index) => {
            if (capitals.indexOf(item) > -1) {newdown = remove(newdown, item)}
          })
          this.down = newdown
          if (this.activeRegion === "qwerty-player") {
            if (this.storePlayerInstrumentType === 'monoSynth'){
              console.log('down.length', this.down.length)
              if (this.down.length === 0) { this.playerInstrument.triggerRelease() }
            } else {
              this.playerInstrument.triggerRelease(this.$store.getters.qwertyVals[e.key])
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              this.playerInstrument.set('detune', 0)
            }
          }
  	    }

  	  },

      clearKeyFromDown(key){
        console.log('clearing key... ')
        if (this.down.indexOf(key) > -1) { this.down.splice(this.down.indexOf(key), 1) }
      },

      /*************************************************************************************************
      * INITIALIZATION HELPER
      *************************************************************************************************/

      updatePlayerStuff(){

        console.log(this.playerInstrument)

        // clear out any prior connections
        if (this.playerInstrument != ''){
          this.playerInstrument.disconnect()
          //this.playerInstrument.dispose() // apparently it still works ok without this, just overwriting it I guess...?
            // from storePlayerInstrumentType watcher callback: cannot read property 'dispose' of undefined...!?
            // also getting the same error from changePlayerWaveType but with no ill effect
        }
        this.playerGain.disconnect()
        this.playerAutoFilter.disconnect()
        this.playerDistortion.disconnect()
        this.playerDelay.disconnect()

        // assign instrument & envelope
        if (this.storePlayerInstrumentType === 'polySynth'){
          this.playerInstrument = AM.playerPolySynth()
          this.playerInstrument.set({
             "oscillator": { "type": this.$store.state.playerParams.waveType }
          })
          this.playerInstrument.set({ 'envelope': { attack: this.$store.state.playerParams.attack } })
          this.playerInstrument.set({ 'envelope': { decay: this.$store.state.playerParams.decay } })
          this.playerInstrument.set({ 'envelope': { sustain: this.$store.state.playerParams.sustain } })
          this.playerInstrument.set({ 'envelope': { release: this.$store.state.playerParams.release } })
        }
        else if (this.storePlayerInstrumentType === 'monoSynth'){
          this.playerInstrument = AM.playerMonoSynth()
          this.playerInstrument.set({
             "oscillator": { "type": this.$store.state.playerParams.waveType }
          })
          this.playerInstrument.set({ 'envelope': { attack: this.$store.state.playerParams.attack } })
          this.playerInstrument.set({ 'envelope': { decay: this.$store.state.playerParams.decay } })
          this.playerInstrument.set({ 'envelope': { sustain: this.$store.state.playerParams.sustain } })
          this.playerInstrument.set({ 'envelope': { release: this.$store.state.playerParams.release } })
          this.playerInstrument.set({ 'portamento': this.storePlayerPortamento })
        } else {
          switch (this.storePlayerSampleType){
            //case 'piano': this.playerInstrument = AM.playerPianoSampler(); break
            //case 'gtrSwell': this.playerInstrument = AM.playerGtrSwellSampler(); break
            //case 'gtrMute': this.playerInstrument = AM.playerGtrMuteSampler(); break
            //case 'marimba': this.playerInstrument = AM.playerMarimbaSampler(); break
            //case 'strings': this.playerInstrument = AM.playerStringsSampler(); break
            case 'gtrSwell': this.playerInstrument = AM.instrument('sampler', 'gtrSwell'); break
            case 'gtrMute': this.playerInstrument = AM.instrument('sampler', 'gtrMute'); break
            case 'bassGtr': this.playerInstrument = AM.instrument('sampler', 'bassGtr'); break
            case 'piano': this.playerInstrument = AM.instrument('sampler', 'piano'); break
            case 'digiHarp': this.playerInstrument = AM.instrument('sampler', 'digiHarp'); break
            case 'elecPno1': this.playerInstrument = AM.instrument('sampler', 'elecPno1'); break
            case 'elecPno2': this.playerInstrument = AM.instrument('sampler', 'elecPno2'); break
            case 'elecPno3': this.playerInstrument = AM.instrument('sampler', 'elecPno3'); break
            case 'marimba': this.playerInstrument = AM.instrument('sampler', 'marimba'); break
            case 'strings': this.playerInstrument = AM.instrument('sampler', 'strings'); break
          }
          this.playerInstrument.set({ 'attack': this.$store.state.playerParams.attack })
          this.playerInstrument.set({ 'release': this.$store.state.playerParams.release })
        }

        if (this.$store.state.playerParams.instrumentType === 'monoSynth' || this.$store.state.playerParams.instrumentType === 'polySynth'){
          switch(this.$store.state.playerParams.waveType.substring(0, 1)) {
            case 'am':
              this.playerInstrument.set({ 'oscillator': { 'modulationType' : storePlayerModulationType } })
              this.playerInstrument.set({ 'oscillator': { 'harmonicity': storePlayerHarmonicity} })
              break
            case 'fm':
              this.playerInstrument.set({ 'oscillator': { 'modulationType' : storePlayerModulationType } })
              this.playerInstrument.set({ 'oscillator': { 'harmonicity': storePlayerHarmonicity} })
              this.playerInstrument.set({ 'oscillator': { 'modulationIndex' : storePlayerModulationIndex } })
              break
            case 'fa':
              this.playerInstrument.set({ 'oscillator': { 'spread' : storePlayerSpread } })
              this.playerInstrument.set({ 'oscillator': { 'count' : storePlayerCount } })
              break
            case 'pw':
              this.playerInstrument.set({ 'oscillator': { 'modulationFrequency' : storePlayerModulationFrequency } })
              break
          }
        }

        // set up other stuff
        let gainValue = ( () => {
          switch (this.$store.state.playerParams.instrumentType){
            case 'polySynth': return this.$store.state.playerParams.polySynthGainDefault
            case 'monoSynth': return this.$store.state.playerParams.monoSynthGainDefault
            case 'sampler': return this.$store.state.playerParams.samplerGainDefault
          }
        })()
        console.log("gainValue", gainValue)
        this.$store.commit('updatePlayerParam', { param:'gain', value:gainValue })
        //this.playerGain.gain.value = this.$store.state.playerParams.gain
        this.playerDistortion.distortion = this.$store.state.playerParams.distortion
        console.log('wet dist', this.playerDistortion.wet.value)
        this.playerDistortion.wet.value = 0.5
        this.playerDelay.wet.value = 0.5
        this.playerDelay.delayTime.value = this.$store.state.playerParams.delayTime
        this.playerDelay.feedback.value = this.$store.state.playerParams.delayFeedback

        this.playerAutoFilter.wet.value = this.$store.state.playerParams.filterWet
        this.playerAutoFilter.filter.type = this.storePlayerFilterType
        this.playerAutoFilter.filter.rolloff = this.storePlayerFilterRolloff
        this.playerAutoFilter.baseFrequency = this.storePlayerBaseFrequency
        this.playerAutoFilter.filter.Q.value = this.$store.state.playerParams.filterQ
        this.playerAutoFilter.frequency.value = this.$store.state.playerParams.LFOFrequency
        this.playerAutoFilter.depth.value = this.$store.state.playerParams.LFODepth
        this.playerAutoFilter.type = this.storePlayerLFOWaveType
        this.playerAutoFilter.octaves = this.storePlayerLFOOctaves
        this.playerAutoFilter.start()

        this.playerInstrument.connect(this.playerGain)
        this.playerGain.connect(this.playerAutoFilter)
        this.playerAutoFilter.connect(this.playerDistortion)
        this.playerDistortion.fan(Tone.Master, this.playerDelay)
        if (this.$store.state.playerParams.delayActive) {
          this.playerDelay.toMaster()
        }

      },

      deactivateDelay(){
        this.playerDelay.disconnect()
      },
      reactivateDelay(){
        this.playerDelay.connect(Tone.Master)
      },



    },  // end methods


    created(){


      // SCENE SETUP
      this.$store.dispatch('setUpNewScene')
      // this.$store.dispatch('initializeSceneAudio', this.$store.state.editingSceneNumber)
        // check, are you already doing this in that action?

      // initialize PLAYER PARAM settings
      if (!this.$store.state.playerParamSettings[0].assigned){
        const defaultSettings = JSON.parse(JSON.stringify(this.$store.state.playerParams))
        this.$store.commit('assignPlayerParamSetting', 0)
      }

      // SET SCENE ID
      this.$store.commit('updateEditingSceneId', this.scene.id)
        // this *should* be separate from setUpNewScene, right?

      // TONE SETUP
  		this.scheduleId = Tone.Transport.scheduleRepeat(time => {  // ;console.log("scheduleRepeat")  // Cleared below
  		  this.tracks.forEach( (track, index) => {
  		    this.checkForTrackChanges(track, index)
        })
        //this.advanceAndPlayTrack(this.tracks[this.$store.getters.leadTrackNumber], this.$store.getters.leadTrackNumber, time)
        this.tracks.forEach( (track, index) => {
          //if (index === this.$store.getters.leadTrackNumber) { return }
          //else { this.advanceAndPlayTrack(track, index, time) }
          this.advanceAndPlayTrack(track, index, time)
        })
        const d = new Date
        this.$store.commit('updateCurrentTime', d.getTime())
        if (this.$store.state.sleepSetting > 0 && this.$store.state.currentTime - this.$store.state.startTime >= this.$store.state.sleepSetting * 60000){
          this.togglePlay()
          this.$store.commit('updateCurrentTime', this.$store.state.startTime)
        }
  		}, '8n');
  		Tone.Transport.bpm.value = this.$store.state.scenes[this.$store.state.editingSceneNumber].bpm;

      // KEYBOARD ENTRY
  		window.addEventListener('keydown', this.onkeydown) // document.onkeydown = this.onkeydown
  		window.addEventListener('keyup', this.onkeyup) // document.onkeydown = this.onkeydown

      // REMOVE ENTER WHEN HTML SELECT IS USED
      bus.$on('clearKeyFromDown', (key)=> {
        console.log("cleaingKey:", key)
        this.clearKeyFromDown(key)
      })

      // PLAYER SYNTH
      this.updatePlayerStuff()
      bus.$on('updatePlayerStuff', () => {
        this.updatePlayerStuff()
      })
      bus.$on('deactivateDelay', () => {
        this.deactivateDelay()
      })
      bus.$on('reactivateDelay', () => {
        this.reactivateDelay()
      })


      // KEYPRESS LIBRARY
      keypress.bind(this)()

    },


    beforeDestroy: function () {
      Tone.Transport.clear(this.scheduleId) // ;console.log("beforeDestroy scheduleId...", this.scheduleId) // This clear prevents multiple scheduleRepeats from accumulating on Hot-Recompile. (Which causes multiple calls to advanceTrackStep )
  		window.removeEventListener('keydown', this.onkeydown)
  		window.removeEventListener('keyup', this.onkeyup)
    },


}





</script>

<style>

.app {
}

.app-main {
}


</style>
