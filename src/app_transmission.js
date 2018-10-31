// brackets are wrong!

advanceTrackStep(time){ // let's call this "tickAppTransmission"

  // SCENE CHANGING: if its prior to beat 1 and advanceTriggered
  if  ( ( this.tracks[this.leadTrackNumber].toneTuneIndex === 0 && this.$store.state.advanceTriggered ) &&
        (
          ( sceneChangeIncrement === 'perCycle' ||
            ( sceneChangeIncrement === 'perModulation' && scene.modulationStyle === drift  ) ||
            ( sceneChangeIncrement === 'perFormReset' && scene.modulationStyle === drift  )
          ) ||
          ( sceneChangeIncrement === 'perChange' && track.changeCycles === 0 ) ||
          ( sceneChangeIncrement === 'perModulation' && track.modulationCycles === 0  ) ||
          ( sceneChangeIncrement === 'perFormReset' && scene.formStep === 0 )
        )
      )
  {

    this.$store.commit('resetScene')
    if (this.$store.state.editingSceneNumber >= this.$store.state.scenes.length-1 &&
        this.$store.state.chain && this.$store.state.chainLoop === false) {
      this.togglePlay()
      this.$store.commit('changeScene')
      this.$store.commit('setAdvanceTriggered', false)
      return
    }
    this.$store.commit('changeScene')
    this.$store.commit('setAdvanceTriggered', false)

  }
  if (this.$store.state.chain) {
    this.$store.dispatch('setUpSceneChange', 'forward')
  }
  if (this.scene.started === false) { this.$store.commit('startScene') }

  // ADVANCE and PLAY... Lead track goes first!
  this.advanceAndPlayTrack(this.tracks[this.$store.getters.leadTrackNumber], this.$store.getters.leadTrackNumber, time)
  // now the other tracks
  this.tracks.forEach( (track, index) => {
    if (index === this.$store.getters.leadTrackNumber) { return }
    else { this.advanceAndPlayTrack(track, index, time) }
  })
  //  console.log("this.leadTrack.toneTunesIndex", this.leadTrack.toneTuneIndex)
  //  console.log("this.toneTunes[this.leadTrackNumber].length", this.toneTunes[this.leadTrackNumber].length)
},

advanceAndPlayTrack(track, index, time){

    // CHECK FOR MODULATION AND CHANGE
    if (track.toneTuneIndex === 0 && track.changeCycles >= track.changePer
        && track.changePer != 0 && !this.scene.suspendChanges ) {
      // LEAD TRACK QUEUES MODULATION
      if (track.id === this.scene.leadTrackId && this.scene.autoModulate) {
        if (this.scene.modulationCycles < this.scene.modulatePerLeadChanges-1){
          this.$store.commit('updateModulationCycles', 'increment')
        } else {
          this.$store.commit('updateModulationCycles', 'zero')
          this.$store.dispatch('morphSelectedNotes')
        }
      }
      this.$store.dispatch('changeTune', { trackIndex: index, all: false })
      this.$store.commit('changeCycles', {change:'zero', index: index} )
    }

    // PLAY NOTES
    let toneTune = this.toneTunes[index]
    let pitch = toneTune[track.toneTuneIndex]
    if (pitch != 0){
      if (track.toneTuneIndex === toneTune.length-1 && this.$store.state.advanceTriggered) {
        AM.scenes[this.scene.title].synths[index].triggerAttackRelease(pitch, '16n', time) // corrects for last note duration bleed-over on scene change
      } else {
        AM.scenes[this.scene.title].synths[index].triggerAttackRelease(pitch, track.noteDuration, time)
      }
    }

    // ADVANCE TRACK and CHECK FOR CHANGES
    if (track.toneTuneIndex < toneTune.length-1) {
      this.$store.commit('changeToneTuneIndex', {change:'increment', index:index} )
    } else {
      this.$store.commit('changeToneTuneIndex', {change:'zero', index:index} )
      if (track.changeCycles < track.changePer && !this.scene.suspendChanges) {
        this.$store.commit('changeCycles', {change:'increment', index:index} )
      }
      // CHECK FOR SCENE CHAINING to TRIGGER ADVANCE
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




setUpSceneChange: (context, change) => {
  console.log("change:", change)
  let changeToNumber = context.state.sceneChangeNumber  // currently an unused assignment - ? could it be used to skip forward/backward more than one?
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




********** Originals

// SCENE CHANGING BEFORE REFACTOR

if (this.tracks[this.leadTrackNumber].toneTuneIndex === 0 && this.$store.state.advanceTriggered){  // this.leadTrack.toneTuneIndex === this.toneTunes[this.leadTrackNumber].length-1
  //
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


// CHECK FOR MODULATION AND CHANGE before Refactor
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
