<template>
  <div id="app" class="app" >

      <global-controls></global-controls>

      <div class="app-main">
          <play-n-tabs></play-n-tabs>
          <scene-dashboard></scene-dashboard>
          <!--  Ed# {{ editingTrackNumber }} | EdId: {{ editingTrackId }}  -->
          <tracks></tracks>
          <player-UI :down="down" :playerSynth="playerSynth"></player-UI>
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
        //entrySynthType: 'triangle',
        down: [],
        scheduleId: '',
/*        playerSynth: new Tone.PolySynth(6, Tone.Synth, {
    			"oscillator" : {
              "type": "sawtooth",
    			}
    		}),*/
        playerSynth: AM.playerSynth,
        playerGain: new Tone.Gain(),
        playerDelay: new Tone.FeedbackDelay(0, 0),
        playerDistortion: new Tone.Distortion(),
        playerReverb: new Tone.JCReverb(),
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
      storePlayerGain(){
        return this.$store.state.playerParams.gain
      },
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
        return this.$store.state.playerFilter.filterWet
      },
      storePlayerBaseFrequency(){
        return this.$store.state.playerFilter.filterBaseFrequency
      },
      storePlayerFilterType(){
        return this.$store.state.playerFilter.filterType
      },
      storePlayerFilterRolloff() {
        return this.$store.state.playerFilter.filterRolloff
      },
      storePlayerFilterQ(){
        return this.$store.state.playerFilter.filterQ
      },
      storePlayerLFOWaveType(){
        return this.$store.state.playerFilter.LFOWaveType
      },
      storePlayerLFOFrequency(){
        return this.$store.state.playerFilter.LFOFrequency
      },
      storePlayerLFODepth(){
        return this.$store.state.playerFilter.LFODepth
      },
      storePlayerLFOOctaves(){
        return this.$store.state.playerFilter.LFOOctaves
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
      storePlayerGain: function(storePlayerGain){ // doesn't work with arrow function! need to think about that.
        this.playerGain.gain.value = storePlayerGain
      },
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

      advanceTrackStep(time){   // console.log("in pTP") //console.log(Date.now(), this.tracks)
        if (this.tracks[this.leadTrackNumber].toneTuneIndex === 0 && this.$store.state.advanceTriggered){  // this.leadTrack.toneTuneIndex === this.toneTunes[this.leadTrackNumber].length-1
          if (this.$store.state.chain) {
            this.$store.commit('resetScene')
            if (this.$store.state.editingSceneNumber >= this.$store.state.scenes.length-1 &&
                this.$store.state.chainLoop === false) {
              this.togglePlay()
              this.$store.commit('changeScene')
              this.$store.commit('setAdvanceTriggered', false)
              return
            }
            this.$store.commit('changeScene')
            this.$store.commit('setAdvanceTriggered', false)
          } else {
            this.$store.commit('resetScene')
            this.$store.commit('changeScene')
            this.$store.commit('setAdvanceTriggered', false)
          }
        }
        if (this.$store.state.chain) {
          this.$store.dispatch('setUpSceneChange', 'forward')
        }
        if (this.scene.started === false) { this.$store.commit('startScene') }

        // ADVANCE and PLAY
        this.advanceAndPlayTrack(this.tracks[this.$store.getters.leadTrackNumber], this.$store.getters.leadTrackNumber, time)
        this.tracks.forEach( (track, index) => {
          if (index === this.$store.getters.leadTrackNumber) { return }
          else { this.advanceAndPlayTrack(track, index, time) }
        })
      //  console.log("this.leadTrack.toneTunesIndex", this.leadTrack.toneTuneIndex)
      //  console.log("this.toneTunes[this.leadTrackNumber].length", this.toneTunes[this.leadTrackNumber].length)
      },

      advanceAndPlayTrack(track, index, time){
        // if (this track's lock# is itself) { behave normally }
        // else { use the toneTuneIndex of the lock# and ignore values above or below }
          if (track.toneTuneIndex === 0) {
            if (track.changeCycles >= track.changePer && track.changePer != 0 && !this.scene.suspendChanges ) {
              if (track.id === this.scene.leadTrackId) {
                // can combine with next:
                if (this.scene.autoModulate) {
                  // advanceModulationCycle
                  if (this.scene.modulationCycles < this.scene.modulatePerLeadChanges-1){
                    this.$store.commit('updateModulationCycles', 'increment')
                  } else {
                    this.$store.commit('updateModulationCycles', 'zero')
                    this.$store.dispatch('morphSelectedNotes')
                  }
                }
              }
              this.$store.dispatch('changeTune', { trackIndex: index, all: false })
              this.$store.commit('changeCycles', {change:'zero', index: index} )
            }
          }
          let toneTune = this.toneTunes[index]
          let pitch = toneTune[track.toneTuneIndex]
          if (pitch != 0){
            AM.scenes[this.scene.title].synths[index].triggerAttackRelease(pitch, track.noteDuration, time)
          }
          if (track.toneTuneIndex < toneTune.length-1) {
            this.$store.commit('changeToneTuneIndex', {change:'increment', index:index} )
          } else {
            this.$store.commit('changeToneTuneIndex', {change:'zero', index:index} )
            if (track.changeCycles < track.changePer && !this.scene.suspendChanges) {
              this.$store.commit('changeCycles', {change:'increment', index:index} )
            }
            // Check for Scene Chaining:
            if (track.id === this.leadTrack.id && this.$store.state.chain === true ) { // && this.scene.chainAdvancePer > 0) {
              if (this.scene.leadCycles < this.scene.chainAdvancePer-1) {
                this.$store.commit('changeLeadCycles', 'increment' )
                console.log("leadCycles", this.scene.leadCycles)
              } else {
                this.$store.commit('changeLeadCycles', 'zero' )
                this.$store.commit('setAdvanceTriggered', true)
              }
            }
          }

      },

      playEntryPitch(pitch){
        let sceneTitle = this.scene.title //console.log(AM.scenes[sceneTitle])
        if (pitch != ' ') {
          AM.scenes[sceneTitle].synths[this.editingTrackNumber].triggerAttackRelease(pitch, '8n' )
        }
      },

      toggleEntrySound(){
        this.$store.commit('toggleEntrySound')
      },
      togglePlay(){
        this.$store.commit('togglePlay')
      },
  		play(){ Tone.Transport.start() },   // .start('+0.1')
  		stop(){ Tone.Transport.stop() },
      reset(){
        this.$store.commit('reset')
      },

      /** KEY ENTRY *****************************************************************************************************
      *
      *******************************************************************************************************************/

      onkeydown(e) {
  	    //console.log(e.key);
        if(e.key === ' ' && !this.scene.editingForm) {
          e.preventDefault()
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
              if ( (this.$store.state.keyToQwertyDisplay === "Rows-Octave" && this.$store.state.noteKeys_RowsOctave.indexOf(e.key) > -1) ||
                   (this.$store.state.keyToQwertyDisplay === "Clusters" && this.$store.state.noteKeys_Clusters.indexOf(e.key) > -1)
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
              this.playerSynth.triggerAttack(this.$store.getters.qwertyVals[e.key], Tone.context.currentTime)
              if (this.down.indexOf('ArrowUp') > -1) {
                this.playerSynth.set('detune', 100)
              }
              if (this.down.indexOf('ArrowDown') > -1) {
                this.playerSynth.set('detune', -100)
              }
              if (this.down.indexOf('ArrowLeft') > -1) {
                this.playerSynth.set('detune', -200)
              }
              if (this.down.indexOf('ArrowRight') > -1) {
                this.playerSynth.set('detune', 200)
              }
  		        break

            case "piano-selector":
              console.log("qwertyVals", this.$store.getters.qwertyVals)
              if ( (this.$store.state.keyToQwertyDisplay === "Rows-Octave" && this.$store.state.noteKeys_RowsOctave.indexOf(e.key) > -1) ||
                   (this.$store.state.keyToQwertyDisplay === "Clusters" && this.$store.state.noteKeys_Clusters.indexOf(e.key) > -1)
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
  	    if(this.down.indexOf(e.key) > -1) {
  	      let newdown = remove(this.down, e.key)
          let capitals = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?']
          newdown.forEach( (item, index) => {
            if (capitals.indexOf(item) > -1) {newdown = remove(newdown, item)}
          })
          this.down = newdown
          if (this.activeRegion === "qwerty-player") {
            this.playerSynth.triggerRelease(this.$store.getters.qwertyVals[e.key])
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              this.playerSynth.set('detune', 0)
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
        this.playerSynth.set({
           "oscillator": { "type": this.$store.state.playerParams.waveType }
        })
        this.playerGain.gain.value = this.$store.state.playerParams.gain
        this.playerDistortion.distortion = this.$store.state.playerParams.distortion
        this.playerDelay.wet.value = 0.5
        this.playerDelay.delayTime.value = this.$store.state.playerParams.delayTime
        this.playerDelay.feedback.value = this.$store.state.playerParams.delayFeedback

        this.playerSynth.set({ 'envelope': { attack: this.$store.state.playerADSR.attack } })
        this.playerSynth.set({ 'envelope': { decay: this.$store.state.playerADSR.decay } })
        this.playerSynth.set({ 'envelope': { sustain: this.$store.state.playerADSR.sustain } })
        this.playerSynth.set({ 'envelope': { release: this.$store.state.playerADSR.release } })

        this.playerAutoFilter.wet.value = this.$store.state.playerFilter.filterWet
        this.playerAutoFilter.filter.type = this.storePlayerFilterType
        this.playerAutoFilter.filter.rolloff = this.storePlayerFilterRolloff
        this.playerAutoFilter.baseFrequency = this.storePlayerBaseFrequency
        this.playerAutoFilter.filter.Q.value = this.$store.state.playerFilter.filterQ
        this.playerAutoFilter.frequency.value = this.$store.state.playerFilter.LFOFrequency
        this.playerAutoFilter.depth.value = this.$store.state.playerFilter.LFODepth
        this.playerAutoFilter.type = this.storePlayerLFOWaveType
        this.playerAutoFilter.octaves = this.storePlayerLFOOctaves
        this.playerAutoFilter.start()

        /* this.playerSynth.fan(this.playerGain, this.playerDelay)
        this.playerGain.chain(this.playerDistortion, this.playerAutoFilter, Tone.Master)
        this.playerDelay.chain(this.playerGain, this.playerDistortion, this.playerAutoFilter, Tone.Master) */

        this.playerSynth.connect(this.playerGain)
        this.playerGain.connect(this.playerAutoFilter)
        this.playerAutoFilter.connect(this.playerDistortion)
        this.playerDistortion.connect(this.playerDelay)
        this.playerDelay.toMaster()

      },

      deactivateDelay(){
        console.log('deactivateDelay');
        this.playerDelay.disconnect()
      },
      reactivateDelay(){
        this.playerDelay.chain(this.playerGain, this.playerDistortion, this.playerAutoFilter, Tone.Master)
        console.log('reactivateDelay')
      },



    },  // end methods


    created(){


      // SCENE SETUP
      this.$store.dispatch('setUpNewScene')
      // this.$store.dispatch('initializeSceneAudio', this.$store.state.editingSceneNumber)
        // check, are you already doing this in that action?

      // SET SCENE ID
      this.$store.commit('updateEditingSceneId', this.scene.id)
        // this *should* be separate from setUpNewScene, right?

      // TONE SETUP
  		this.scheduleId = Tone.Transport.scheduleRepeat(time => {  // ;console.log("scheduleRepeat")  // Cleared below
  			this.advanceTrackStep(time);
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
