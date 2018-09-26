
// https://stackoverflow.com/questions/951483/how-to-check-if-a-json-response-element-is-an-array
function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function remove(array, element) { return array.filter(e => e !== element) }

function randomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// https://stackoverflow.com/questions/4025893/how-to-check-identical-array-in-most-efficient-way
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

// https://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

// http://monkeyraptor.johanpaul.net/2015/05/javascript-counting-same-occurrences-in.html
// not using this but it's cool!
function occurrence (array) {
    "use strict";
    var result = {};
    if (array instanceof Array) { // Check if input is array.
        array.forEach(function (v, i) {
            if (!result[v]) { // Initial object property creation.
                result[v] = [i]; // Create an array for that property.
            } else { // Same occurrences found.
                result[v].push(i); // Fill the array.
            }
        });
    }
    return result;
};

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
/* usage example: var a = ['a', 1, 'a', 2, '1']; var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']; */

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



/** REGEX SPLITERS ******************************************************/
// https://stackoverflow.com/questions/3370263/separate-integers-and-text-in-a-string

function naturalSplit(str) {
    'use strict';
    let arr = [];
    let split = str.split(/(\d+)/);
    for (let i in split) {
        let s = split[i];
        if (s !== "") {
            if (i % 2) {
                arr.push(+s);
            } else {
                arr.push(s);
            }
        }
    }
    return arr;
}


/******************************************************************************************
* FILE MANAGEMENT
*****************************************************************************************/

function downloadObjectAsJson(exportObj, exportName){
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
  //downloadAnchorNode.setAttribute("download", exportName + ".txt");
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}


/******************************************************************************************
* APP-SPECIFIC HELPERS
********************************************************************************************/
function findAndBlur(){
  let el = this.$el.querySelector(':focus')
  if (el) el.blur()
}

function findAndFocus(elementId){
  let el = this.$el.querySelector(elementId)
  if (el != undefined) { el.focus() }
}

// DRY warning... this duplicates an action...
  // you're going to have to CALL or BIND this
  // used in new version of setUpNewScene action
function makeTune(pitchSet, length, restPercent, fillFirst){
  let tune = []
  if (fillFirst) {
    tune.push( { pitch: randomElement(pitchSet), random:'noRests' } )
    length--
  }
  for (let i=1; i < length; i++){
    if (Math.random()*100 > restPercent){
      tune.push({ pitch: randomElement(pitchSet), random: 'rests' })
    } else {
      tune.push({ pitch: ' ', random: 'rests' })
    }
  }
  return tune
}


function filterTrackTunePitches(trackTune, pitchSet){
  //console.log("filter pitchSet", pitchSet)
  let filteredTrackTune = []
  trackTune.forEach( (note, index) => {
    let newNote = {}
    if ( ( pitchSet.indexOf(note.pitch) === -1 &&
        (note.random === 'noRests' || note.random === 'rests') &&
        note.pitch != ' ' &&
        note.pitch != '_'
        ) || (note.random === 'noRests' && note.pitch === ' ')
      ){
      newNote.pitch = randomElement(pitchSet)
    } else { newNote.pitch = note.pitch }
    newNote.random = note.random
    filteredTrackTune.push(newNote)
  })
  return filteredTrackTune
}

function pickMode(modeData, modulationType, lastMode, rootPitchSelections){
  //console.log("modulationType", modulationType)
  //console.log('rootPitchSelections', rootPitchSelections)
  let lastModeArr = []
  //if (lastMode != undefined && lastmode != false) { lastModeArr = lastMode.split('-') }
  if (lastMode) { lastModeArr = lastMode.split('-') }
  let modeInfo = modeData[modulationType]
  /*
  if (modulationType === 'chr') { return { modeBase: 'C', modePitches: modeInfo['C'], modulation: modulationType } }
  let rootPitches = []
  if (modulationType === 'dia' || modulationType === 'mel' || modulationType === 'har') {
    rootPitches = ['C','G','D','A','E','B','Fs','Cs','Gs','Ds','As','F']
  } else if (modulationType === 'dim') {
    rootPitches = ['C','Cs','D']
  } else if (modulationType === 'aug') {
    rootPitches = ['C','Cs']
  }
  */
  let rootPitches = rootPitchSelections || ['C','G','D','A','E','B','Fs','Cs','Gs','Ds','As','F']
  console.log('rootPitches', rootPitches)
  let chosenRoot = ''
  if (lastMode && rootPitches.length > 1) {
    do {
      chosenRoot = randomElement(rootPitches)
    } while (chosenRoot === lastModeArr[0])
  } else {
    chosenRoot = randomElement(rootPitches)
  }
  //let chosenMode = { modeBase: chosenRoot, modePitches: modeInfo[chosenRoot], modulation: modulationType }
  //return chosenMode
  return { modeBase: chosenRoot, modePitches: modeInfo[chosenRoot], modulation: modulationType }
}

function referenceMode(modeData, modulationVal){
  let root = modulationVal.match(/[c|d||f|g|a]#?|[b|e]/i)[0]
  if (root.charAt(1) === '#') { root = root.replace(/#/,'s') }
  //console.log('root', root)
  let modulationType = modulationVal.match(/dia|mel|har|dim|aug|chr/i)[0]
  //console.log('mod',modulationType)
  let modePitches = modeData[modulationType][root]
  //console.log('pitchs', modePitches)
  return { modeBase: root, modePitches: modePitches, modulation: modulationType }
}


/*
case 'drift':
  let morphNumber = 1
  let pitchNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#"]
  let unselectedNotes = []
  pitchNames.forEach( (name, index) => {
    if (scene.selectedNotes.indexOf(name) === -1 ) { unselectedNotes.push(name) }
  })
  for (let i=0; i<morphNumber; i++){
    if (scene.selectedNotes.length > 1){
      let newSelected = randomElement(unselectedNotes)
      let newUnselected = randomElement(scene.selectedNotes)
      context.commit('updateSelectedNotes', newSelected)
      context.commit('updateSelectedNotes', newUnselected)
    }
  }
  break
*/
/*
function driftMode(selectedNotes, driftCount){
  let pitchNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#"]
  let driftedMode = selectedNotes.slice()
  let unselectedNotes = []
  pitchNames.forEach( (name, index) => {
    if (selectedNotes.indexOf(name) === -1 ) { unselectedNotes.push(name) }
  })
  let driftedNotes = []
  for (let i=0; i<driftCount*2; i++){
    if (driftedMode.length > 1){
      let newSelected = randomElement(unselectedNotes)
      let newUnselected = randomElement(selectedNotes)
      driftedNotes.push(newSelected)
      driftedNotes.push(newUnselected)
    }
  }
  return driftedMode
}
*/
