<template>
  <div class="change-track-note-duration">

    <input class="note-duration" type="number" min="0.05" step="0.05"
      :id="'changeDuration-'+trackId"
      :value="noteDurations[trackNumber]"
      @change="changeTrackNoteDuration"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    />

  </div>
</template>
<script>
export default {
  name: "",
  props: ['trackNumber', 'trackId'],
  data: () => ({

  }),

  computed: {
/*  // for some reason set is not working here:
    noteDuration: {
      get(){
        let noteDurations = []
        let scene = this.$store.state.scenes[this.$store.state.editingSceneNumber]
        scene.tracks.forEach( (track, index) => {
          noteDurations.push(track.noteDuration)
        })
        return noteDurations[this.trackNumber]
      },
      set(e){
        console.log("val", e.target.value)
      //  this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: e.target.value } )
      },
    },
*/

    noteDurations() {
      let noteDurations = []
      let scene = this.$store.state.scenes[this.$store.state.editingSceneNumber]
      scene.tracks.forEach( (track, index) => {
        noteDurations.push(track.noteDuration)
      })
      return noteDurations
    }
  },

  methods: {
    changeTrackNoteDuration(e){
      console.log("val", e.target.value)
      this.$store.commit('changeTrackNoteDuration', { trackNumber: this.trackNumber, duration: e.target.value } )
    },
    focusFunction(){
      this.$store.commit('changeActiveRegion', '')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', 'tune-entry')
    },
  },
}
</script>
<style>

.change-track-note-duration {
  display: inline-block;
}

.note-duration {
  width: 25px;
}


</style>
