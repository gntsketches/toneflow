//https://www.reddit.com/r/javascript/comments/8l9h2j/use_of_keypress_library_with_conditional_input/?st=jhi4stc9&sh=44da25e6

export function keypress() {
  let listener = new window.keypress.Listener();
  // prevent_default:true prevents sub combo from registering in non-keypress listener...

  // CTRL-SHIFT-
  listener.register_combo({
    "keys"              : "control shift w",
    "on_keydown"        : function() { this.$store.commit('setSceneAdvanceCued', false) },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": false,
  });
  listener.register_combo({
    "keys"              : "control shift e",
    "on_keydown"        : function() { this.$store.commit('setSceneAdvanceCued', false) },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": false,
  });
  listener.register_combo({
    "keys"              : "control shift p",
    "on_keydown"        : function() { this.$store.commit('toggleSoundPanel', this.editingTrackNumber) },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": false,
  });
  listener.register_combo({
    "keys"              : "control shift }",
    "on_keydown"        : function() { this.$store.dispatch('changeAll', 'all')},
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": false,
  });
  listener.register_combo({
    "keys"              : "control shift s",
    "on_keydown"        : function() { this.$store.dispatch('spreadTune') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control shift d",
    "on_keydown"        : function() { this.$store.dispatch('doubleTune') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true,
  });
  listener.register_combo({
    "keys"              : "control shift f",
    "on_keydown"        : function() { this.$store.commit('toggleFilterOnChange') },
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
  listener.register_combo({
    "keys"              : "control shift m",
    "on_keydown"        : function() { findAndFocus.call(this, '#modulatePerLeadChanges') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": false,
  });



// SEQUENCE

listener.register_combo({
  "keys"              : "control shift 1",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 1) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 2",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 2) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 3",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 3) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 4",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 4) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 5",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 5) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 6",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 6) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 7",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 7) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 8",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 8) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 9",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 9) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift 0",
  "on_keydown"        : function() { this.$store.commit('assignPlayerParamSetting', 0) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift =",
  "on_keydown"        : function() { this.$store.dispatch('addRandomNoteToAllTracks') },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
  listener.register_combo({
    "keys"              : "control shift -",
    "on_keydown"        : function() { this.$store.dispatch('deleteNoteFromAllTracks') },
    "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
  });
listener.register_combo({
  "keys"              : "control shift z",
  "on_keydown"        : function() { console.log("*") },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift a",
  "on_keydown"        : function() { console.log("*** *** ***") },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift i",
  "on_keydown"        : function() { this.$store.dispatch('initializeSceneAudio', this.$store.state.editingSceneNumber) },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});
listener.register_combo({
  "keys"              : "control shift s",
  "on_keydown"        : function() { this.$store.dispatch('setUpNewScene') },
  "this": this, "prevent_default": false, "prevent_repeat": true, "is_unordered": true, "is_sequence": true,
});




  // CTRL-

  listener.register_combo({
    "keys"              : "control enter",
    "on_keydown"        : function()  { this.$store.dispatch('addTrack') },
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

  // ALT-
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





export let generalKeyDispatchTable = {

  "Insert"  : function() { this.$store.commit('toggleEditMode') },
  "Escape"  : function() { this.togglePlay() },

  // 12345
  "!"       : function() { this.$store.commit('activatePlayerParamSettings', 1) },
  "@"       : function() { this.$store.commit('activatePlayerParamSettings', 2) },
  "#"       : function() { this.$store.commit('activatePlayerParamSettings', 3) },
  "$"       : function() { this.$store.commit('activatePlayerParamSettings', 4) },
  "%"       : function() { this.$store.commit('activatePlayerParamSettings', 5) },
  "^"       : function() { this.$store.commit('activatePlayerParamSettings', 6) },
  "&"       : function() { this.$store.commit('activatePlayerParamSettings', 7) },
  "*"       : function() { this.$store.commit('activatePlayerParamSettings', 8) },
  "("       : function() { this.$store.commit('activatePlayerParamSettings', 9) },
  ")"       : function() { this.$store.commit('activatePlayerParamSettings', 0) },
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
  "P"       : function() { this.$store.dispatch('morphSelectedNotes', true)},
  "{"       : function() { this.$store.dispatch('returnAllTunes')},
  "}"       : function() { this.$store.dispatch('changeAll', 'changeTotal')},
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
  "K"       : function() { findAndFocus.call(this, '#trackDelayTime-'+this.scene.tracks[this.editingTrackNumber].id) },
  "L"       : function() { findAndFocus.call(this, '#trackLFOFrequency-'+this.scene.tracks[this.editingTrackNumber].id) },
  ":"       : function() { findAndFocus.call(this, '#changeTotal-'+this.scene.tracks[this.editingTrackNumber].id) },
  '"'       : function() { findAndFocus.call(this, '#changePitchPercent-'+this.scene.tracks[this.editingTrackNumber].id) },

  // ZXCVBN
  "Z"       : function() { findAndBlur.call(this);
                           this.$store.commit('changeActiveRegion', 'qwerty-player') },
  "X"       : function() { this.$store.commit('changeQwertyOctave', 'decrement') },
  "C"       : function() { this.$store.commit('changeQwertyOctave', 'increment') },
  "V"       : function() { this.$store.commit('toggleDelayActive') },
  "B"       : function() { this.$store.dispatch('toggleQwertyDisplay') },
  "N"       : function() { findAndFocus.call(this, '#playerGain') },
  "M"       : function() { findAndFocus.call(this, '#playerPortamento') },
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
  //'Enter'       : function()  { this.$store.dispatch('addTrack') },
}
