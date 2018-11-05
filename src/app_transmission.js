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
    if (!context.state.chain) {   // when called by user shift-w/e
      context.commit('setAdvanceTriggered', true)
    }
  } else {
    context.commit('setSceneChangeNumber', changeToNumber)
    context.commit('changeScene')
  }
},


// refactored
morphSelectedNotes: (context, userCalled) => {
    let scene = context.state.scenes[context.state.editingSceneNumber]
    if (scene.modulationStyle === 'form') {
        context.commit('updateSelectedMode', scene.nextModulation)
        context.commit('updateFormStep', 'advance')
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

// OLD
morphSelectedNotes: (context, userCalled) => {
  let scene = context.state.scenes[context.state.editingSceneNumber]
  if (scene.autoModulate || scene.modulationStyle === 'form') {
    if (scene.modulationStyle === 'drift') {
      if (!userCalled){
        context.commit('updateSelectedMode', scene.nextModulation)
      }
      // DRY re: autoModulate & toggleModulationStyle
      let type = randomElement(context.getters.selectedModulations)
      let nextModeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
      context.commit('updateNextModulation', nextModeInfo)
    } else if (scene.modulationStyle === 'form') {
      context.commit('updateSelectedMode', scene.nextModulation)
      context.commit('updateFormStep', 'advance')
      let nextFormSection = (scene.formStep < scene.harmonicForm.length-1)  ? scene.harmonicForm[scene.formStep+1] : scene.harmonicForm[0]
      let nextFormSectionSansPrefix = nextFormSection.match(/([c|d||f|g|a]#?|[b|e])(dia|mel|har|dim|aug|chr|maj|min|sus|ma7|dom|mi7|hdm|dm7|blu|pen|fth|one)/i)[0]
      let nextModeInfo = referenceMode(MODEDATA, nextFormSectionSansPrefix)
      context.commit('updateNextModulation', nextModeInfo)
    }
  } else {
    let type = randomElement(context.getters.selectedModulations)
    let newModeInfo = pickMode(MODEDATA, type, scene.lastMode, scene.selectedRootPitches)
    context.commit('updateSelectedMode', newModeInfo)
  }
},


updateFormStep: (state, update) => {
  let scene = state.scenes[state.editingSceneNumber]
  if (update === 'zero'){
    scene.formStep = 0
  } else if (update === 'advance') {
    if (scene.formStep < scene.harmonicForm.length-1) { scene.formStep++ }
    else { scene.formStep = 0 }
  } else if (update === 'off') {
    scene.formStep = -1
  }
},



/*************************************************************************************************************
TRANSMISSION MAP
*************************************************************************************************************/
advanceTrackStep(time){   // console.log("in pTP") //console.log(Date.now(), this.tracks)

    // SCENE CHANGING:
    if its the first step of the lead track and advance is triggered:
        reset the scene, stop playing if its the end the chain, call 'changeScene', and 'setAdvanceTriggered' false

    // SCENE STARTED & NEXT
    if chain is on, 'setUpSceneChange' forward
    start the scene if its not started

    // ADVANCE and PLAY
    lead track 'advanceAndPlayTrack'
    other tracks, 'advanceAndPlayTrack'

},

advanceAndPlayTrack(track, index, time){

    // CHECK FOR CHANGE CONDITION, MODULATE AND CHANGE
    if its the first step, and changeCycles >= changePer, and changePer isnt 0, and changes arent suspended:
        // LEAD TRACK QUEUES MODULATION
        if its the lead track, and its automodulating:
            if modulationCycles < modulatePerLeadChanges-1
                'updateModulationCycles' by 'increment'
            else
                'updateModulationCycles' to 'zero'
                and 'morphSelectedNotes'

        'changeTune'
        'changeCycles' 'zero'  // NOTICE THAT YOU LET THE changeCycles GET AHEAD of changePer FOR THE CHECK, then zero them after...

    // PLAY NOTES
    play whichever note is up

    // ADVANCE TRACK STEP and CHECK FOR CHANGES
    if toneTuneIndex < toneTune.length-1
        'changeToneTuneIndex' by 'increment'
    else
        'changeToneTuneIndex' to 'zero'
        if changeCycles < changePer and changes arent suspented
            'changeCycles' by 'increment'

        // CHECK FOR SCENE CHAINING to TRIGGER ADVANCE   (leadCycles is on scene... )
        if its the lead track and chain is on
            if leadCycles < chainAdvancePer-1
                'changeLeadCycles' by 'increment'
            else
                'changeLeadCycles' to 'zero'
                'setAdvanceTriggered' to true

},



OTHER ASSOCIATED FUNCTIONS
    setUpSceneChange (action)






***********************************************
!!!  https://code2flow.com/app
*************************************************
advanceTrackStep

if(lead=0 & advTrig) {
  resetScene
  if(chain & end) {
    stop (return)
  }
  changeScene
  advTrig(false)
}

setUpSceneChange(forward)
trackStarted(true)

advanceAndPlayTrack (lead First)

if(step 0 & cC >= cP & !cp=0& !susp){
  if(lead & autoMod){
    if(modulationCycles < modulatePerLeadChanges-1)
        updateModulationCycles by increment
    } else {
        updateModulationCycles to 0
        morphSelectedNotes
  }
  changeTune
  changeCycles(zero)
}

PLAY NOTES


if (tTI < tT.length-1) {
  changeToneTuneIndex(increment)
} else {
  changeToneTuneIndex(zero)
  if (changeCycles < changePer && !suspendChanges) {
    changeCycles(increment)
  }

  if (leadTrack && chain) {

    if (leadCycles < chainAdvancePer-1) {
      changeLeadCycles(increment)
    } else {
      changeLeadCycles(zero)
      setAdvanceTriggered(true)
    }
  }
}










/************************************************************************
MORE WORKSHOPPING
****************************************************************************/



morphSelectedNotes: (context, userCalled) => {
    let scene = context.state.scenes[context.state.editingSceneNumber]
    if (scene.modulationStyle === 'form') {
        context.commit('updateSelectedMode', scene.nextModulation)
        context.commit('updateFormStep', 'advance')
        let nextFormSection = (scene.formStep < scene.harmonicForm.length-1) ? scene.harmonicForm[scene.formStep+1] : scene.harmonicForm[0]
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











/***************************************
HMMMMMMM
*****************************************/
