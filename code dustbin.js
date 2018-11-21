/* old version of setUpSceneChange, only could advance one at a time...
  stored because who knows if this breaks something else...?
 */

setUpSceneChange: (context, change) => {
  //console.log("change:", change)
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
      context.commit('setSceneAdvanceCued', true)
    }
  } else {
    context.commit('setSceneChangeNumber', changeToNumber)
    context.commit('changeScene')
  }
},





noteShift: (context, shift) => {
  let scene= context.state.scenes[context.state.editingSceneNumber]
  // let track = scene.tracks[scene.editingTrackNumber]
  let tune = context.getters.toneTunes[scene.editingTrackNumber]
  let note = tune[scene.editingIndex]
  let newNote = {}
  const random = scene.tracks[scene.editingTrackNumber].tune[scene.editingIndex].random
  console.log("random?", random)
  console.log('note', note)
  if (note == 0) { return }
  let noteArr = note.split('')
  if ( (noteArr[1] === "#" && noteArr.length === 4) || (noteArr[1] !== "#" && noteArr.length === 3) ) { return }
  if (noteArr[1] === "#") { noteArr[0] = noteArr[0]+'#'; noteArr.splice(1,1) }
  console.log(noteArr)
  let octave = ''
  if (shift === 'octave-up') {
    let noteArrNum = noteArr[1]
    octave = parseInt(noteArrNum, 10)
    octave++
    newNote = { pitch: noteArr[0]+octave, random:random }
  } else if (shift === 'octave-down') {
    let noteArrNum = noteArr[1]
    octave = parseInt(noteArrNum, 10)
    octave--
    newNote = { pitch: noteArr[0]+octave, random:random }
  } else if (shift === 'pitchSetFullRange-up') {
    let noteIndex = context.getters.pitchSetFullRange.indexOf(note)
    noteIndex++
    console.log('noteIndex', noteIndex)
    let newPitch
    if (context.getters.pitchSetFullRange[noteIndex] !== undefined) {
      newPitch = context.getters.pitchSetFullRange[noteIndex]
    }
    newNote = { pitch: newPitch, random:random }
  } else if (shift === "pitchSetFullRange-down") {

  }
  context.commit('spliceNoteIntoTune', { start:scene.editingIndex, delete:1, insert:newNote })
},
