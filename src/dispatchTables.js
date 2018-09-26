//https://www.reddit.com/r/javascript/comments/8l9h2j/use_of_keypress_library_with_conditional_input/?st=jhi4stc9&sh=44da25e6

export function keypress() {
  let listener = new window.keypress.Listener();
  // prevent_default:true prevents sub combo from registering in non-keypress listener...

  // CTRL-SHIFT-
  listener.register_combo({
    "keys"              : "control shift s",
    "on_keydown"        : function() { this.$store.dispatch('spreadTune') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control shift x",
    "on_keydown"        : function() { this.$store.dispatch('trackOctaveShift', 'down') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control shift c",
    "on_keydown"        : function() { this.$store.dispatch('trackOctaveShift', 'up') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });

  // CTRL-
  listener.register_combo({
    "keys"              : "control d",
    "on_keydown"        : function() { this.$store.dispatch('doubleTune') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
      "keys"              : "control b",
      "on_keydown"        : function(e, count){ this.$store.dispatch('getTrackGroupings') },
      "this": this,  "prevent_default": false, "prevent_repeat": true, "is_counting": false,
  });
  listener.register_combo({
      "keys"              : "control space",
      "on_keydown"        : function(e, count){
        if (this.$store.state.activeRegion === 'tune-entry'){ this.$store.commit('setTrackColorAlternation', count) }
      },
      "this": this,  "prevent_default": false, "prevent_repeat": false, "is_counting": true,
  });
  listener.register_combo({
    "keys"              : "alt left",
    "on_keydown"        : function() { this.$store.commit('changeEditingIndex', 'zero') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "alt right",
    "on_keydown"        : function() { this.$store.commit('changeEditingIndex', 'endcap') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control left",
    "on_keydown"        : function() { this.$store.commit('changeEditingIndex', 'minusEight') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control right",
    "on_keydown"        : function() { this.$store.commit('changeEditingIndex', 'plusEight') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control up",
    "on_keydown"        : function() { this.$store.dispatch('noteShift', 'pitchSetFullRange-up') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control down",
    "on_keydown"        : function() { this.$store.dispatch('noteShift', 'pitchSetFullRange-down') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "alt up",
    "on_keydown"        : function() { this.$store.dispatch('noteShift', 'octave-up') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "alt down",
    "on_keydown"        : function() { this.$store.dispatch('noteShift', 'octave-down') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });

}

// taken:
  // ctr-sh-s,
  // ctr-sh-x, ctr-sh-c

  // ctr-d
  // ctr-b
  // ctr-space




export let generalKeyDispatchTable = {

  "Insert"  : function() { this.$store.commit('toggleEditMode') },
  "Escape"  : function() { this.togglePlay() },

  // 12345
  "+"       : function() { this.toggleEntrySound() },

  // QWERTY
  "Q"       : function() { findAndBlur.call(this)
                           this.$store.commit('changeActiveRegion', 'piano-selector') },
  "W"       : function() { this.$store.dispatch('setUpSceneChange', 'backward') },
  "E"       : function() { this.$store.dispatch('setUpSceneChange', 'forward') },
  "R"       : function() { this.$store.commit('resetScene') },
  "T"       : function() { findAndFocus.call(this, '#BPMInput') },
  "Y"       : function() { this.$store.commit('toggleChain')},
  "U"       : function() { this.$store.commit('toggleChainLoop')},
  "I"       : function() { this.$store.dispatch('toggleModulationStyle')},
  "O"       : function() { this.$store.dispatch('toggleAutoModulate')},
  "P"       : function() { this.$store.dispatch('morphSelectedNotes')},
  "{"       : function() { this.$store.dispatch('returnAllTunes')},
  "}"       : function() { this.$store.dispatch('changeAll')},
  "|"       : function() { this.$store.commit('toggleSuspendChanges') },

  // ASDFGH
  "A"       : function() { findAndBlur.call(this)
                           this.$store.commit('changeActiveRegion', 'tune-entry') },
  "S"       : function() { this.$store.dispatch('toggleTrackMute', this.$store.state.scenes[this.$store.state.editingSceneNumber].editingTrackNumber) },
  "D"       : function() { this.$store.commit('toggleTrackDelay', this.$store.state.scenes[this.$store.state.editingSceneNumber].editingTrackNumber) },
  "F"       : function() { this.$store.dispatch('fill') },
  "G"       : function() { this.$store.dispatch('changeTune', { trackIndex: this.editingTrackNumber, all: false }) },
  "H"       : function() { this.$store.commit('toggleHidePitches', this.editingTrackNumber)},
  "J"       : function() { findAndFocus.call(this, '#trackGain-'+this.scene.tracks[this.editingTrackNumber].id) },
  "K"       : function() { findAndFocus.call(this, '#trackFilterWet-'+this.scene.tracks[this.editingTrackNumber].id) },
  "L"       : function() { findAndFocus.call(this, '#trackLFOFrequency-'+this.scene.tracks[this.editingTrackNumber].id) },
  ":"       : function() { findAndFocus.call(this, '#changeTotal-'+this.scene.tracks[this.editingTrackNumber].id) },
  '"'       : function() { findAndFocus.call(this, '#changePer-'+this.scene.tracks[this.editingTrackNumber].id) },

  // ZXCVBN
  "Z"       : function() { findAndBlur.call(this);
                           this.$store.commit('changeActiveRegion', 'qwerty-player') },
  "X"       : function() { this.$store.commit('changeQwertyOctave', 'decrement') },
  "C"       : function() { this.$store.commit('changeQwertyOctave', 'increment') },
  "V"       : function() { this.$store.commit('toggleDelayActive') },
  "B"       : function() { this.$store.dispatch('toggleQwertyDisplay') },
  "N"       : function() { findAndFocus.call(this, '#playerGain') },
  "M"       : function() { findAndFocus.call(this, '#playerAttack') },
  "<"       : function() { findAndFocus.call(this, '#playerFilterWet') },
  ">"       : function() { findAndFocus.call(this, '#playerLFOFrequency') },
  "?"       : function() { this.$store.commit('toggleInfoMenu') },

}

// let's go with the three-layered layout - so it's more about the location on the keyboard than the letter name...
// available:
  //          Y           }
  //        full!
  //        V  B N M < > ?


export let tuneEntryDispatchTable = {
  'ArrowLeft'   : function() {
                          if (this.editingIndex > 0) { this.$store.commit('changeEditingIndex', 'decrement') }
                        },
  'ArrowRight'  : function() {
                          if (this.editingIndex < this.editingTune.length-1) {
                            this.$store.commit('changeEditingIndex', 'increment')
                          }
                        },
  'Delete'      : function() {
                          if (this.editingIndex === this.editingTune.length-1 ) {
                            this.$store.dispatch('deleteNote', 'fromEndcap')
                          } else {
                            this.$store.dispatch('deleteNote', 'currentNote')
                          }
                        },
  '`'           : function() { // Pick Note, random:true
                          const pitch = randomElement(this.pitchSets[this.editingTrackNumber]);
                          if (this.editingIndex === this.editingTune.length-1) {
                            this.$store.dispatch('randomNote', { change:'fromEndcap', pitch: pitch, random:'rests' })
                            if (this.$store.state.entrySound) { this.playEntryPitch(pitch) }
                          } else {
                            this.$store.dispatch('randomNote', { change:'toggleNoteRandom' })
                          }
                        },
  '~'           : function() { // Pick note, random:false
                          const pitch = randomElement(this.pitchSets[this.editingTrackNumber]);
                          if (this.$store.state.entrySound) { this.playEntryPitch(pitch) }
                          if (this.editingIndex === this.editingTune.length-1) {
                             this.$store.dispatch('randomNote', { change:'fromEndcap', pitch: pitch, random:'fixed' })
                          } else {
                            this.$store.dispatch('randomNote', { change:'currentNote', pitch: pitch, random:'check' })
                          }
                        },
  'ArrowDown'   : function() {
                          if (this.editingTrackNumber < this.tracks.length-1)
                            { this.$store.dispatch('changeEditingTrack', 'increment' ) }
                        },
  'ArrowUp'     : function() {
                          if (this.editingTrackNumber > 0 )
                            { this.$store.dispatch('changeEditingTrack', 'decrement' ) }
                        },
  'Enter'       : function()  {
                          if (this.editingTrackNumber === 0 ) {
                              this.$store.dispatch('enterTrack')
                          } else {
                            console.log("double track feature goes here")
                          }
                        },
}
