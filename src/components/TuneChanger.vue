<template>

<div class="tune-changer">

  <div class="button-esq" v-on:click="changeTune">Change</div>
  <input  :id="'changeTotal-'+trackId"
          v-bind:class="{ greyOut: scene.suspendChanges }"
          type="number" min="0"
          v-bind:max="getMaxChangeable"
          v-bind:value="changeTotal"
          v-on:change="updateChangeTotal($event.target.value)"
          @focus="focusFunction"
          @keyup.enter="enterFunction($event)"
          @blur="enterFunction($event)"
  >
  <span>per</span>
  <input  :id="'changePer-'+trackId"
          v-bind:class="{ greyOut: scene.suspendChanges }"
          type="number" min="0"
          v-bind:value="changePer"
          v-on:change="updateChangePer"
          @focus="focusFunction"
          @keyup.enter="enterFunction($event)"
          @blur="enterFunction($event)"
  >

</div>


</template>


<script>

export default {

  props: ['trackNumber', 'trackId'],

  data () {
    return {}
  },

  computed: {
    scene(){
      return this.$store.state.scenes[this.$store.state.editingSceneNumber]
    },
    track(){
      return this.scene.tracks[this.trackNumber]
    },
    getMaxChangeable(){
      return this.$store.getters.maxChangeables[this.trackNumber]
    },
    changeTotal(){
      let changeTotal = this.scene.tracks[this.trackNumber].changeTotal
      // the problem with this next line is (was?), while it does automatically drop changeTotal when you de-randomable a note, it also automatically increases changeTotal when you randomable a note
      if (changeTotal > this.getMaxChangeable) { changeTotal = this.getMaxChangeable }
      return changeTotal
    },
    changePer(){
      let changePer = this.scene.tracks[this.trackNumber].changePer
      return changePer
    },
  },

  watch:{
    getMaxChangeable(value){  // for case when user changes a note.random to 'fixed'
      if (value < this.track.changeTotal) { this.updateChangeTotal(value) }
    },
  },

  methods: {
    changeTune(){
      this.$store.dispatch('changeTune', { trackIndex: this.trackNumber, all: false })
    },
    updateChangeTotal(value){
      this.$store.commit('updateChangeTotal', { trackNumber: this.trackNumber, value: value })
    },
    updateChangePer(e){
      this.$store.commit('updateChangePer', { trackNumber: this.trackNumber, value: e.target.value })
    },
    focusFunction(){
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', 'track-controls')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
    },
  },

}


</script>


<style>

.tune-changer {
}

.tune-changer span {
	display: inline-block;
/*	width: 20px;*/
}
.tune-changer input {
	width: 20px;
}


</style>
