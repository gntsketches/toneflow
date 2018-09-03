import Vue from 'vue';
import Vuex from 'vuex';
import {AudioManager as AM} from "../AudioManager"
import {modeData as MODEDATA} from "../modeData"
import {stateDefaults as STATEDEFAULTS} from "./stateDefaults"
let stateDefaultsParsed = JSON.parse(JSON.stringify(STATEDEFAULTS))
console.log('stateDefaultsParsed', stateDefaultsParsed)
import {bus} from '../main.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,

    state: stateDefaultsParsed,

    getters: {

      toneTunes: state => { // computed for "current" scene only! (pros / cons of returning an array/object with all the scenes? )
        let toneTunes = []
        state.scenes[state.editingSceneNumber].tracks.forEach(function(track, index) {
          if (track.tune.length > 0) {
            let mod1 = track.tune[track.tune.length-1].pitch === '_' ? track.tune.slice(0, -1) : track.tune
      			let mod2 = mod1.map(note => {
      	       if (note.pitch === ' ') return 0
      				 else return note.pitch
      			})
            toneTunes.push(mod2)
          } else { toneTunes.push([])}
        })
  			return toneTunes
  		},
      pitchSets: state => { // computed for "current" scene only! (pros / cons of returning an array/object with all the scenes? )
        let scene = state.scenes[state.editingSceneNumber]
        let pitchSets = []
        scene.tracks.forEach(function(track, index){
          let pitchSet = []
    			let adjustedRangeLow = []
    			let adjustedRange = [] // minus the lower and higher bounds checked...
    			for (let i=0; i < state.fullRange.length; i++){
    				if(state.fullRange[i] === track.rangeLow){ adjustedRangeLow = state.fullRange.slice(i) }
    			}
    			for (let j=0; j <= adjustedRangeLow.length; j++){
    				if(adjustedRangeLow[j-1] === track.rangeHigh){ adjustedRange = adjustedRangeLow.slice(0, j) }
    			}
    			for (let k=0; k < adjustedRange.length; k++){
    				if (scene.selectedNotes.indexOf(adjustedRange[k].slice(0,-1)) >-1 ) {
    					pitchSet.push(adjustedRange[k])
    				}
    			}
    			pitchSets.push(pitchSet)
        })         //  ; console.log("getter pitchSets", pitchSets)
        return pitchSets
  		},
      pitchSetFullRange: state => {
        let scene = state.scenes[state.editingSceneNumber]
        let pitchSetFullRange = []
        for (let i=0; i < state.fullRange.length; i++) {
          if (scene.selectedNotes.indexOf(state.fullRange[i].slice(0,-1)) > -1) {
            pitchSetFullRange.push(state.fullRange[i])
          }
        }
        return pitchSetFullRange
      },
      newTrack: state => () => {
        // https://stackoverflow.com/questions/50070900/json-object-copy-in-vuex-getter
        let newTrack = JSON.parse(JSON.stringify(state.newTrackDefaults))
        let idNumber = Math.random().toString().slice(2)
        newTrack.id = idNumber
        return newTrack
      },
      leadTrackNumber: state => {
        let scene = state.scenes[state.editingSceneNumber]
        let leadTrackNumber = ''
        scene.tracks.forEach( (track, index) => {
          if (track.id === scene.leadTrackId) { leadTrackNumber = index }
        })
        return leadTrackNumber
      },
      advanceSceneTitle: state => {
        return state.scenes[state.sceneChangeNumber].title
      },
      qwertyVals: state => {
        let keyToQwerty = []
        switch (state.keyToQwertyDisplay){
          case 'Rows-Octave':
            keyToQwerty = state.keyToQwertyValRowsOctave
            break
          case 'Clusters':
            keyToQwerty = state.keyToQwertyValClusters
            break
        }
        //keyToQwerty = state.keyToQwertyVal
        let qwertyVals = {" ":" "}
        console.log("keyToQwerty", keyToQwerty)
        for (const key in keyToQwerty) {
          if (keyToQwerty[key] === "") {
            qwertyVals[key] = ""
          } else {
            let suffix = keyToQwerty[key].slice(-3)
            let val = keyToQwerty[key].slice(0, -3)
            if (suffix === "-Lo") {
              qwertyVals[key] = val + state.qwertyOctave
            }
            else if (suffix === "-Hi") {
              qwertyVals[key] = val + (state.qwertyOctave+1)
            }
            else if (suffix === "-Hx") {
              qwertyVals[key] = val + (state.qwertyOctave+2)
            }
          }
        }
        return qwertyVals
      },
      activeSceneTitle: state => {
        return state.scenes[state.editingSceneNumber].title
      },
      maxChangeables: state => {
        let scene = state.scenes[state.editingSceneNumber]
        let maxChangeables = []
        scene.tracks.forEach( (track, index) => {
          let maxChangeable = 0
          track.tune.forEach( (note, index) => {
            if (note.random === 'noRests' || note.random === 'rests') { maxChangeable++ }
          })
          maxChangeables.push(maxChangeable)
        })
        return maxChangeables
      },
      selectedModulations: state => {
        let scene = state.scenes[state.editingSceneNumber]
        let modulations =[]
        for (let mod in scene.modulationWeights) {
          for (let i=0; i < scene.modulationWeights[mod]; i++) { modulations.push(mod) }
        }
        if (modulations.length === 0) { modulations = ['dia'] }
        //console.log('modsulations', modulations)
        return modulations
      },
    },

    mutations: {

      // PLAYER UI
      changeQwertyOctave: (state, change) => {
        if (change ==="increment") { state.qwertyOctave++ }
        else if (change ==="decrement") { state.qwertyOctave-- }
      },
      changeQwertyDisplay: (state, value) => {
        state.keyToQwertyDisplay = value
      },
      changePlayerWaveType: (state, waveType) => {
        state.playerParams.waveType = waveType
        AM.playerSynth.set({
  	       "oscillator": { "type": state.playerParams.waveType }
        })
      },
      toggleDelayActive: state => {
        if (state.playerParams.delayActive) {
          bus.$emit('deactivateDelay')
          state.playerParams.delayActive = false
        } else {
          bus.$emit('reactivateDelay')
          state.playerParams.delayActive = true
        }
      },
      adjustSoundParam: (state, payload) => {
        switch(payload.param) {
          case 'gain':
            state.playerParams.gain = payload.paramPercent
            break
          case 'delayTime':
            state.playerParams.delayTime = payload.paramPercent
            break
          case 'delayFeedback':
            state.playerParams.delayFeedback = payload.paramPercent
          case 'reverb':
            state.playerParams.reverb = payload.paramPercent
            break
          case 'distortion':
            state.playerParams.distortion = payload.paramPercent
            break
        }
      },
      updatePlayerADSR: (state, payload) => {
        switch(payload.adsr) {
          case 'attack':
            state.playerADSR.attack = payload.value
            AM.playerSynth.set({ 'envelope': { attack: payload.value } })
            break
          case 'decay':
            state.playerADSR.decay = payload.value
            AM.playerSynth.set({ 'envelope': { decay: payload.value } })
            break
          case 'sustain':
            state.playerADSR.sustain = payload.value
            AM.playerSynth.set({ 'envelope': { sustain: payload.value } })
            break
          case 'release':
            state.playerADSR.release = payload.value
            AM.playerSynth.set({ 'envelope': { release: payload.value } })
            break
        }
      },
      updatePlayerFilter: (state, payload) => {
        switch(payload.param) {
          case 'filterWet':
            state.playerFilter.filterWet = payload.value
            break
          case 'filterType':
            state.playerFilter.filterType = payload.value
            break
          case 'filterRolloff':
            let rolloff = parseInt(payload.value, 10)
            state.playerFilter.filterRolloff = rolloff
            break
          case 'filterBaseFrequency':
            state.playerFilter.filterBaseFrequency = payload.value
            break
          case 'filterQ':
            state.playerFilter.filterQ = payload.value
            break
          case 'LFOWaveType':
            state.playerFilter.LFOWaveType = payload.value
            break
          case 'LFOFrequency':
            state.playerFilter.LFOFrequency = payload.value
            break
          case 'LFODepth':
            state.playerFilter.LFODepth = payload.value
            break
          case 'LFOOctaves':
            state.playerFilter.LFOOctaves = payload.value
            break


        }
      },

      // SCENE MANAGEMENT
      moveScene: (state, payload) => {
        let movingScene = {}
        let movingSceneIndex = ''
        if (payload.move === 'bench') {
          state.scenes.forEach( (scene, index) => {
            if (scene.id === payload.sceneId) {
              movingScene = scene
              movingSceneIndex = index
            }
          })
          if (movingSceneIndex !== state.editingSceneNumber) {
            state.scenes.splice(movingSceneIndex, 1)
            state.sceneBench.push(movingScene)
          }
        }
        if (payload.move === 'flow') {
          state.sceneBench.forEach( (scene, index) => {
            if (scene.id === payload.sceneId) {
              movingScene = scene
              state.sceneBench.splice(index, 1)
            }
          })
          state.scenes.push(movingScene)
        }
      },    // "benchScene" is a better title
      deleteScene: (state, sceneId) => {
        state.sceneBench.forEach( (scene, index) => {
          if (scene.id === sceneId) {
            state.sceneBench.splice(index, 1)
          }
        })
      },
      updateSceneTitle: (state, title) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.title = title
      },
      updateLeadTrack: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.leadTrackId = scene.tracks[value].id
      },
      changeTempo: (state, e) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.bpm = e.target.value.toString()
        Tone.Transport.bpm.value = scene.bpm
      },
      setAdvanceTriggered: (state, bool) => {
        bool === true? state.advanceTriggered = true : state.advanceTriggered = false
      },
      startScene: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.started = true
      },
      setSceneChangeNumber: (state, change) => {
        state.sceneChangeNumber = change
      },
      changeScene: (state) => {
        console.log("changing scene to:", state.sceneChangeNumber)
        state.editingSceneNumber = state.sceneChangeNumber
        let scene = state.scenes[state.editingSceneNumber]
        Tone.Transport.bpm.value = scene.bpm
      },
      changeLeadCycles: (state, change) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (change === "increment") { scene.leadCycles++ }
        else if (change === "zero") { scene.leadCycles = 0 }
      },
      resetScene: (state) => {
        let scene = state.scenes[state.editingSceneNumber]
        // editingTrackNumber, editingTrackId, editingIndex - all left alone
        scene.leadCycles = 0
        scene.tracks.forEach( (track, index) => {
          track.toneTuneIndex = 0
          track.changeCycles = 0
        })
        scene.started = false
        scene.modulationCycles = 0
      },
      updateChainAdvancePer: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.chainAdvancePer = value
      },
      updateAutoModulate: (state, onOrOff) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (onOrOff === 'on') { scene.autoModulate = true }
        else if (onOrOff === 'off') { scene.autoModulate = false }
      },
      updateNextModulation: (state, modulation) => {
        let scene = state.scenes[state.editingSceneNumber]
        console.log("mod", modulation)
        scene.nextModulation = modulation
      },
      updateModulationStyle: (state, style) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulationStyle = style
      },
      toggleEditingForm: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.editingForm = !scene.editingForm
      },
      updateHarmonicForm: (state, harmonicForm) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.harmonicForm = harmonicForm
      },
      updateFormStep: (state, update) => {
        let scene = state.scenes[state.editingSceneNumber]
        console.log('formStep before advance', scene.formStep)
        if (update === 'zero'){
          scene.formStep = 0
        } else if (update === 'advance') {
          if (scene.formStep < scene.harmonicForm.length-1) { scene.formStep++ }
          else { scene.formStep = 0 }
        } else if (update === 'off') {
          scene.formStep = -1
        }
        console.log('formStep after advance', scene.formStep)
      },
      updateModulatePerLeadChanges: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulatePerLeadChanges = value
      },
      updateModulationCycles: (state, update) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (update === 'increment') { scene.modulationCycles++ }
        else if (update === 'zero') { scene.modulationCycles = 0 }
      },
      updateModulationWeights: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulationWeights[payload.modulationType] = payload.value
      },
      toggleFilterOnChange: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.filterPitchesOnChange = !scene.filterPitchesOnChange
      },
      toggleSuspendChanges: state => {
        let scene = state.scenes[state.editingSceneNumber]
        if (scene.suspendChanges){
          scene.suspendChanges = false
        } else {
          scene.suspendChanges = true
          scene.tracks.forEach( track => {
            track.changeCycles = 0
          })
        }
      },

      // INITIALIZE, ADD & REMOVE
      addNewScene: ( state, newScene ) => {
        state.scenes.push(newScene)
        state.editingSceneId = newScene.id
      },
      setUpNewTrack: (state, newTrack) => {
        let scene = state.scenes[state.editingSceneNumber]

        // now that there is a newTrack getter for the next 3 lines, maybe an action should house this
        //  let newTrack = JSON.parse(JSON.stringify(state.newTrackDefaults))
        //  let idNumber = Math.random().toString().slice(2)
        //  newTrack.id = idNumber
        scene.tracks.splice(0, 1, newTrack)
        scene.editingTrackId = newTrack.id
        scene.editingIndex = newTrack.tune.length-1
      },
      addTrack: (state, track) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks.splice(1, 0, track)
      },
      removeTrack: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks.splice(trackNumber, 1)
      },

      // GENERAL PLAY & ENTRY
      toggleInfoMenu: state => {
        state.hideInfoMenu = !state.hideInfoMenu
      },
      toggleEditMode: state => {
        if (state.editMode === 'insert') state.editMode = 'overwrite'
        else if (state.editMode === 'overwrite') state.editMode = 'insert'
      },
      toggleEntrySound: state => {
        state.entrySound = !state.entrySound
      },
      changeActiveRegion: (state, region) => {
        console.log('cAR', region)
        state.activeRegion = region
      },
      changePreviousRegion: (state, region) => {
        console.log('cPR', region)
        state.previousRegion = region
      },
      togglePlay: state => {
        state.playing = !state.playing
      },
      toggleChain: state => {
        state.chain = !state.chain
        console.log("state.chain", state.chain)
      },
      toggleChainLoop: state => {
        state.chainLoop = !state.chainLoop
      },
      updateChainRepsToEnd: (state, value) => {
        state.chainRepsToEnd = value
        console.log("chainReps", state.chainRepsToEnd)
      },
      changeToneTuneIndex: (state, payload) => {
        //console.log("called changeToneTuneIndex")
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.change === 'increment') { scene.tracks[payload.index].toneTuneIndex++ }
        else if (payload.change === 'zero') { scene.tracks[payload.index].toneTuneIndex = 0 }
      },
      changeCycles: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.change === 'increment') { scene.tracks[payload.index].changeCycles++ }
        else if (payload.change === 'zero') { scene.tracks[payload.index].changeCycles = 0 }
      },

      // TRACK CONTROLS
      toggleSoundPanel: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[trackNumber].soundPanel = !scene.tracks[trackNumber].soundPanel
      },
      toggleTrackMute: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        let track= scene.tracks[trackNumber]
        if (!track.muted) {
          track.gainPreMute = track.gain
          track.gain = 0
          track.muted = true
        } else if (track.muted) {
          track.gain = track.gainPreMute
          track.muted = false
        }
      },
      updateChangeTotal: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].changeTotal = parseInt(payload.value, 10)
      },
      updateChangePer: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].changePer = parseInt(payload.value, 10)
      },
      updateTrackPitchPercent: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].pitchPercent = payload.value
      },
      rememberTune:(state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        let track = scene.tracks[trackNumber]
        let remembering = JSON.parse(JSON.stringify(track.tune))
        if (remembering[remembering.length-1].pitch === '_') { remembering.pop() }
        track.rememberedTune = remembering
      },
      tuneReturn: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        let track = scene.tracks[trackNumber]
        let remembered = JSON.parse(JSON.stringify(track.rememberedTune))
        if (trackNumber === scene.editingTrackNumber) {
          console.log(state)
          console.log(JSON.parse(JSON.stringify(state.endcap)))
          remembered.push(JSON.parse(JSON.stringify(state.endcap)))
        }
        track.tune = remembered
      },

      // TRACK SOUND PANEL
      changeTrackWave: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].waveType = payload.wave
      },
/*    updateTrackGain: (state, payload) => {  // don't think this is in use anymore...
        let scene = state.scenes[state.editingSceneNumber]
        let track = scene.tracks[payload.trackNumber]
        track.gain = payload.value
        console.log('muted?', track.muted)
        if (track.muted) { track.muted = false }
      },*/
      updateTrackSoundParams: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        let track = scene.tracks[payload.trackNumber]
        track[payload.param] = payload.value
        if (payload.param === 'gain' && track.muted) { track.muted = false }
      },
      changeTrackNoteDuration: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].noteDuration = payload.duration
      },

      // DRAGGABLE
      updateEditingTrackNumber: (state, indexOfEditingTrack) => {
        console.log('iOET', indexOfEditingTrack)
        state.scenes[state.editingSceneNumber].editingTrackNumber = indexOfEditingTrack
      },
      updateEnteredTracks: (state, tracks) => {
        let updatedTracks = []
        let scene = state.scenes[state.editingSceneNumber]
        updatedTracks.push(scene.tracks[0])
        scene.tracks = updatedTracks.concat(tracks)
      },
      setScenes: (state, scenes) => { // from play-n-tabs
        state.scenes = scenes
      },

      // TRACK EDITING
      changeEditingIndex: (state, change) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (change === 'increment') { scene.editingIndex++ }
        else if (change === 'decrement') { scene.editingIndex-- }
        else if (change === 'zero') { scene.editingIndex = 0 }
        else if (change === 'endcap') { scene.editingIndex = scene.tracks[scene.editingTrackNumber].tune.length-1 }
        else if (change === 'plusEight') {
          let newEditingIndex = scene.editingIndex + 8
          let endcap = scene.tracks[scene.editingTrackNumber].tune.length-1
          if (newEditingIndex >= endcap) { scene.editingIndex = endcap }
          else { scene.editingIndex = newEditingIndex }
        }
        else if (change === 'minusEight') {
          let newEditingIndex = scene.editingIndex - 8
          if (newEditingIndex <= 0) { scene.editingIndex = 0 }
          else { scene.editingIndex = newEditingIndex }
        }
        else if (change === 'adjust') {
          // seems like maybe this logic should be in the action?
          if (scene.editingIndex >= scene.tracks[scene.editingTrackNumber].tune.length) {
            scene.editingIndex = scene.tracks[scene.editingTrackNumber].tune.length-1
          }
        }   //console.log("cEI new editingIndex", state.editingIndex)
      },
      changeEditingTrackNumber: (state, change) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (change === 'increment') { scene.editingTrackNumber++ }
        else if (change === 'decrement') { scene.editingTrackNumber-- }
      },
      assignEditingTrackIdFromNumber: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.editingTrackId = scene.tracks[scene.editingTrackNumber].id
      },
      moveEndcap: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks.forEach( track => {
          if (track.tune.length > 0 && track.tune[track.tune.length-1].pitch === '_') { track.tune.pop() }
        })
        scene.tracks[scene.editingTrackNumber].tune.push( {pitch:"_",random:'fixed'} )
      },
      deleteNote: (state, change) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (change === 'fromEndcap') {
          if (scene.editingIndex > 0) {
            scene.tracks[scene.editingTrackNumber].tune.splice(scene.editingIndex-1, 1)
            scene.editingIndex--
          }
        } else if (change === 'currentNote') {
          scene.tracks[scene.editingTrackNumber].tune.splice(scene.editingIndex, 1);
        }
      },
      toggleNoteRandom: (state) => {
        let scene = state.scenes[state.editingSceneNumber]
        let noteRandomValue = scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random
        console.log("nrv", noteRandomValue)
        if (noteRandomValue === 'fixed') {
          scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random = 'noRests'
        } else if (noteRandomValue === 'noRests') {
          scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random = 'rests'
        } else if (noteRandomValue === 'rests') {
          console.log("in rests...")
          //noteRandomValue = 'fixed'  (why doesn't this work? I guess since it's a string it's a pass by value)
          scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random = 'fixed'
        }

      },  // random what?
      spliceNoteIntoTune: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[scene.editingTrackNumber].tune.splice(payload.start, payload.delete, payload.insert)
      },
      updateTrackNote: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        let tune = scene.tracks[scene.editingTrackNumber].tune
        tune[payload.index].pitch = payload.pitch
      },
      overwriteTrackTune: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].tune = payload.newTune
      },
      setTrackColorAlternation: (state, count) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[scene.editingTrackNumber].colorAlternation = count
        console.log("colorAlternation", scene.tracks[scene.editingTrackNumber].colorAlternation)
      },
      updateTrackLineBreaks: (state, trackLineBreaks) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[scene.editingTrackNumber].lineBreaks = trackLineBreaks
      },
      toggleHidePitches: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[trackNumber].hidePitches = !scene.tracks[trackNumber].hidePitches
      },

      // RANDOMIZING
      updateSelectedNotes: (state, note) => {
        let scene = state.scenes[state.editingSceneNumber]
        const noteIndex = scene.selectedNotes.indexOf(note);
        if (noteIndex === -1) { scene.selectedNotes.push(note) }
        else { scene.selectedNotes.splice(noteIndex, 1) }
      },
      updateSelectedMode: (state, modeInfo) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.selectedNotes = modeInfo.modePitches
        scene.lastMode = modeInfo.modeBase + '-' + modeInfo.modulation
      },
      updateSelectedLength: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.selectedLength = value
      },
      updateSelectedPitchPercent: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.selectedPitchPercent = value
      },
      writeNewTune: (state, tune) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[scene.editingTrackNumber].tune = tune
        scene.editingIndex = tune.length-1
      },
      adjustRange: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.range === 'high') {
          console.log("adjusting high")
          scene.tracks[payload.trackNumber].rangeHigh = payload.pitch
        } else if (payload.range === 'low'){
          console.log("adjusting low")
          scene.tracks[payload.trackNumber].rangeLow = payload.pitch
        }
      },
      changeTuneNote: (state, payload) => {
        //console.log("called changeTuneNote")
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackIndex].tune[payload.tuneIndex].pitch = payload.pitch
      },

      // SAVING & LOADING
      changeFileName: (state, fileName) => {
        state.fileName = fileName
        console.log(state.fileName)
      },
      changeLoadTarget: (state, loadTarget) => {
        state.loadTarget = loadTarget
      },
      load: state => {
        const retrievedState = JSON.parse( localStorage.getItem( state.loadTarget ) )
        // can you do this? https://vuejs.org/v2/guide/list.html
        for (var property in retrievedState) {
          state[property] = retrievedState[property]
        }
      },
      improvedLoad: (state, fileUpload) => {
        // https://www.reddit.com/r/vuejs/comments/8qmw3s/looking_for_advice_on_a_saveload_function_with/?st=jj7cs5mw&sh=21b2f617
        let retrievedState = {}
        if (fileUpload) {
          retrievedState = JSON.parse(fileUpload)
        } else {
          retrievedState = JSON.parse( localStorage.getItem( state.loadTarget ) )
        }
        let newStateBuilder = JSON.parse(JSON.stringify(STATEDEFAULTS))
        // properties of retrievedStatestate
        for (let retrievedProp in retrievedState) {
          if (!newStateBuilder.hasOwnProperty(retrievedProp)) { continue }
          else {

            // state objects
            if (typeof retrievedState[retrievedProp] === 'object' && !isArray(retrievedState[retrievedProp]) ) {
              let retrievedPropObj = retrievedState[retrievedProp]
              for (let retrievedPropObjKey in retrievedPropObj) {
                if (newStateBuilder[retrievedProp].hasOwnProperty(retrievedPropObjKey)) {
                  newStateBuilder[retrievedProp][retrievedPropObjKey] = retrievedPropObj[retrievedPropObjKey]
                }
              }

            // scenes array
            } else if (retrievedProp === 'scenes' || retrievedProp === 'sceneBench') {
              let scenesOrBenched = []
              let scenes = []
              if (retrievedProp === 'scenes') { scenesOrBenched = retrievedState.scenes }
              else if (retrievedProp === 'sceneBench') { scenesOrBenched = retrievedState.sceneBench }
              scenesOrBenched.forEach( (scene, index) => {
                let sceneObject = JSON.parse(JSON.stringify(newStateBuilder.newSceneDefaults))
                for (let sceneProp in scene){
                  if (!sceneObject.hasOwnProperty(sceneProp)) { continue }
                  // scene objects
                  else if (typeof sceneProp === 'object' && !sceneProp.isArray())  {
                    let scenePropObject = {}
                    for (let scenePropLevel2 in sceneProp) {
                      if (!sceneProp.hasOwnProperty(scenePropLevel2)){ continue }
                      else { scenePropObject[scenePropLevel2] = sceneProp[scenePropLevel2] }
                    }

                  // tracks
                  } else if (sceneProp === 'tracks') {
                    let tracks = []
                    scene.tracks.forEach( (track, index) => {
                      let trackObject = JSON.parse(JSON.stringify(newStateBuilder.newTrackDefaults))
                      for (let trackProp in track) {
                        if (!trackObject.hasOwnProperty(trackProp)) { continue }
                        else { trackObject[trackProp] = track[trackProp] }
                      }
                      tracks.push(trackObject)
                    })
                    sceneObject.tracks = tracks

                  // other scene properties
                  } else {
                    sceneObject[sceneProp] = scene[sceneProp]
                  }
                }
                scenes.push(sceneObject)
              })
              // scenes array is now built
              if (retrievedProp === 'scenes') { newStateBuilder.scenes = scenes }
              else if (retrievedProp === 'sceneBench') { newStateBuilder.sceneBench = scenes }

            // other properties on state
            } else {
              newStateBuilder[retrievedProp] = retrievedState[retrievedProp]
            }
          }
        }

        // all done, so update state:
        for (var property in newStateBuilder) {
          state[property] = newStateBuilder[property]
        }

        console.log('state',state)
      },
      loadScene: (state, scene) => {
        state.scenes.push(scene)
      },

    },

    actions: {

      // SCENE MANAGEMENT
       setUpNewScene: context => {
        const newScene = JSON.parse(JSON.stringify(context.state.newSceneDefaults))
        let sceneIdNumber = Math.random().toString().slice(2)
        newScene.id = sceneIdNumber
        let sceneTitle = randomElement(context.state.sceneTitles)
        newScene.title = sceneTitle
        //  let newTrack = JSON.parse(JSON.stringify(context.state.newTrackDefaults))
        //  let trackIdNumber = Math.random().toString().slice(2)
        //  newTrack.id = trackIdNumber
        newScene.tracks.push(context.getters.newTrack())
        newScene.editingTrackId = newScene.tracks[0].id
        newScene.leadTrackId = newScene.tracks[0].id
        context.commit('addNewScene', newScene)
        context.dispatch('initializeSceneAudio', context.state.scenes.length-1)
      },
/*      // this is a potential update to setUpNewScene with some tracks automatically
        setUpNewScene: context => {
        const newScene = JSON.parse(JSON.stringify(context.state.newSceneDefaults))
        let sceneIdNumber = Math.random().toString().slice(2)
        newScene.id = sceneIdNumber
        let sceneTitle = randomElement(context.state.sceneTitles)
        newScene.title = sceneTitle
        //  let newTrack = JSON.parse(JSON.stringify(context.state.newTrackDefaults))
        //  let trackIdNumber = Math.random().toString().slice(2)
        //  newTrack.id = trackIdNumber
        newScene.tracks.push(context.getters.newTrack())
        newScene.editingTrackId = newScene.tracks[0].id
        newScene.leadTrackId = newScene.tracks[0].id
        if (context.state.scenes.length > 0) {
          newScene.tracks.push(context.getters.newTrack())
          newScene.tracks.push(context.getters.newTrack())
          let tuneLengths = Math.round(Math.random()*14)+2
          let pitchSet = ['C3','D3','E3','F3','G3','A3','B3','C4']
          newScene.tracks[0].tune = makeTune(pitchSet, tuneLengths, 50, true)
          newScene.tracks[1].tune = makeTune(pitchSet, tuneLengths, 50, false)
          newScene.tracks[2].tune = makeTune(pitchSet, tuneLengths, 100, false)
        }
        context.commit('addNewScene', newScene)
        context.dispatch('initializeSceneAudio', context.state.scenes.length-1)
      },
      */
      updateSceneTitle: (context, title) => {
        context.commit('updateSceneTitle', title)
        context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },
  /*  updateLeadTrack: (context, value) => {
        // might need this in dispatch...?
        context.commit('updateLeadTrackNumber', value)
        context.commit('updateLeadTrackId', value)
      }, */
      setUpSceneChange: (context, change) => {
        console.log("change:", change)
        let changeToNumber = context.state.sceneChangeNumber  // this value isnt used...
        if (change === 'backward') {
          if (context.state.editingSceneNumber > 0) {
            changeToNumber = context.state.editingSceneNumber - 1
          } else if (context.state.editingSceneNumber === 0) {
            changeToNumber = context.state.scenes.length-1
          }
        } else if (change === 'forward') {
          if (context.state.editingSceneNumber < context.state.scenes.length-1 ) {
            changeToNumber = context.state.editingSceneNumber + 1
          } else {
            changeToNumber = 0
          }
        } else {
          changeToNumber = change
        }
        if (context.state.playing) {
          context.commit('setSceneChangeNumber', changeToNumber)
          if (!context.state.chain) {
            context.commit('setAdvanceTriggered', true)
          }
        } else {
          context.commit('setSceneChangeNumber', changeToNumber)
          context.commit('changeScene')
        }
      },
      initializeSceneAudio: (context, sceneNumber) => {
          let title = context.state.scenes[sceneNumber].title
          let sceneAudio = AM.scenes[title]
          for (let nodeList in sceneAudio){
            sceneAudio[nodeList].forEach( (nodeListItem, index) => {
              //nodeListItem.disconnect(Tone.Master) // good try, though.
              nodeListItem.dispose()
            })
          }
          AM.scenes[title] = { synths:[], autoFilters: [], gains:[], delays:[], distortions:[] } // https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
          context.state.scenes[sceneNumber].tracks.forEach( (track, tracksIndex) =>  {
            let trackSynth = new Tone.PolySynth(6, Tone.Synth, {
              "oscillator" : {
                  "type": "triangle",
              }
            })
            trackSynth.set({
      	      "oscillator" : {
                "type"     : track.waveType
              },
              "envelope"   : {
                "attack"   : track.attack ,
                "decay"    : track.decay,
                "sustain"  : track.sustain,
                "release"  : track.release,
              }
            })
            AM.scenes[title].synths.push(trackSynth)
            let autoFilter = new Tone.AutoFilter({
              frequency  : track.LFOFrequency,
              type  : track.LFOWaveType,
              depth  : track.LFODepth,
              baseFrequency  : track.filterBaseFrequency ,
              octaves  : track.LFOOctaves,
              filter  : {
                type  : track.filterType,
                rolloff  : track.filterRolloff,
                Q  : track.filterQ
              }
            })
            autoFilter.wet.value = track.filterWet
            AM.scenes[title].autoFilters.push(autoFilter)
            let distortion = new Tone.Distortion(track.distortion)
            AM.scenes[title].distortions.push(distortion)
            let delay = new Tone.FeedbackDelay(track.delayTime, track.delayFeedback)
            AM.scenes[title].delays.push(delay)
            let trackGain  = new Tone.Gain(track.gain)
            AM.scenes[title].gains.push(trackGain)

          })
          //AM.scenes[title].synths.forEach( (synth, i) => synth.toMaster() )
          AM.scenes[title].synths.forEach( (synth, i) => synth.connect(AM.scenes[title].autoFilters[i]) )
          AM.scenes[title].autoFilters.forEach( (autoFilter, i) => autoFilter.connect(AM.scenes[title].distortions[i]).start() )
          AM.scenes[title].distortions.forEach( (distortion, i) => {
            distortion.fan(AM.scenes[title].gains[i], AM.scenes[title].delays[i] )
            distortion.wet.value = 0
          })
          AM.scenes[title].delays.forEach( (delay, i) => delay.connect(AM.scenes[title].gains[i]) )
          AM.scenes[title].gains.forEach( (gain, i) => gain.toMaster() )

      },
      enterTrack: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let enteringTrack = JSON.parse(JSON.stringify(scene.tracks[0]))
        enteringTrack.tune.pop()
        console.log("enteringTrack.id", enteringTrack.id)
        //enteringTrack.id = Math.random().toString().slice(2)
        context.commit('addTrack', enteringTrack)
        context.commit('setUpNewTrack', context.getters.newTrack())
        context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },
      removeTrack: (context, removeTrackNumber) => {
        // console.log("removeTrackNumber", removeTrackNumber)
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.editingTrackNumber === removeTrackNumber ) {
          context.commit('changeEditingTrackNumber', 'decrement')
          context.commit('assignEditingTrackIdFromNumber')
          context.commit('moveEndcap')
        }
        if (scene.editingTrackNumber > removeTrackNumber) {
          context.commit('changeEditingTrackNumber', 'decrement')
        }
        context.commit('removeTrack', removeTrackNumber)
        context.commit('changeEditingIndex', 'adjust')
        context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },
      autoModulate: (context, onOrOff) => {
        console.log("in autoModulate")
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if ( onOrOff === 'on') {
          if  (scene.modulationStyle === 'drift' && ( scene.nextModulation === '' ||
               context.getters.selectedModulations.indexOf(scene.nextModulation.modulation) === -1  )) {
            // DRY re: morphSelectedNotes, toggleModulationStyle
            let type = randomElement(context.getters.selectedModulations)
            let modeInfo = pickMode(MODEDATA, type, scene.lastMode)
            console.log("automodulate modeInfo", modeInfo)
            context.commit('updateNextModulation', modeInfo)
          } else if (scene.modulationStyle === 'form') {
            console.log('automodulate form section...')
          }
        }
        context.commit('updateAutoModulate', onOrOff)
      },
      toggleAutoModulate: context => {
        // seemed like there was some good reason autoModulate accepted on/off rather than a toggle. What was it?
        // This is for the keyboard shortcut:
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.autoModulate === true) { context.dispatch('autoModulate', 'off') }
        else if (scene.autoModulate === false) { context.dispatch('autoModulate', 'on') }
      },
      toggleModulationStyle: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.modulationStyle === 'drift') {
          if (scene.harmonicForm.length === 0) {
            context.dispatch('buildHarmonicForm', '-a-b-a-c')
          }
          // a 'setUpForForm' action may be useful... is this procedure used somewhere else...
          let firstFormSection = referenceMode(MODEDATA, scene.harmonicForm[0])
          console.log('firstFormSection', firstFormSection)
          context.commit('updateNextModulation', firstFormSection)
          context.commit('updateModulationStyle', 'form')
        } else if (scene.modulationStyle === 'form'){
          context.commit('updateFormStep', 'off')
          // DRY re: morphSelectedNotes, autoModulate:
          console.log("next", scene.nextModulation)
          let type = randomElement(context.getters.selectedModulations)
          let modeInfo = pickMode(MODEDATA, type, scene.lastMode)
          context.commit('updateNextModulation', modeInfo)
          context.commit('updateModulationStyle', 'drift')
        }
      },
      modulatePerLeadChanges: (context, value) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        context.commit('updateModulatePerLeadChanges', value)
      },
      buildHarmonicForm: (context, value) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        //let harmonicPreForm = value.match(/((([c|d|f|g|a]#?|[b|e])\\)?([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr))|((([c|d|f|g|a]#?|[b|e])\\)?\([a-z]\))/gi)
        let harmonicPreForm = value.match(/((([c|d|f|g|a]#?|[b|e])\\)?([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr))|((([c|d|f|g|a]#?|[b|e])\\)?-[a-z])/gi)
        if (harmonicPreForm === null) { console.log("harmonicPreForm is null!"); return }
        console.log("preForm", harmonicPreForm)
        if (arraysEqual(harmonicPreForm, scene.harmonicForm)) { console.log('same'); return }

        // find all the -[a-z] and eliminate the duplicates
        let formLetters = []
        //let formToPickFinderArray = value.match(/\([a-z]\)/gi) // console.log('parensFinderArray', parensFinderArray)
        let formToPickFinderArray = value.match(/-[a-z]/gi) // console.log('parensFinderArray', parensFinderArray)
        if (formToPickFinderArray !== null) {
        let formToPickLettersArray = formToPickFinderArray.map(foundLetter => foundLetter.match(/[a-z]/i)[0] ) //console.log("parensStrippes", parensStrippedArray)
          formToPickLettersArray.forEach((letter, index)=>{
            if (formLetters.indexOf(letter)=== -1) { formLetters.push(letter) }
          })
        }
        console.log('formLetters',formLetters)
        // create a uniqe match for each letter
        let formLettersMatches = []        // https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
        while(formLettersMatches.length < formLetters.length){
            let preMatch = pickMode(MODEDATA, randomElement(context.getters.selectedModulations) )
            preMatch.modeBase = preMatch.modeBase.replace(/s/,'#')
            let match = preMatch.modeBase + preMatch.modulation
            if(formLettersMatches.indexOf(match) > -1) continue
            formLettersMatches[formLettersMatches.length] = match
        }
        console.log("formLetterMatches", formLettersMatches)
          // then combine those together onto an object
        let formLettersRef = {}
        formLetters.forEach((letter, index) => {
          formLettersRef[letter] = formLettersMatches[index]
        })
        console.log('formLettersRef', formLettersRef )

        // translate the pre-form into the form using that object
            // lower stuff below is redundant...
        let harmonicForm = []
        console.log('preForm', harmonicPreForm)
        harmonicPreForm.forEach( (section, index) => {
          let prefix = ''
          if (section.match(/([c|d|f|g|a]#?|[b|e])\\/i) !== null) {
            let prefixMatch = section.match(/([c|d|f|g|a]#?|[b|e])\\/i)
            prefix = ucFirst(prefixMatch[0])
          }
          let sectionMode = ''
          //if (section.match(/\([a-z]\)/i) !== null ) {
          if (section.match(/-[a-z]/i) !== null ) {
            //let letterSection = section.match(/\([a-z]\)/i)
            let letterSection = section.match(/-[a-z]/i)
            let formLetter = letterSection[0].match(/[a-z]/i)[0]
            sectionMode = formLettersRef[formLetter]
          } else if (section.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr)/i) !== null){
            let sectionPreMode = section.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr)/i)[0]
            sectionMode = ucFirst(sectionPreMode)
          }
          harmonicForm.push(prefix + sectionMode)
        })
        console.log("harmonicForm", harmonicForm)
        context.commit('updateHarmonicForm', harmonicForm)
      },
      rememberAllTunes: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        for (let i=0; i < scene.tracks.length; i++){
          context.commit('rememberTune', i)
        }
      },
      returnAllTunes: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        for (let i=0; i < scene.tracks.length; i++){
          context.commit('tuneReturn', i)
        }
      },
      toggleQwertyDisplay: context => {
        if (context.state.keyToQwertyDisplay === 'Rows-Octave'){
          context.commit('changeQwertyDisplay', 'Clusters')
        } else if (context.state.keyToQwertyDisplay === 'Clusters'){
          context.commit('changeQwertyDisplay', 'Rows-Octave')
        }
      },

      // TRACK EDITING
      changeEditingTrack: (context, change) => {
        if (change === 'increment') { context.commit('changeEditingTrackNumber', 'increment') }
        else if (change === 'decrement') { context.commit('changeEditingTrackNumber', 'decrement') }
        context.commit('assignEditingTrackIdFromNumber')
        context.commit('moveEndcap')
        context.commit('changeEditingIndex', 'adjust')
      },
      randomNote: (context, payload) => {
        console.log("payload", payload)
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let isRandom = (payload.random === 'check') ? scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random : payload.random
        const note = { pitch: payload.pitch, random: isRandom }
        if (payload.change === 'fromEndcap') {
          context.commit('spliceNoteIntoTune', { start:-1, delete:0, insert:note })
          context.commit('changeEditingIndex', 'increment')
        } else if (payload.change === 'currentNote') {
          if (context.state.editMode === 'insert') {
            context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:0, insert:note })
            context.commit('changeEditingIndex', 'increment')
          } else if (context.state.editMode === 'overwrite'){
            context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:1, insert:note })
          }
        } else if (payload.change === 'toggleNoteRandom'){
          context.commit('toggleNoteRandom') //, { start:context.state.editingIndex, delete:1, insert:note })
        }
        // DRY re: noteEntry
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', context.getters.toneTunes[context.getters.leadTrackNumber].length)
        }
      },
      noteEntry: (context, payload) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        const random = scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random
        const note = { pitch: payload.pitch, random:random }
        if (payload.change === 'fromEndcap') {
          context.commit('spliceNoteIntoTune', { start:-1, delete:0, insert:note })
          context.commit('changeEditingIndex', 'increment')
        } else if (payload.change === 'currentNote') {
          if (context.state.editMode === 'insert') {
            context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:0, insert:note })
            context.commit('changeEditingIndex', 'increment')
          } else if (context.state.editMode === 'overwrite'){
            context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:1, insert:note })
          }
        }
        // DRY re: randomNote
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', context.getters.toneTunes[context.getters.leadTrackNumber].length)
        }
      },
      deleteNote: (context, change) => {
        context.commit('deleteNote', change)
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', context.getters.toneTunes[context.getters.leadTrackNumber].length)
        }
      },
      noteShift: (context, shift) => {
        let scene= context.state.scenes[context.state.editingSceneNumber]
        // let track = scene.tracks[scene.editingTrackNumber]
        let tune = context.getters.toneTunes[scene.editingTrackNumber]
        let note = tune[scene.editingIndex]
        let newNote = {}
        const random = scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random
        if (note === 0 || note === undefined) { return }
        let noteArr = note.split('')  // this business would probably be easier with string.slice
        if ( (noteArr[1] === "#" && noteArr.length === 4) || (noteArr[1] !== "#" && noteArr.length === 3) ) { return }
        if (noteArr[1] === "#") { noteArr[0] = noteArr[0]+'#'; noteArr.splice(1,1) }
        let octave = ''
        if (shift === 'octave-up') {
          let noteArrNum = noteArr[1]
          octave = parseInt(noteArrNum, 10)
          octave++
          if (context.getters.pitchSetFullRange.indexOf(noteArr[0]+octave) === -1) { return }
          else { newNote = { pitch: noteArr[0]+octave, random:random } }
        } else if (shift === 'octave-down') {
          let noteArrNum = noteArr[1]
          octave = parseInt(noteArrNum, 10)
          octave--
          if (context.getters.pitchSetFullRange.indexOf(noteArr[0]+octave) === -1) { return }
          else { newNote = { pitch: noteArr[0]+octave, random:random } }
        } else if (shift === 'pitchSetFullRange-up') {
          let noteIndex = context.getters.pitchSetFullRange.indexOf(note)
          noteIndex++
          let newPitch
          if (context.getters.pitchSetFullRange[noteIndex] === undefined) { return }
          else { newPitch = context.getters.pitchSetFullRange[noteIndex] }
          newNote = { pitch: newPitch, random:random }
        } else if (shift === "pitchSetFullRange-down") {
          let noteIndex = context.getters.pitchSetFullRange.indexOf(note)
          noteIndex--
          let newPitch
          if (context.getters.pitchSetFullRange[noteIndex] === undefined) { return }
          else { newPitch = context.getters.pitchSetFullRange[noteIndex] }
          newNote = { pitch: newPitch, random:random }
        }
        context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:1, insert:newNote })
      },
      trackOctaveShift: (context, shift) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let track = scene.tracks[scene.editingTrackNumber]
        track.tune.forEach( (note, index) => {
          if (note.pitch === ' ' || note.pitch === '_') { return }
          let pitch
          let endParsed = parseInt(note.pitch.slice(-2), 10)
          if (!isNaN(endParsed)) {
            pitch = note.pitch.slice(0, -2)
          } else {
            endParsed = parseInt(note.pitch.slice(-1), 10)
            pitch = note.pitch.slice(0,-1)
          }
          if (shift === 'down') { endParsed-- }
          else if (shift === 'up') { endParsed++ }
          let newPitch = pitch+endParsed
          context.commit('updateTrackNote', { index: index, pitch: newPitch })
        })
        let highRangeSplit = naturalSplit(track.rangeHigh)
        let lowRangeSplit = naturalSplit(track.rangeLow)
        if (shift==='up' && context.state.fullRange.indexOf(track.rangeHigh) < 73){
          let newRangeHigh = highRangeSplit[0]+(highRangeSplit[1]+1)
          let newRangeLow = lowRangeSplit[0]+(lowRangeSplit[1]+1)
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'high', pitch: newRangeHigh })
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'low', pitch: newRangeLow })
        }
        if (shift==='down' && context.state.fullRange.indexOf(track.rangeLow) > 11){
          let newRangeHigh = highRangeSplit[0]+(highRangeSplit[1]-1)
          let newRangeLow = lowRangeSplit[0]+(lowRangeSplit[1]-1)
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'low', pitch: newRangeLow })
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'high', pitch: newRangeHigh })
        }
      },
      doubleTune: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let originalTune = JSON.parse(JSON.stringify(scene.tracks[scene.editingTrackNumber].tune))
        originalTune.splice(-1,1)
        let double = JSON.parse(JSON.stringify(originalTune))
        let doubledTune = originalTune.concat(double)
        doubledTune.push({ pitch:'_', random:'fixed' })
        context.commit('overwriteTrackTune', { trackNumber: scene.editingTrackNumber, newTune: doubledTune })
      },
      spreadTune: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let originalTune = JSON.parse(JSON.stringify(scene.tracks[scene.editingTrackNumber].tune))
        originalTune.splice(-1,1)
        let newTune = []
        for (let i=0; i < originalTune.length; i++){
          newTune.push(originalTune[i])
          newTune.push({ pitch:' ', random: 'fixed'})
        }
        newTune.push({ pitch:'_', random:'fixed' })
        context.commit('overwriteTrackTune', { trackNumber: scene.editingTrackNumber, newTune: newTune })
      },
      getTrackGroupings: context => {
        const promptData = prompt("Enter track line lengths, separated by spaces:")
        let trackLines = promptData.split(' ')
        for (let i=0; i<trackLines.length; i++) {
          if (isNaN(parseInt(trackLines[i], 10))) {
            return
          } else {
            trackLines[i] = parseInt(trackLines[i], 10)
          }
        }
        console.log("trackLines", trackLines)
        let trackLineBreaks = trackLines.map( (val, index, arr) => {
          let j=0
          for (let k=0; k<=index; k++) { j+= arr[k] }
          return j
        })
        console.log("trackLineBreaks", trackLineBreaks)
        context.commit('updateTrackLineBreaks', trackLineBreaks )
      },

      // TRACK CONTROLS
      changeTrackWave: (context, payload) => {
        context.commit('changeTrackWave', payload)
        AM.scenes[context.getters.activeSceneTitle].synths[payload.trackNumber].set({
           "oscillator": { "type": payload.wave }
        })
      },
      setTrackAMSoundParams: (context, payload) => {
        console.log(payload)
        switch (payload.param){
          case 'gain':
            AM.scenes[payload.sceneTitle].gains[payload.trackNumber].gain.value = payload.value
            break
          case 'delayTime':
            AM.scenes[payload.sceneTitle].delays[payload.trackNumber].delayTime.value = payload.value
            break
          case 'delayFeedback':
            AM.scenes[payload.sceneTitle].delays[payload.trackNumber].feedback.value = payload.value
            break
          case 'distortion':
            AM.scenes[payload.sceneTitle].distortions[payload.trackNumber].distortion = payload.value
            break
          case 'attack':
            AM.scenes[payload.sceneTitle].synths[payload.trackNumber].set({ 'envelope': { attack: payload.value } })
            break
          case 'decay':
            AM.scenes[payload.sceneTitle].synths[payload.trackNumber].set({ 'envelope': { decay: payload.value } })
            break
          case 'sustain':
            AM.scenes[payload.sceneTitle].synths[payload.trackNumber].set({ 'envelope': { sustain: payload.value } })
            break
          case 'release':
            AM.scenes[payload.sceneTitle].synths[payload.trackNumber].set({ 'envelope': { release: payload.value } })
            break


          case 'filterWet':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].wet.value = payload.value
            break
          case 'filterType':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].filter.type = payload.value
            break
          case 'filterRolloff':
            let rolloff = parseInt(payload.value, 10)
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].filter.rolloff = payload.value
            break
          case 'filterBaseFrequency':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].baseFrequency = payload.value
            break
          case 'filterQ':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].filter.Q.value = payload.value
            break
          case 'LFOWaveType':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].type = payload.value
            break
          case 'LFOFrequency':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].frequency.value = payload.value
            console.log(AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].frequency.value)
            break
          case 'LFODepth':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].depth.value = payload.value
            console.log(AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].depth.value = payload.value)
            break
          case 'LFOOctaves':
            AM.scenes[payload.sceneTitle].autoFilters[payload.trackNumber].octaves = payload.value
            break


        }
        //context.commit('updateTrackSoundParams', { param: payload.param, trackNumber: payload.trackNumber, value: payload.value })
      },
      updateTrackSoundParams: (context, payload) => {
        context.dispatch('setTrackAMSoundParams',  { param: payload.param, sceneTitle: context.getters.activeSceneTitle, trackNumber: payload.trackNumber, value: payload.value } )
        context.commit('updateTrackSoundParams', { param: payload.param, trackNumber: payload.trackNumber, value: payload.value })
      },
      toggleTrackMute: (context, trackNumber) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let track = scene.tracks[trackNumber]
        if (!track.muted) {
          AM.scenes[context.getters.activeSceneTitle].gains[trackNumber].gain.value = 0
        } else if (track.muted) {
          AM.scenes[context.getters.activeSceneTitle].gains[trackNumber].gain.value = track.gainPreMute
        }
        context.commit('toggleTrackMute', trackNumber)
      },

      // DRAGGABLE
      setEnteredTracks: (context, enteredTracks) => {
          //console.log("set: enteredTracks", enteredTracks)
          //let editingTrackId = context.state.tracks[context.state.editingTrackNumber].id // console.log("editingTrackID", editingTrackID)
          context.commit('updateEnteredTracks', enteredTracks)
          let indexOfEditingTrack = ''
          let scene = context.state.scenes[context.state.editingSceneNumber]
          scene.tracks.forEach( (track, index) => {
            if (track.id === scene.editingTrackId) { indexOfEditingTrack = index }
          })
          context.commit('updateEditingTrackNumber', indexOfEditingTrack)
          context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },

      // RANDOMIZING
      fill: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let track = scene.tracks[scene.editingTrackNumber]
        let filledTune = [{ pitch: randomElement(context.getters.pitchSets[scene.editingTrackNumber]), random:'noRests' }]
        for (let i=1; i < scene.selectedLength; i++){
          if (Math.random()*100 < track.pitchPercent){    //if (Math.random()*100 < scene.selectedPitchPercent){
            filledTune.push({ pitch: randomElement(context.getters.pitchSets[scene.editingTrackNumber]), random: 'noRests' })
          } else {
            filledTune.push({ pitch: ' ', random: 'rests' })
          }
        }
        filledTune.push({ pitch: '_', random: 'fixed' })
        // hmmm, how does endcap affect things?
        context.commit('writeNewTune', filledTune)
        let formSection = scene.harmonicForm[scene.formStep]
        if ( formSection !== undefined && formSection.match(/([c|d|f|g|a]#?|[b|e])\\/i) !== null) {
          context.dispatch('updateTuneWithPrefix', {trackIndex: scene.editingTrackNumber, formSection: formSection})
        }
      },
      distribute: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let track = scene.tracks[scene.editingTrackNumber]
        let pitchSet = context.getters.pitchSets[scene.editingTrackNumber].slice(0)
        shuffle(pitchSet)  // ; console.log("before:",context.getters.pitchSets[context.state.editingTrackNumber]) ;console.log("after:", pitchSet)
        let distributedTune = [{ pitch: pitchSet[0], random:'noRests' }]
        let i = 1
        while (i < pitchSet.length){
          if (Math.random()*100 < track.pitchPercent){ //if (Math.random()*100 < scene.selectedPitchPercent){
            //distributedTune.push({ pitch: pitchSet[i], random: true })
            distributedTune.push({ pitch: pitchSet[i], random: 'rests' })
            i++
          } else {
            //distributedTune.push({ pitch: ' ', random: true })
            distributedTune.push({ pitch: ' ', random: 'rests' })
          }
        }
        distributedTune.push({ pitch: '_', random: 'fixed' })
        // endcap again...
        context.commit('writeNewTune', distributedTune)
        let formSection = scene.harmonicForm[scene.formStep]
        if ( formSection !== undefined && formSection.match(/([c|d|f|g|a]#?|[b|e])\\/i) !== null) {
          context.dispatch('updateTuneWithPrefix', {trackIndex: scene.editingTrackNumber, formSection: formSection})
        }
      },
      changeTune: (context, payload)  => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let track = scene.tracks[payload.trackIndex]
        let changeableNoteIndexes = []
        let pitchSet = context.getters.pitchSets[payload.trackIndex]
        track.tune.forEach( (note, index) => {
          if ( (note.random === 'rests' || note.random === 'noRests') && note.pitch != '_') { changeableNoteIndexes.push(index) }
        })
        shuffle(changeableNoteIndexes)
        let changeTotal = payload.all ? context.getters.maxChangeables[payload.trackIndex] : track.changeTotal
        for (let i=0; i < changeTotal; i++) {
          let prevPitch = track.tune[changeableNoteIndexes[i]].pitch
          let newPitch = ''
          do {
            newPitch = randomElement(pitchSet)
          } while (newPitch === prevPitch)
          if (track.tune[changeableNoteIndexes[i]].random === 'rests' &&  Math.random()*100 > track.pitchPercent) { newPitch = ' ' }  // why is this after the doWhile? shouldn't this be first and doWhile be in an else?
          context.commit('changeTuneNote', {
            trackIndex: payload.trackIndex,
            tuneIndex: changeableNoteIndexes[i],
            pitch: newPitch
          } )
        }
        if (scene.filterPitchesOnChange && payload.trackIndex === context.getters.leadTrackNumber){
          scene.tracks.forEach( (track, index) => {
            let filteredTune = filterTrackTunePitches(track.tune, context.getters.pitchSets[index])
            context.commit('overwriteTrackTune', { trackNumber: index, newTune: filteredTune  })
          })
        }
        let formSection = scene.harmonicForm[scene.formStep]
        if ( formSection !== undefined && formSection.match(/([c|d|f|g|a]#?|[b|e])\\/i) !== null) {
          context.dispatch('updateTuneWithPrefix', {trackIndex: payload.trackIndex, formSection: formSection})
        }
      },
      updateTuneWithPrefix: (context, payload) => {
        let pitchSet = context.getters.pitchSets[payload.trackIndex]
        let formSectionPrefix = payload.formSection.match(/([c|d|f|g|a]#?|[b|e])\\/i)[0]
        let rootPitch = formSectionPrefix.match(/[c|d|f|g|a]#?|[b|e]/i)[0]
        console.log('root', rootPitch)
        let newPitch = pitchSet.find( pitch => {
          return pitch.slice(0, -1) === rootPitch
        })
        console.log('newPitch', newPitch)
        context.commit('changeTuneNote', {
          trackIndex: payload.trackIndex,
          tuneIndex: 0,
          pitch: newPitch, // 'C4'
        })
      },
      changeAll: (context) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        scene.tracks.forEach( (track, index) => {
          context.dispatch('changeTune', { trackIndex: index, all: true })
        })
      },
      morphSelectedNotes: (context, userCalled) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.autoModulate || scene.modulationStyle === 'form') {
          if (scene.modulationStyle === 'drift') {
            if (!userCalled){
              console.log('scene.nextModulation', scene.nextModulation)
              context.commit('updateSelectedMode', scene.nextModulation)
            }
            // DRY re: autoModulate & toggleModulationStyle
            let type = randomElement(context.getters.selectedModulations)
            console.log('type',type)
            let nextModeInfo = pickMode(MODEDATA, type, scene.lastMode)
            console.log('nextModeInfo', nextModeInfo)
            context.commit('updateNextModulation', nextModeInfo)
          } else if (scene.modulationStyle === 'form') {
            context.commit('updateSelectedMode', scene.nextModulation)
            //console.log('pre advance formStep', scene.formStep)
            context.commit('updateFormStep', 'advance')
            //console.log('post advance formStep', scene.formStep)
            let nextFormSection = (scene.formStep < scene.harmonicForm.length-1)  ? scene.harmonicForm[scene.formStep+1] : scene.harmonicForm[0]
            //console.log('nextFormSection', nextFormSection)
            let nextFormSectionSansPrefix = nextFormSection.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr)/i)[0]
            //console.log(nextFormSectionSansPrefix)
            let nextModeInfo = referenceMode(MODEDATA, nextFormSectionSansPrefix)
            //console.log(nextModeInfo)
            context.commit('updateNextModulation', nextModeInfo)
          }
        } else {
          let type = randomElement(context.getters.selectedModulations)
          let newModeInfo = pickMode(MODEDATA, type, scene.lastMode)
          context.commit('updateSelectedMode', newModeInfo)
        }
      },

      // SAVING & LOADING
      save: context => {
        const promptData = prompt("Save this file as:", context.state.fileName)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const fileNameKey = 'TF3_'+fileName
          context.commit('changeFileName', fileName)
          context.commit('changeLoadTarget', fileNameKey)
    	    localStorage.setItem( fileNameKey, JSON.stringify(context.state) )
        }
    	},
      saveScene: context => {
        const promptData = prompt("Save this scene as:", context.getters.activeSceneTitle)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const sceneNameKey = 'TF3S_'+fileName
          //context.commit('changeLoadTarget', fileNameKey)
    	    localStorage.setItem( sceneNameKey, JSON.stringify(context.state) )
        }
    	},
      load: (context, loadData) => {
        console.log(loadData)
        context.commit('improvedLoad', loadData)

        context.state.scenes.forEach( (scene, index) => {
          context.dispatch('initializeSceneAudio', index)
        })
        bus.$emit('updatePlayerStuff')
        // are there other things beside BPM that need updating on load?
        Tone.Transport.bpm.value = context.state.scenes[context.state.editingSceneNumber].bpm;
      },
      download: context => {
        const promptData = prompt("Download this file as:", context.state.fileName)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const exportObj = JSON.stringify(context.state)
          downloadObjectAsJson(exportObj, fileName)
        }
    	},


    } // end actions


});



/*
https://www.reddit.com/r/vuejs/comments/8amgdm/use_of_vuex_storewatch/?st=jfq3tuy2&sh=37e04478

https://forum.vuejs.org/t/watch-vuex-state-from-outside-components/22455
store.watch( state => state.someproperty, (newValue, oldValue) => {
// do stuff
})
Example:
store.watch( state => state.tracks[0].tune[0].pitch, (newValue, oldValue) => {
  console.log("newValue", newValue)
  console.log("oldValue", oldValue)
})

*/

// Vuex Modules
// https://codeburst.io/dynamic-modules-with-vuex-and-vue-b9c481ca792
// https://vueschool.io/courses/vuex-for-everyone
// https://www.reddit.com/r/vuejs/comments/8rw4vf/best_practices_for_breaking_down_complex_vuex/?st=jim459gc&sh=c6313b4c

// CHROME BUG
// https://stackoverflow.com/questions/50034680/very-strange-console-log-behavior-in-vuex-actions
// https://www.reddit.com/r/vuejs/comments/8eztxv/very_strange_consolelog_behavior_in_vuex_action/?st=jggn1dje&sh=1ab5bca4


// STORE.watch
// https://forum.vuejs.org/t/correct-way-to-use-store-watch-in-vuex/1800
// https://codepen.io/CodinCat/pen/PpNvYr
// https://github.com/vuejs/vuex/issues/1141

// LOCALSTORAGE
// https://forum.vuejs.org/t/vuex-replace-state-with-api-initial-state/3390
// https://www.reddit.com/r/vuejs/comments/88ngm3/persistence_with_vuex_local_storage/?st=jfg7uimh&sh=8e694921
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
// https://www.mikestreety.co.uk/blog/vue-js-using-localstorage-with-the-vuex-store
// this one -> https://stackoverflow.com/questions/8419354/get-html5-localstorage-keys
