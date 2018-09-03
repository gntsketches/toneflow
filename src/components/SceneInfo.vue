<template>

  <div class="scene-info">

    <input
      class="scene-title"
      v-model.lazy="sceneTitle"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    >

    <span>BPM</span>
    <input id="BPMInput" type="number" min="1"
      :value="getBPM"
      @change="changeTempo"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    ></input>
    <!--      @keyup.enter="$event.target.blur()" -->

    <span>Lead#</span>
    <!-- how does focus & enter work on select? it does work in the DOM https://jsfiddle.net/0eh6z947/ -->
    <!-- https://stackoverflow.com/questions/50434769/receive-event-object-in-vuex-v-model-setter?noredirect=1#comment87903913_50434769 -->
    <!-- note that v-model set is only called when the value changes. @keyup.enter="enterFunction($event)" doesn't work, is it possible to get enter to work on this some other way? For the moment looks like you'd need to use the global keyup listener (blur selects, possibly testing for active element as region)  -->
    <select id="leadSelect"
      v-model:value="leadTrackNumber"
      @focus="focusFunction"
      @change="enterFunction($event)"
      >
      <option
        v-for="(track, index) in scene.tracks "
        :key="Math.random().toString().slice(2)"
      >{{ index }}</option>
    </select>

    <br>

    <span>Chain Reps</span>
    <input type="number" min="0"
      v-model:value="chainAdvancePer"
      @focus="focusFunction"
      @keyup.enter="enterFunction($event)"
    ></input>
    <div class="scene-advance-meter">
      <div v-if="scene.started && (this.$store.state.advanceTriggered || this.$store.state.chain)" v-bind:style="{ width: sceneAdvanceProgress + '%' }"></div>
    </div>
    <span>=></span>
    <div class="scene-advance-title">
      <div v-if="this.$store.state.advanceTriggered || this.$store.state.chain" >{{ advanceSceneTitle }}</div>
    </div>

    <br>

    <div class="button-esq" v-on:click="resetScene" >Reset Scene</div>

    <div class="button-esq" v-if="suspendChanges" @click="toggleSuspendChanges">Changes Suspended</div>
    <div class="button-esq" v-else @click="toggleSuspendChanges">Changes Active</div>



  </div>

</template>


<script>

  /*https://forum.vuejs.org/t/how-to-listen-for-an-enter-on-an-element-ui-form/11631 */


export default {

  computed: {
    scene(){
      return this.$store.state.scenes[this.$store.state.editingSceneNumber]
    },
    toneTunes(){
      return this.$store.getters.toneTunes
    },
    sceneTitle: {
      get(){
        return this.scene.title
      },
      set(title){
        this.$store.dispatch('updateSceneTitle', title)
      },
    },
    leadTrackNumber: {
      get(){
        let leadTrackNumber = ''
        this.scene.tracks.forEach( (track, index) => {
          if (track.id === this.scene.leadTrackId) { leadTrackNumber = index }
        })
        return leadTrackNumber
        // return this.$store.getters.leadTrackNumber ...?
      },
      set(value){
        this.$store.commit('updateLeadTrack', value )
      },
    },
    getBPM(){
      return this.scene.bpm
    },
    chainAdvancePer: {
      get(){
        return this.scene.chainAdvancePer
      },
      set(value){
        console.log(value)
        this.$store.commit('updateChainAdvancePer', value)
      },
    },
    sceneAdvanceProgress(){
      let leadTrackStepTotal = this.toneTunes[this.leadTrackNumber].length
      if (this.$store.state.chain) {
        let stepsNeeded = leadTrackStepTotal * this.scene.chainAdvancePer
        let wellThoughtOutVariableName = leadTrackStepTotal * this.scene.leadCycles + this.scene.tracks[this.leadTrackNumber].toneTuneIndex
        let stepsSoFar = (wellThoughtOutVariableName === 0) ? stepsNeeded : wellThoughtOutVariableName
        let stepPercent = isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
        return stepPercent
      } else {
        let stepsNeeded = leadTrackStepTotal
        let toneTuneIndex =  this.scene.tracks[this.leadTrackNumber].toneTuneIndex
        let stepsSoFar = (toneTuneIndex === 0) ? stepsNeeded : toneTuneIndex
        let stepPercent = isNaN(stepsSoFar/stepsNeeded) ? 0 : (stepsSoFar/stepsNeeded) * 100
        return stepPercent
      }
    },
    advanceSceneTitle(){
      return this.$store.getters.advanceSceneTitle
    },
    suspendChanges(){
      return this.scene.suspendChanges
    },

  },
  methods: {
    resetScene(){
      this.$store.commit('resetScene')
    },
    changeTempo(e){
      console.log("changing tempo")
      if (e.target.value > 0){ this.$store.commit('changeTempo', e) }
    },
    focusFunction(){
      console.log("focussing")
      this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
      this.$store.commit('changeActiveRegion', '')
    },
    enterFunction(event){
      event.target.blur()
      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
    },
    toggleSuspendChanges(){
      this.$store.commit('toggleSuspendChanges')
    },
  },

  created: function () {
  },

}


</script>


<style>

.scene-info {
  background: #b77;
  margin: 0 0 10px 0;
  float: left;
}

.scene-info input {
  width: 60px;
  margin: 3px;
}

.scene-info span {
  margin: 0px 0 0 3px;
}

/* whaaa why isn't this overriding? */
.scene-title {
  width: 100px;
}

.scene-advance-meter {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
  /*  margin: 0 auto 20px auto; */
}
.scene-advance-meter div{
  height: 14px;
  background: blue;
}
.scene-advance-title {
  display: inline-block;
  width: 100px;
  min-height: 14px;
  border: 1px solid #000;
}
.scene-advance-title div {
  font-size: 14px;
  overflow: hidden;
}

/*
.image-button {
  display: inline-block;
  background: #aaf;
  border-radius: 100%;
  text-align: center;
}
img {
  <div class="image-button"><img src="../assets/headphones1.png" /></div>
  width: 50%;
}
*/
</style>
