import Vue from 'vue';
import Vuex from 'vuex';
import {AudioManager as AM} from "../AudioManager"
import {modeData as MODEDATA} from "../modeData"
import {stateDefaults as STATEDEFAULTS} from "./stateDefaults"
import {sceneTitles as SCENETITLES} from "./stateDefaults"
import {fullRange as FULLRANGE} from "./stateDefaults"
let stateDefaultsParsed = JSON.parse(JSON.stringify(STATEDEFAULTS))
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
    			for (let i=0; i < FULLRANGE.length; i++){
    				if(FULLRANGE[i] === track.rangeLow){ adjustedRangeLow = FULLRANGE.slice(i) }
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
        for (let i=0; i < FULLRANGE.length; i++) {
          if (scene.selectedNotes.indexOf(FULLRANGE[i].slice(0,-1)) > -1) {
            pitchSetFullRange.push(FULLRANGE[i])
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
        switch (state.playerParams.keyToQwertyDisplay){
          case 'Rows-Octave':
            keyToQwerty = state.keyToQwertyValRowsOctave
            break
          case 'Rows-Fifth':
            keyToQwerty = state.keyToQwertyValRowsFifth
            break
          case 'Clusters':
            keyToQwerty = state.keyToQwertyValClusters
            break
        }
        //keyToQwerty = state.keyToQwertyVal
        let qwertyVals = {" ":" "}
        for (const key in keyToQwerty) {
          if (keyToQwerty[key] === "") {
            qwertyVals[key] = ""
          } else {
            let suffix = keyToQwerty[key].slice(-3)
            let val = keyToQwerty[key].slice(0, -3)
            if (suffix === "-Lo") {
              qwertyVals[key] = val + state.playerParams.qwertyOctave
            }
            else if (suffix === "-Hi") {
              qwertyVals[key] = val + (state.playerParams.qwertyOctave+1)
            }
            else if (suffix === "-Hx") {
              qwertyVals[key] = val + (state.playerParams.qwertyOctave+2)
            }
          }
        }
        if (state.activeRegion === 'tune-entry') {
          qwertyVals['Backspace'] = 'Delete'
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
        if (change ==="increment") { state.playerParams.qwertyOctave++ }
        else if (change ==="decrement") { state.playerParams.qwertyOctave-- }
      },
      changeQwertyDisplay: (state, value) => {
        state.playerParams.keyToQwertyDisplay = value
      },
      changePlayerInstrumentType: (state, instrumentType) => {
        state.playerParams.instrumentType = instrumentType
      },
      changePlayerWaveType: (state, waveType) => {
        state.playerParams.waveType = waveType
      },
      changePlayerSampleType: (state, sampleType) => {
        state.playerParams.sampleType = sampleType
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
      updatePlayerParam: (state, payload) => {
        if (payload.value === '' || (typeof payload.value === 'string' && payload.value.slice(0,1) === '.') ) { return }
        switch(payload.param) {
          // Param Basics
          case 'gain':
            state.playerParams.gain = payload.value
            break
          case 'attack':
            state.playerParams.attack = payload.value
            break
          case 'decay':
            state.playerParams.decay = payload.value
            break
          case 'sustain':
            state.playerParams.sustain = payload.value
            break
          case 'release':
            state.playerParams.release = payload.value
            break
          case 'portamento':
            state.playerParams.portamento = payload.value
            break
          case 'harmonicity':
            state.playerParams.harmonicity = payload.value
            break
          case 'modulationType':
            state.playerParams.modulationType = payload.value
            break
          case 'modulationIndex':
            state.playerParams.modulationIndex = payload.value
            break
          case 'count':
            state.playerParams.count = payload.value
            break
          case 'spread':
            state.playerParams.spread = payload.value
            break
          case 'modulationFrequency':
            state.playerParams.modulationFrequency = payload.value
            break

          // Param Effects
          case 'delayTime':
            state.playerParams.delayTime = payload.value
            break
          case 'delayFeedback':
            state.playerParams.delayFeedback = payload.value
            break
          case 'distortion':
            state.playerParams.distortion = payload.value
            break
          case 'filterWet':
            state.playerParams.filterWet = payload.value
            break
          case 'filterType':
            state.playerParams.filterType = payload.value
            break
          case 'filterRolloff':
            let rolloff = parseInt(payload.value, 10)
            state.playerParams.filterRolloff = rolloff
            break
          case 'filterBaseFrequency':
            state.playerParams.filterBaseFrequency = payload.value
            break
          case 'filterQ':
            state.playerParams.filterQ = payload.value
            break
          case 'LFOWaveType':
            state.playerParams.LFOWaveType = payload.value
            break
          case 'LFOFrequency':
            state.playerParams.LFOFrequency = payload.value
            break
          case 'LFODepth':
            state.playerParams.LFODepth = payload.value
            break
          case 'LFOOctaves':
            state.playerParams.LFOOctaves = payload.value
            break
        }
      },
      assignPlayerParamSetting: (state, settingIndex) => {
        if (state.playerParamSettings[settingIndex].assigned){
          const check = confirm("Update Settings #"+settingIndex+"?")
          if (check === false){ return }
        }
        const settings = JSON.parse(JSON.stringify(state.playerParams))
        Vue.set(state.playerParamSettings, settingIndex, settings)
      },
      activatePlayerParamSettings: (state, settingIndex) => {
        if (settingIndex === 'default'){ settingIndex = 0 }
        console.log('settingIndex', settingIndex)
        if (state.playerParamSettings[settingIndex].assigned === true){
          const settings = JSON.parse(JSON.stringify(state.playerParamSettings[settingIndex]))
          state.playerParams = settings
          // note that watchers will likely automatically respond to that, so $emit may be redundant...?
          //bus.$emit('updatePlayerStuff')
        }
        state.playerParamCurrent = settingIndex
      },

      // SCENE MANAGEMENT
      setSceneChangeIncrementType: (state, increment) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.sceneChangeIncrement = increment
        console.log('sceneChangeIncrement', scene.sceneChangeIncrement)
      },
      changechainIncrement: (state, change) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (change === "increment") { scene.chainIncrement++ }
        else if (change === "zero") { scene.chainIncrement = 0 }
      },
      changeScene: (state) => {
        state.editingSceneNumber = state.sceneChangeNumber
        let scene = state.scenes[state.editingSceneNumber]
        Tone.Transport.bpm.value = scene.bpm
      },
      changeTempo: (state, e) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.bpm = e.target.value.toString()
        Tone.Transport.bpm.value = scene.bpm
      },
      deleteScene: (state, sceneId) => {
        state.sceneBench.forEach( (scene, index) => {
          if (scene.id === sceneId) {
            state.sceneBench.splice(index, 1)
          }
        })
      },
      setSceneAdvanceCued: (state, bool) => {
        bool === true? state.sceneAdvanceCued = true : state.sceneAdvanceCued = false
      },
      setSceneAdvanceTriggered: (state, bool) => {
        bool === true? state.sceneAdvanceTriggered = true : state.sceneAdvanceTriggered = false
      },
      moveScene: (state, payload) => {   // "benchScene" is a better title
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
            console.log("editing # pre", state.editingSceneNumber) // editingSceneId
            let editingSceneId = state.scenes[state.editingSceneNumber].id
            state.scenes.splice(movingSceneIndex, 1)
            state.sceneBench.push(movingScene)
            state.scenes.forEach( (scene, index) => {
              if (scene.id === editingSceneId) {
                state.editingSceneNumber = index
              }
            })
            console.log("editing # post", state.editingSceneNumber)
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
      },
      resetScene: (state) => {
        let scene = state.scenes[state.editingSceneNumber]
        // editingTrackNumber, editingTrackId, editingIndex - all left alone
        scene.chainIncrement = 0
        scene.tracks.forEach( (track, index) => {
          track.toneTuneIndex = 0
          track.changeCycles = 0
          track.changeTriggered = false
        })
        scene.started = false
        scene.modulationCycles = 0
        scene.modulationTriggered = false
        state.sceneAdvanceTriggered = false
        // ?scene.formStep = 0 // scene.formStep = 1 ?
      },
      setSceneChangeNumber: (state, change) => {
        state.sceneChangeNumber = change
      },
      startScene: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.started = true
      },
      toggleEditingForm: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.editingForm = !scene.editingForm
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
      updateAutoModulate: (state, onOrOff) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (onOrOff === 'on') { scene.autoModulate = true }
        else if (onOrOff === 'off') { scene.autoModulate = false }
      },
      updateChainAdvancePer: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.chainAdvancePer = value
      },
      updateFormStep: (state, update) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (update === 'zero'){
          scene.formStep = 0
        } else if (update === 'increment') {
          scene.formStep++
        } else if (update === 'off') {
          scene.formStep = -1
        }
        console.log('formStep after update', scene.formStep)
      },
      /*
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
      */
      updateHarmonicForm: (state, harmonicForm) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.harmonicForm = harmonicForm
      },
      updateSceneTitle: (state, title) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.title = title
      },
      updateLeadTrack: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.leadTrackId = scene.tracks[value].id
      },
      updateModulationCycles: (state, update) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (update === 'increment') { scene.modulationCycles++ }
        else if (update === 'zero') { scene.modulationCycles = 0 }
      },
      updateModulatePerLeadChanges: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulatePerLeadChanges = value
      },
      updateModulationWeights: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.value === 'increment') {
          scene.modulationWeights[payload.modulationType]++
        } else {
        scene.modulationWeights[payload.modulationType] = payload.value
        }
      },
      updateModulationStyle: (state, style) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulationStyle = style
      },
      updateNextModulation: (state, modulation) => {
        let scene = state.scenes[state.editingSceneNumber]
        //console.log("mod", modulation)
        scene.nextModulation = modulation
      },
      updateEditingSceneId: (state, sceneId) => {
        if (sceneId) { state.editingSceneId = sceneId }
        else { state.editingSceneId = state.scenes[state.editingSceneNumber].id }
      },
      toggleResetRememberedOnSceneChange: state => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.resetRememberedOnSceneChange = !scene.resetRememberedOnSceneChange
        console.log('rrosc', scene.resetRememberedOnSceneChange)
      },
      updateLoadQwertySettingOnSceneChange: (state, setting) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.loadQwertySettingOnSceneChange = setting
      },

      // INITIALIZE, ADD & REMOVE
      addNewScene: ( state, newScene ) => {
        state.scenes.push(newScene)
        // state.editingSceneId = newScene.id // let's not do that...
      },
      addTrack: (state, track) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks.push(track)
      },
      removeTrack: (state, trackNumber) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks.splice(trackNumber, 1)
      },

      // GENERAL PLAY & ENTRY
      updateSleepSetting: (state, value) => {
        state.sleepSetting = value
      },
      updateStartTime: (state, value) => {
        state.startTime = value
      },
      updateCurrentTime: (state, value) => {
        state.currentTime = value
      },
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
        console.log('new activeReg', state.activeRegion)
      },
      changePreviousRegion: (state, region) => {
        console.log('cPR', region)
        state.previousRegion = region
        console.log('new prevReg', state.previousRegion)
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
      toggleTrackChangeTriggered: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.index].changeTriggered = payload.bool
      },
      changeCycles: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.change === 'increment') { scene.tracks[payload.index].changeCycles++ }
        else if (payload.change === 'zero') { scene.tracks[payload.index].changeCycles = 0 }
      },
      toggleModulationTriggered: (state, bool) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.modulationTriggered = bool
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
      updateTrackSoundParams: (state, payload) => {
        console.log('uTSP commit payload', payload)
        let sceneNumber = payload.sceneNumber ? payload.sceneNumber : state.editingSceneNumber
        let scene = state.scenes[sceneNumber]
        console.log('scene.title', scene.title)
        console.log('scene.tracks', scene.tracks)
        let track = scene.tracks[payload.trackNumber]
        console.log('track', track)
        track[payload.param] = payload.value
        if (payload.param === 'gain' && track.muted) { track.muted = false }
      },
      changeTrackNoteDuration: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].noteDuration = payload.duration
      },
      toggleTrackDelay: (state, trackNumber) => {
        // would be cool if there were some way (other than disposing of the delay node, which seems inconvenient) to stop the delay entirely so that on resume there is no residual echo
        let scene = state.scenes[state.editingSceneNumber]
        let track = scene.tracks[trackNumber]
        if (track.delayActive === true) {
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].disconnect()
          AM.scenes[scene.title].delays[scene.editingTrackNumber].wet.value = 0
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].delayTime.value = 0
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].feedback.value = 0
          track.delayActive = false
        } else {
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].connect(AM.scenes[scene.title].gains[scene.editingTrackNumber])
          AM.scenes[scene.title].delays[scene.editingTrackNumber].wet.value = 1
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].delayTime.value = track.delayTime
          //AM.scenes[scene.title].delays[scene.editingTrackNumber].feedback.value = track.delayFeedback
          track.delayActive = true
        }
      },

      // DRAGGABLE
      updateTracks: (state, tracks) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks = tracks
      },
      updateEditingTrackNumber: (state, indexOfEditingTrack) => {
        console.log('iOET', indexOfEditingTrack)
        state.scenes[state.editingSceneNumber].editingTrackNumber = indexOfEditingTrack
      },
      dragScene: (state, scenes) => { // from play-n-tabs
        let editingSceneId = state.editingSceneId
        state.scenes = scenes
        state.scenes.forEach( (scene, index) => {
          if (scene.id === editingSceneId) { state.editingSceneNumber = index }
        })
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
      deleteNote: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[payload.trackNumber].tune.splice(payload.noteIndex, 1)
      },
      toggleNoteRandom: (state) => {  // random what?
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
      },
      spliceNoteIntoTune: (state, payload) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (payload.trackIndex || payload.trackIndex === 0){
          console.log(scene.tracks[payload.trackIndex].tune)
          scene.tracks[payload.trackIndex].tune.splice(payload.start, payload.delete, payload.insert)
        } else {
          scene.tracks[scene.editingTrackNumber].tune.splice(payload.start, payload.delete, payload.insert)
        }
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
        else {
          if (scene.selectedNotes.length > 1)
          scene.selectedNotes.splice(noteIndex, 1)
        }
      },
      updateSelectedMode: (state, modeInfo) => {
        let scene = state.scenes[state.editingSceneNumber]
        //console.log('modeInfo', modeInfo)
        scene.selectedNotes = modeInfo.modePitches
        scene.lastMode = modeInfo.modeBase + '-' + modeInfo.modulation
      },
      updateSelectedLength: (state, value) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.selectedLength = value
      },
      updateSelectedRootPitches: (state, rootPitch) => {
        let scene = state.scenes[state.editingSceneNumber]
        if (rootPitch === 'clear') {
          scene.selectedRootPitches = []
        } else if (rootPitch === 'all') {
          scene.selectedRootPitches = ['C','G','D','A','E','B','Fs','Cs','Gs','Ds','As','F']
        } else {
          let rootPitchIndex = scene.selectedRootPitches.indexOf(rootPitch)
          if (rootPitchIndex === -1) { scene.selectedRootPitches.push(rootPitch) }
          else {
            if (scene.selectedRootPitches.length > 1)
            scene.selectedRootPitches.splice(rootPitchIndex, 1)
          }
        }
      },

      writeNewTune: (state, tune) => {
        let scene = state.scenes[state.editingSceneNumber]
        scene.tracks[scene.editingTrackNumber].tune = tune
        scene.editingIndex = tune.length-1
        if (scene.editingTrackId === scene.leadTrackId) {
          scene.selectedLength = tune.length-1
        }
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
      improvedLoad: (state, loadData) => {
        // https://www.reddit.com/r/vuejs/comments/8qmw3s/looking_for_advice_on_a_saveload_function_with/?st=jj7cs5mw&sh=21b2f617
        let retrievedState = JSON.parse(loadData)
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
                let sceneObjectBuilder = JSON.parse(JSON.stringify(STATEDEFAULTS.newSceneDefaults))
                for (let scenePropKey in scene){
                  if (!sceneObjectBuilder.hasOwnProperty(scenePropKey)) { continue }

                  // scene objects
                  else if (typeof scene[scenePropKey] === 'object' && !Array.isArray(scene[scenePropKey]) )  {
                    for (let scenePropLevel2 in scene[scenePropKey]) {
                      if (!sceneObjectBuilder[scenePropKey].hasOwnProperty(scenePropLevel2)){ continue }
                      else { sceneObjectBuilder[scenePropKey][scenePropLevel2] = scene[scenePropKey][scenePropLevel2] }
                    }

                  // tracks
                } else if (scenePropKey === 'tracks') {
                    let tracks = []
                    scene.tracks.forEach( (track, index) => {
                      let trackObject = JSON.parse(JSON.stringify(newStateBuilder.newTrackDefaults))
                      for (let trackProp in track) {
                        if (!trackObject.hasOwnProperty(trackProp)) { continue }
                        else { trackObject[trackProp] = track[trackProp] }
                      }
                      tracks.push(trackObject)
                    })
                    sceneObjectBuilder.tracks = tracks

                  // other scene properties
                  } else {
                    sceneObjectBuilder[scenePropKey] = scene[scenePropKey]
                  }
                }
                scenes.push(sceneObjectBuilder)
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

      },
      loadScene: (state, checkedSceneData) => {
        state.scenes.push(checkedSceneData)
      },

    },


    actions: {

      // SCENE MANAGEMENT
      setUpNewScene: context => {
        console.log('setting up new scene')
        const newScene = JSON.parse(JSON.stringify(context.state.newSceneDefaults))
        let sceneIdNumber = Math.random().toString().slice(2)
        newScene.id = sceneIdNumber
        let sceneTitle = randomElement(SCENETITLES)
        newScene.title = sceneTitle
        let firstTrack = context.getters.newTrack()
        firstTrack.tune.push({pitch:"_",random:'fixed'})
        newScene.tracks.push(firstTrack)
        newScene.editingTrackId = newScene.tracks[0].id
        newScene.leadTrackId = newScene.tracks[0].id
        context.commit('addNewScene', newScene)
        context.dispatch('initializeSceneAudio', context.state.scenes.length-1)
      },
/*      // this is a potential update to setUpNewScene with some tracks automatically filled
        setUpNewScene: context => {
        const newScene = JSON.parse(JSON.stringify(context.state.newSceneDefaults))
        let sceneIdNumber = Math.random().toString().slice(2)
        newScene.id = sceneIdNumber
        let sceneTitle = randomElement(SCENETITLES)
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
        //let changeToNumber = context.state.sceneChangeNumber
        let changeToNumber = context.state.playing ? context.state.sceneChangeNumber : context.state.editingSceneNumber
          // ok this may work if you change all the references to context.state.sceneChangeNumber below to just changeToNumber
        console.log('changeToNumber', changeToNumber)
        if (change === 'backward') {
          if (changeToNumber > 0) {  // context.state.sceneChangeNumber > 0) {
            changeToNumber-- // = context.state.sceneChangeNumber - 1
          } else if (changeToNumber === 0) { // context.state.sceneChangeNumber === 0) {
            changeToNumber = context.state.scenes.length-1
          }
        } else if (change === 'forward') {
          //if (context.state.sceneChangeNumber < context.state.scenes.length-1 ) {
          if (changeToNumber < context.state.scenes.length-1 ) {
            changeToNumber++  //= context.state.sceneChangeNumber + 1
          } else {
            changeToNumber = 0
          }
        } else {
          changeToNumber = change
        }
        if (context.state.playing) {
          context.commit('setSceneChangeNumber', changeToNumber)
          if (!context.state.chain) {
            context.commit('setSceneAdvanceCued', true)
          }
        } else {
          context.commit('setSceneChangeNumber', changeToNumber)
          context.dispatch('changeScene')
        }
      },
      changeScene: (context) => {
        context.commit('changeScene')
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.loadQwertySettingOnSceneChange != 'none'){
          context.commit('activatePlayerParamSettings', scene.loadQwertySettingOnSceneChange)
        }
      },
      initializeSceneAudio: (context, sceneNumber) => {
        let title = context.state.scenes[sceneNumber].title
        console.log('initializing scene audio for ', sceneNumber, title)
          let sceneAudio = AM.scenes[title]
          for (let nodeList in sceneAudio){
            sceneAudio[nodeList].forEach( (nodeListItem, index) => {
              //nodeListItem.disconnect(Tone.Master) // good try, though.
              nodeListItem.dispose()
            })
          }
          AM.scenes[title] = { instruments:[], autoFilters: [], gains:[], delays:[], distortions:[] } // https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
          context.state.scenes[sceneNumber].tracks.forEach( (track, tracksIndex) =>  {
            let trackInstrument = AM.instrument(track.instrumentType, track.sampleType, track)
            AM.scenes[title].instruments.push(trackInstrument)
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

            let gainValue = ( () => {
              switch (track.instrumentType){
                case 'polySynth': return track.polySynthGainDefault
                case 'monoSynth': return track.monoSynthGainDefault
                case 'sampler': return track.samplerGainDefault
              }
            })()
            context.dispatch('updateTrackSoundParams', { param:'gain', sceneNumber: sceneNumber, title: title, trackNumber: tracksIndex, value:gainValue, track: track })

          })
          //AM.scenes[title].instruments.forEach( (synth, i) => synth.toMaster() )
          AM.scenes[title].instruments.forEach( (instrument, i) => instrument.connect(AM.scenes[title].autoFilters[i]) )
          AM.scenes[title].autoFilters.forEach( (autoFilter, i) => autoFilter.connect(AM.scenes[title].distortions[i]).start() )
          AM.scenes[title].distortions.forEach( (distortion, i) => {
            distortion.fan(AM.scenes[title].gains[i], AM.scenes[title].delays[i] )
            distortion.wet.value = 0.5
            //distortion.distortion = 0
          })
          AM.scenes[title].delays.forEach( (delay, i) => delay.connect(AM.scenes[title].gains[i]) )
          AM.scenes[title].gains.forEach( (gain, i) => gain.toMaster() )

      },
      addTrack: context => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        context.commit('addTrack', context.getters.newTrack())
        context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },
      removeTrack: (context, removeTrackNumber) => {
        // console.log("removeTrackNumber", removeTrackNumber)
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (scene.editingTrackNumber === removeTrackNumber && removeTrackNumber != 0 ) {
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
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if ( onOrOff === 'on') {
          console.log('turning AutoMod on')
          console.log(context.getters.selectedModulations.indexOf(scene.nextModulation.modulation) )
          if  (scene.modulationStyle === 'drift' && ( scene.nextModulation.modulation === '' ||
               context.getters.selectedModulations.indexOf(scene.nextModulation.modulation) === -1  )) {  // here scene.nextModulation is checked in two different conditions, but it's a bit redundant because the second will also catch the first...
            console.log('in drift && ')
            // DRY re: morphSelectedNotes, toggleModulationStyle
            let type = randomElement(context.getters.selectedModulations)
            let modeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
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
            context.dispatch('buildHarmonicForm', context.state.harmonicFormDefault) // '-a-b')  // '-a-b-a-c'
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
          let modeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
          context.commit('updateNextModulation', modeInfo)
          context.commit('updateModulationStyle', 'drift')
        }
      },
      formStepAndChainIncrement: (context) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        let leadTrack = scene.tracks[context.getters.leadTrackNumber]
        console.log('fS', scene.formStep, 'hFL-1:', scene.harmonicForm.length-1)
        if (scene.formStep < scene.harmonicForm.length-1) {
          context.commit('updateFormStep', 'increment')
        } else {
          context.commit('updateFormStep', 'zero')
          context.dispatch('checkChainIncrementAndTriggerAdvance', { track: leadTrack, increment: 'Form' }  )
          context.dispatch('checkAdvanceCueVsChangeIncrement', { track: leadTrack, increment: 'Form' } )
        }
      },
      /*
      formStepAndChainIncrement: (context, update) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        console.log('formStep before advance', scene.formStep)
        if (update === 'zero'){  // don't think you're using this!
          context.commit('updateFormStep', 'zero')
        } else if (update === 'advance') {
          context.commit('updateFormStep', 'advance')
          if (context.state.chain && scene.sceneChangeIncrement === 'perFormReset') {
            context.commit('advanceChainIncrement')
          }
        } else if (update === 'off') {
          context.commit('updateFormStep', 'off')
        }
        console.log('formStep after advance', scene.formStep)
      },
      */
      modulatePerLeadChanges: (context, value) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        context.commit('updateModulatePerLeadChanges', value)
      },
      buildHarmonicForm: (context, value) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        //let harmonicPreForm = value.match(/((([c|d|f|g|a]#?|[b|e])\\)?([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr))|((([c|d|f|g|a]#?|[b|e])\\)?\([a-z]\))/gi)
        let harmonicPreForm = value.match(/((([c|d|f|g|a]#?|[b|e])\\)?([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr|maj|min|sus|ma7|dom|mi7|hdm|dm7|blu|pen|fth|one))|((([c|d|f|g|a]#?|[b|e])\\)?-[a-z])/gi)
        if (harmonicPreForm === null) { console.log("harmonicPreForm is null!"); return }
        if (arraysEqual(harmonicPreForm, scene.harmonicForm)) { console.log('same'); return }

        // find all the -[a-z] and eliminate the duplicates
        let formLetters = []
        let formToPickFinderArray = value.match(/-[a-z]/gi)
        if (formToPickFinderArray !== null) {
          let formToPickLettersArray = formToPickFinderArray.map(foundLetter => foundLetter.match(/[a-z]/i)[0] )
          formToPickLettersArray.forEach((letter, index) => {
            if (formLetters.indexOf(letter) === -1) { formLetters.push(letter) }
          })
        }

        // checking formLetters.length against totalFormStepOptions prevents an infiniteloop if there are too few options
        let totalFormStepOptions = scene.selectedRootPitches.length * context.getters.selectedModulations.length
        // create a uniqe match for each letter
        let formLettersMatches = []        // https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
        while(formLettersMatches.length < formLetters.length){
            let type = randomElement(context.getters.selectedModulations)
            let preMatch = pickMode(MODEDATA, type, false, scene.selectedRootPitches)
            preMatch.modeBase = preMatch.modeBase.replace(/s/,'#')
            let match = preMatch.modeBase + preMatch.modulation
            if(formLettersMatches.indexOf(match) > -1 && totalFormStepOptions >= formLetters.length) continue
            formLettersMatches[formLettersMatches.length] = match
        }
          // then combine those together onto an object
        let formLettersRef = {}
        formLetters.forEach((letter, index) => {
          formLettersRef[letter] = formLettersMatches[index]
        })

        // translate the pre-form into the form using that object
            // lower stuff below is redundant...
        let harmonicForm = []
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
          } else if (section.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr|maj|min|sus|ma7|dom|mi7|hdm|dm7|blu|pen|fth|one)/i) !== null){
            let sectionPreMode = section.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr|maj|min|sus|ma7|dom|mi7|hdm|dm7|blu|pen|fth|one)/i)[0]
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
        if (context.state.playerParams.keyToQwertyDisplay === 'Rows-Octave'){
          context.commit('changeQwertyDisplay', 'Rows-Fifth')
        } else if (context.state.playerParams.keyToQwertyDisplay === 'Rows-Fifth'){
          context.commit('changeQwertyDisplay', 'Clusters')
        } else if (context.state.playerParams.keyToQwertyDisplay === 'Clusters'){
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
      addRandomNoteToAllTracks: (context) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        scene.tracks.forEach( (track, index) => {
          const pitch = randomElement(context.getters.pitchSets[index]);
          const note = { pitch: pitch, random: 'rests' }
          const start = scene.editingTrackNumber === index ? -1 : scene.tracks[index].tune.length
          context.commit('spliceNoteIntoTune', { start:start, delete:0, insert:note, trackIndex: index })
        })
        context.commit('updateSelectedLength', context.getters.toneTunes[context.getters.leadTrackNumber].length)
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
        const scene = context.state.scenes[context.state.editingSceneNumber]
        if (change === 'fromEndcap') {
          if (scene.editingIndex > 0) {
            context.commit('deleteNote', { trackNumber: scene.editingTrackNumber, noteIndex: scene.editingIndex-1 } )
            context.commit('changeEditingIndex', 'decrement')
          }
        } else if (change === 'currentNote') {
          context.commit('deleteNote', {trackNumber: scene.editingTrackNumber, noteIndex: scene.editingIndex } )
        }
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', context.getters.toneTunes[context.getters.leadTrackNumber].length)
        }
      },
      deleteNoteFromAllTracks: (context) => {
        const scene = context.state.scenes[context.state.editingSceneNumber]
        scene.tracks.forEach( (track, index) => {
          if (index === scene.editingTrackNumber) {
            if (track.tune.length > 1) {
              context.commit('deleteNote', {trackNumber: index, noteIndex: track.tune.length - 2})
              if (scene.editingIndex >= track.tune.length) {
                context.commit('changeEditingIndex', 'endcap')
              }
            }
            context.commit('updateSelectedLength', track.tune.length-1)
          } else {
            context.commit('deleteNote', {trackNumber: index, noteIndex: track.tune.length - 1})
          }
        })
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
          console.log("noteArr", noteArr)
          let noteArrNum = noteArr[1]
          octave = parseInt(noteArrNum, 10)
          octave++
          if (octave > 9) { return }
          else { newNote = { pitch: noteArr[0]+octave, random:random } }
        } else if (shift === 'octave-down') {
          let noteArrNum = noteArr[1]
          octave = parseInt(noteArrNum, 10)
          octave--
          if (octave < 0) { return }
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
        if (shift==='up' && FULLRANGE.indexOf(track.rangeHigh) < 73){
          let newRangeHigh = highRangeSplit[0]+(highRangeSplit[1]+1)
          let newRangeLow = lowRangeSplit[0]+(lowRangeSplit[1]+1)
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'high', pitch: newRangeHigh })
          context.commit('adjustRange', { trackNumber: scene.editingTrackNumber, range: 'low', pitch: newRangeLow })
        }
        if (shift==='down' && FULLRANGE.indexOf(track.rangeLow) > 11){
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
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', doubledTune.length - 1)
        }
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
        if (scene.editingTrackNumber === context.getters.leadTrackNumber) {
          context.commit('updateSelectedLength', newTune.length - 1)
        }
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
      changeTrackInstrumentOrSample: (context, payload) => {
        // this may actually be confusing/problematic to not have two different functions for this, even though they would be the same
        // also: note that this does not pass the scene title in the payload. currently this is found by ternary in updateTrackSoundParams
        // likewise, it does not pass the sceneNumber, this is also found by ternary
        if ( (payload.value === 'polySynth' || payload.value === 'monoSynth') && payload.track.instrumentType ==='sampler' ) {
          context.commit('changeTrackNoteDuration', { trackNumber: payload.trackNumber, duration: '8n' } )
        } else if (payload.value === 'sampler' && (payload.track.instrumentType === 'monoSynth' || payload.track.instrumentType === 'polySynth') ) {
          context.commit('changeTrackNoteDuration', { trackNumber: payload.trackNumber, duration: '1m' })
        }
        context.commit('updateTrackSoundParams', payload)
        context.dispatch('initializeSceneAudio', context.state.editingSceneNumber)
      },
      changeTrackWave: (context, payload) => {
        context.commit('changeTrackWave', payload)
        AM.scenes[context.getters.activeSceneTitle].instruments[payload.trackNumber].set({
           'oscillator': { 'type': payload.wave }
        })
      },
      setTrackAMSoundParams: (context, payload) => {
        console.log('setTrackAMSoundParams', payload)
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
            if (payload.track.instrumentType === 'monoSynth' || payload.track.instrumentType === 'polySynth'){
              AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'envelope': { attack: payload.value } })
            } else {
              AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'attack': payload.value })
            }
            break
          case 'decay':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'envelope': { decay: payload.value } })
            break
          case 'sustain':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'envelope': { sustain: payload.value } })
            break
          case 'release':
            if (payload.track.instrumentType === 'monoSynth' || payload.track.instrumentType === 'polySynth'){
              AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'envelope': { release: payload.value } })
            } else {
              AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'release': payload.value })
              console.log('release', AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].release)
            }
            break
          case 'portamento':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'portamento': payload.value })
            break
          case 'modulationType':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'modulationType' : payload.value } })
            break
          case 'modulationIndex':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'modulationIndex' : payload.value } })
            break
          case 'harmonicity':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'harmonicity' : payload.value } })
            break
          case 'count':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'count' : payload.value } })
            break
          case 'spread':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'spread' : payload.value } })
            break
          case 'modulationFrequency':
            AM.scenes[payload.sceneTitle].instruments[payload.trackNumber].set({ 'oscillator': { 'modulationFrequency' : payload.value } })
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
      },
      updateTrackSoundParams: (context, payload) => {
        console.log('uTSP dispatch payoad', payload)
        let title = payload.title ? payload.title : context.getters.activeSceneTitle
        if (payload.value === '' || (typeof payload.value === 'string' && payload.value.slice(0,1) === '.') ) { return }
        context.dispatch('setTrackAMSoundParams',  { param: payload.param, sceneTitle: title, trackNumber: payload.trackNumber, value: payload.value, track: payload.track } )
        context.commit('updateTrackSoundParams', { param: payload.param, sceneNumber: payload.sceneNumber, trackNumber: payload.trackNumber, value: payload.value })
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
      setTracks: (context, tracks) => {
          let scene = context.state.scenes[context.state.editingSceneNumber]
          context.commit('updateTracks', tracks)
          let indexOfEditingTrack = ''
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
          if (Math.random()*100 < track.pitchPercent){
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
          if (Math.random()*100 < track.pitchPercent){
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
        if (track.tune.length === 0 || track.tune[0].pitch === '_') { return }
        let changeableNoteIndexes = []
        let pitchSet = context.getters.pitchSets[payload.trackIndex]
        track.tune.forEach( (note, index) => {
          if ( (note.random === 'rests' || note.random === 'noRests') && note.pitch != '_') { changeableNoteIndexes.push(index) }
        })
        if (changeableNoteIndexes.length > 0) {
          shuffle(changeableNoteIndexes)
          let changeTotal = payload.all ? context.getters.maxChangeables[payload.trackIndex] : track.changeTotal
          for (let i = 0; i < changeTotal; i++) {
            let prevPitch = track.tune[changeableNoteIndexes[i]].pitch
            let newPitch = ''
            if (pitchSet.length > 1) {
              do {
                newPitch = randomElement(pitchSet)
              } while (newPitch === prevPitch)
            } else {
              newPitch = pitchSet[0]
            }
            if (track.tune[changeableNoteIndexes[i]].random === 'rests' && Math.random() * 100 > track.pitchPercent) {
              newPitch = ' '
            }
            // why is this after the doWhile? shouldn't this be first and doWhile be in an else?
            // && (prevPitch != ' ' || pitchSet.length === 1) // see commentary
            context.commit('changeTuneNote', {
              trackIndex: payload.trackIndex,
              tuneIndex: changeableNoteIndexes[i],
              pitch: newPitch
            })
          }
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
      changeAll: (context, number) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        scene.tracks.forEach( (track, index) => {
          switch (number) {
            case 'all':
              context.dispatch('changeTune', { trackIndex: index, all: true })
              break
            case 'changeTotal':
              context.dispatch('changeTune', { trackIndex: index, all: false })
              break
          }
        })
      },
      updateTuneWithPrefix: (context, payload) => {
        let pitchSet = context.getters.pitchSets[payload.trackIndex]
        let formSectionPrefix = payload.formSection.match(/([c|d|f|g|a]#?|[b|e])\\/i)[0]
        let rootPitch = formSectionPrefix.match(/[c|d|f|g|a]#?|[b|e]/i)[0]
        let newPitch = pitchSet.find( pitch => {
          return pitch.slice(0, -1) === rootPitch
        })
        context.commit('changeTuneNote', {
          trackIndex: payload.trackIndex,
          tuneIndex: 0,
          pitch: newPitch, // 'C4'
        })
      },
      morphSelectedNotes: (context, userCalled) => {
          let scene = context.state.scenes[context.state.editingSceneNumber]
          if (scene.modulationStyle === 'form') {
              context.commit('updateSelectedMode', scene.nextModulation)
              context.dispatch('formStepAndChainIncrement')
              let nextFormSection = (scene.formStep < scene.harmonicForm.length-1)  ? scene.harmonicForm[scene.formStep+1] : scene.harmonicForm[0]
              let nextFormSectionSansPrefix = nextFormSection.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr|maj|min|sus|ma7|dom|mi7|hdm|dm7|blu|pen|fth|one)/i)[0]
              let nextModeInfo = referenceMode(MODEDATA, nextFormSectionSansPrefix)
              context.commit('updateNextModulation', nextModeInfo)
          } else if (scene.modulationStyle === 'drift' && scene.autoModulate) {
              if (!userCalled){
                context.commit('updateSelectedMode', scene.nextModulation)
              }
              // DRY re: autoModulate & toggleModulationStyle
              let type = randomElement(context.getters.selectedModulations)
              let nextModeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
              context.commit('updateNextModulation', nextModeInfo)
          } else {
              let type = randomElement(context.getters.selectedModulations)
              let newModeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
              context.commit('updateSelectedMode', newModeInfo)
        }
      },
      checkChainIncrementAndTriggerAdvance: (context, payload) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (payload.track.id === scene.leadTrackId &&
            context.state.chain === true &&
            payload.increment === scene.sceneChangeIncrement
        ) {
          console.log("in cCIATA, chainIncrement", scene.chainIncrement)
          if (scene.chainIncrement < scene.chainAdvancePer-1) {
            context.commit('changechainIncrement', 'increment' )
          } else {
            context.commit('changechainIncrement', 'zero' )
            context.commit('setSceneAdvanceTriggered', true)
          }
        }
      },
      checkAdvanceCueVsChangeIncrement: (context, payload) => {
        let scene = context.state.scenes[context.state.editingSceneNumber]
        if (context.state.sceneAdvanceCued &&
            payload.track.id === scene.leadTrackId &&
            payload.increment === scene.sceneChangeIncrement

        ) {
          context.commit('setSceneAdvanceTriggered', true)
          context.commit('setSceneAdvanceCued', false)
        }
      },

      // SAVING & LOADING
      save: context => {
        const promptData = prompt("Save this file as:", context.state.fileName)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const fileNameKey = 'TF3_' + fileName
          context.commit('changeFileName', fileName)
          context.commit('changeLoadTarget', fileNameKey)
    	    localStorage.setItem( fileNameKey, JSON.stringify(context.state) )
        }
    	},
      saveScene: context => {
        const promptData = prompt("Save this scene as:", context.getters.activeSceneTitle)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const sceneNameKey = 'TF3_S_' + fileName
          //context.commit('changeLoadTarget', fileNameKey)
    	    localStorage.setItem( sceneNameKey, JSON.stringify(context.state.scenes[context.state.editingSceneNumber]) )
        }
    	},
      load: (context, loadData) => {
        let parsedLoadData = JSON.parse(loadData)
        if (parsedLoadData.hasOwnProperty('fileName')) {
          context.commit('improvedLoad', loadData)
        } else if (parsedLoadData.hasOwnProperty('title')) {
          context.dispatch('checkSceneData', loadData)
        }
        context.state.scenes.forEach( (scene, index) => {
          context.dispatch('initializeSceneAudio', index)
        })
        bus.$emit('updatePlayerStuff')
        // are there other things beside BPM that need updating on load?
        Tone.Transport.bpm.value = context.state.scenes[context.state.editingSceneNumber].bpm;
      },
      checkSceneData: (context, loadData) => {
          let sceneBuilder = JSON.parse(JSON.stringify(STATEDEFAULTS.newSceneDefaults))
          let sceneData = JSON.parse(loadData)
          for (let sceneKey in sceneData){

              // passes by properties no longer recognized by this version of the app
              if (!sceneBuilder.hasOwnProperty(sceneKey)) { continue }

              // scene objects
              else if (typeof sceneData[sceneKey] === 'object' && !Array.isArray(sceneData[sceneKey]) )  {
                  for (let sceneObjectKey in sceneData[sceneKey]) {
                      if (!sceneBuilder[sceneKey].hasOwnProperty(sceneObjectKey)){ continue }
                      else { sceneBuilder[sceneKey][sceneObjectKey] = sceneData[sceneKey][sceneObjectKey] }
                  }
              }

              // tracks
              else if (sceneKey === 'tracks') {
                  let tracks = []
                  sceneData.tracks.forEach( (track, index) => {
                      let trackObject = JSON.parse(JSON.stringify(STATEDEFAULTS.newTrackDefaults))
                      for (let trackKey in track) {
                          if (!trackObject.hasOwnProperty(trackKey)) { continue }
                          else { trackObject[trackKey] = track[trackKey] }       //     tune: [{pitch:"_",random:'fixed'}],   could this be weird on accound of pass-by-reference?
                      }
                  tracks.push(trackObject)
                  })
                  sceneBuilder.tracks = tracks
              }

              // other scene properties
              else {
                  sceneBuilder[sceneKey] = sceneData[sceneKey]
              }
          }

          context.commit('loadScene', sceneBuilder)

      },

      download: context => {
        const promptData = prompt("Download this file as:", context.state.fileName)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const exportObj = JSON.stringify(context.state)
          const compositionNameKey = 'TF3_' + fileName
          downloadObjectAsJson(exportObj, compositionNameKey)
        }
    	},
      downloadScene: context => {
        const promptData = prompt("Download this scene as:", context.getters.activeSceneTitle)
        const fileName = (promptData === null) ? '' : promptData.trim()
        if (fileName !== '') {  // are there other bogus values that promptData might get?
          const exportObj = JSON.stringify(context.state.scenes[context.state.editingSceneNumber])
          const sceneNameKey = 'TF3_S_' + fileName
          downloadObjectAsJson(exportObj, sceneNameKey)
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
