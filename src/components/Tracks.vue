<template>



<!-- TRACKS -->

<div class="tracks-wrapper">

  <draggable v-model="tracks" @start="drag=true" @end="drag=false" > <!-- :move="possiblyUpdateEditingTrackNumber" -->

    <div class="track-container"
      v-for="(track, trackNumber) in tracks"
      :key="track.id"
      :class="{ activeRegion: activeRegion === 'tune-entry' && trackNumber === scene.editingTrackNumber }"
    >
        <track-controls class="track-controls-wrapper" :track-number="trackNumber" :track-id="track.id" ></track-controls>

        <div v-if="track.tune.length > 0" class="track-notes">
            <div class="note-container"
              v-for="(note, index) in track.tune"
              :class="{ editingCursor: trackNumber === editingTrackNumber && index === editingIndex,
                        insertCursor: editMode === 'insert',
                        noteClear: trackLineBreaks[trackNumber].indexOf(index) > -1
                      }"
            >
                <div class="note"
                  :class="{ noteAlternate: (index) % trackColorAlternations[trackNumber]*2 > trackColorAlternations[trackNumber]-1,
                            editingNote: trackNumber === editingTrackNumber && index === editingIndex,
                            randomNoRests: note.random === 'noRests',
                            randomRests: note.random === 'rests',
                            nowPlaying: scene.started && index === highlightedIndexes[trackNumber] }"
                >
                {{ track.hidePitches===true && note.pitch!="_" && note.pitch!=" " ? "?" : note.pitch }}
                </div>
            </div>
        </div>
        <div v-else class="track-notes">no notes yet...</div>

        <button v-if="track.id !=leadTrackId" class="remove-button" v-on:dblclick="removeTrack(trackNumber)">(X)</button>

        <track-sound-panel
            v-if="track.soundPanel"
            :track-number="trackNumber"
            :track-id="track.id" >
        </track-sound-panel>


    </div>



  </draggable>


</div>



</template>


<script>
import TrackControls from './TrackControls.vue'
import TrackSoundPanel from './TrackSoundPanel.vue'
import draggable from 'vuedraggable'


export default {
  name: 'tracks',
  components: {
    'track-sound-panel': TrackSoundPanel,
    'track-controls': TrackControls,
    'draggable': draggable,
  },

  data () {
    return {
    }
  },

  computed: {

    activeRegion(){
      return this.$store.state.activeRegion
    },
    scene(){
      return this.$store.state.scenes[this.editingSceneNumber]
    },
    editingSceneNumber(){
      return this.$store.state.editingSceneNumber
    },
    leadTrackId(){
      return this.scene.leadTrackId
    },
    tracks: {
        get() {
            return this.$store.state.scenes[this.editingSceneNumber].tracks
        },
        set(tracks) {
          this.$store.dispatch('setTracks', tracks)
        }
    },
    newTrack(){
      return this.$store.state.scenes[this.editingSceneNumber].tracks[0]
    },
    newTrackTune(){
      return this.$store.state.scenes[this.editingSceneNumber].tracks[0].tune
    },
    newTrackId(){
      return this.$store.state.scenes[this.editingSceneNumber].tracks[0].id
    },
    editingIndex(){
      return this.$store.state.scenes[this.editingSceneNumber].editingIndex
    },
    editingTrackNumber(){
      return this.$store.state.scenes[this.editingSceneNumber].editingTrackNumber
    },
    toneTunes(){
      return this.$store.getters.toneTunes
    },
    highlightedIndexes(){
      let highlightedIndexes = []
      this.$store.state.scenes[this.editingSceneNumber].tracks.forEach( (track, index) => {
        let val = track.toneTuneIndex-1
        highlightedIndexes.push( (val === -1) ? this.toneTunes[index].length-1 : val )
      })
      return highlightedIndexes
		},
    editMode(){
      return this.$store.state.editMode
    },
    trackColorAlternations(){
      let trackColorAlternations = []
      this.scene.tracks.forEach( (track, index) => {
        trackColorAlternations.push(track.colorAlternation)
      })
      return trackColorAlternations
      // return for (track in this.scene.tracks){ trackColorAlternations.push(track.colorAlternation) }
    },
    trackLineBreaks(){
      let trackLineBreaks = []
      this.scene.tracks.forEach( (track, index) => {
        trackLineBreaks.push(track.lineBreaks)
      })
      return trackLineBreaks
    },
  },

  methods: {
    removeTrack(trackNumber){
      this.$store.dispatch('removeTrack', trackNumber)
    },
//    possiblyUpdateEditingTrackNumber: function(evt){
//      console.log("evt.draggedContext.futureIndex", evt.draggedContext.futureIndex)
//    },
  },

};

</script>


<style>

.activeRegion {
  border: 1px solid white;
  box-shadow: 0px -1px 24px 3px rgba(255, 255, 255, 0.75);
/*  animation: blinker 2s linear infinite; */
}

.tracks-wrapper {
  border: 1px solid transparent;
  margin: 10px 0 10px 0;
}

.track-container {
  padding: 8px 16px 8px 0px;
  background-color: #777;
  position: relative;
  border: 1px solid black;
  margin: 3px;
}
.track-container:after {
  content: "";
  display: table;
  clear: both;
}

.track-controls-wrapper {
  border: 1px solid blue;
  min-width: 150px; min-height: 60px;
  float:left; /* if you make this inline-block there's extra space on top. Maybe: https://css-tricks.com/fighting-the-space-between-inline-block-elements/ */
}
.track-notes {
  padding: 4px 8px 4px 8px;
  margin: 0 0 0 10px;
  border: 1px solid black;
  background-color: #666;
  display: inline-block;
  min-height: 58px;
  min-width: 44px;
/*  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03); */
}

.remove-button {
  float: right;
}


/** NOTE Styles *****************************************************/

.note-container {
  display:block;
  float: left;
  padding: 3px 0 3px 0;
  border: 2px solid transparent;
 /*  background: #777; */
/*  box-shadow: inset 0 0 10px #faa; */
}

.note {
  background-color: rgba(130, 110, 255, 0.6);
  width: 34px; height: 30px;
  padding: 10px 4px 0 0px; border: 1px solid black; margin: 0 3px 0 3px;
  vertical-align:top;
  text-align:center;
}
.noteAlternate {
   background-color: rgba(170, 150, 255, 0.6);
}
.noteClear {
  clear: both;
}

.editingCursor {
  border-bottom: 1px solid white;
}
.editingCursor.insertCursor {
  border-bottom: 1px solid transparent;
  border-left: 1px solid white;
}

.nowPlaying {
  border: 1px dashed white;
}
.editingNote {
  font-weight: bold;
  color: white;
  box-shadow: 0px -1px 24px 3px rgba(255, 255, 255, 0.75);
  animation: blinker 1.4s linear infinite;
}
.randomNote {
  border-radius: 30%;
}

.randomNoRests {
  border-radius: 30%
}
.randomRests {
  border-radius: 50%
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

</style>
