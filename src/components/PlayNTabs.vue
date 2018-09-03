<template>
  <div class="play-n-tabs">

    <div class="button-esq" v-if="!playing" v-on:click="togglePlay" >Play</div>
    <div class="button-esq" v-else v-on:click="togglePlay" >Pause</div>

    <div class="button-esq" v-if="!chain" v-on:click="toggleChain" >Chain: Off</div>
    <div class="button-esq" v-else v-on:click="toggleChain" >Chain: On </div>

    <div class="button-esq chainLoop" v-if="this.$store.state.chainLoop" @click="toggleChainLoop">Loop</div>
    <div class="button-esq chainLoop" v-else @click="toggleChainLoop">Once</div>

    <div class="scene-tabs">
        <draggable v-model="scenes" @start="drag=true" @end="drag=false" >
          <div class="scene-tab"
               v-for="(scene, sceneIndex) in scenes"
               :class="{ currentScene: sceneIndex === state.editingSceneNumber }"
               @click="setUpSceneChange(sceneIndex)"
               :key="scene.id" >
            <span>{{ scene.title }}</span>
            <div class="button-esq" v-on:click.stop="moveScene('bench', scene.id)">-</div>
          </div>
        </draggable>
    </div>

    <div class="button-esq add-scene" v-on:click="setUpNewScene">+</div>

    <div class="scene-bench-tabs">
        <div class="scene-bench-tab" v-for="(scene, sceneIndex) in sceneBench" :key="scene.id" >
          <span>{{ scene.title }}</span>
          <div class="button-esq" v-on:click="moveScene('flow', scene.id)">+</div>
          <div class="button-esq" v-on:click="deleteScene(scene)">-</div>
        </div>
    </div>


  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: "",
  data: () => ({
  }),
  components: {
    'draggable': draggable,
  },

  computed: {
    state(){
      return this.$store.state
    },
    playing(){
      return this.$store.state.playing
    },
    chain(){
      return this.$store.state.chain
    },
    chainRepsToEnd: {
      get(){
        return this.$store.state.chainRepsToEnd
      },
      set(value){
        this.$store.commit('updateChainRepsToEnd', value)
      },
    },
    scenes: {
      get() {
        return this.$store.state.scenes
      },
      set(scenes) {
        this.$store.commit('setScenes', scenes)
      },
    },
    sceneBench(){
      return this.$store.state.sceneBench
    },

  },

  methods: {
    togglePlay(){
      this.$store.commit('togglePlay')
    },
    toggleChain(){
      this.$store.commit('toggleChain')
    },
/*    updateSceneTitle(sceneIndex, e){
      console.log('sceneIndex', sceneIndex, "e", e)
      this.$store.commit(updateSceneTitle)
    }, */
    toggleChainLoop(){
      this.$store.commit('toggleChainLoop')
    },
    setUpNewScene(){
      this.$store.dispatch('setUpNewScene')
    },
    setUpSceneChange(sceneIndex){
      this.$store.dispatch('setUpSceneChange', sceneIndex)
    },
    moveScene(move, sceneId){
      this.$store.commit('moveScene', { move: move, sceneId: sceneId } )
    },
    deleteScene(scene){
      let del = confirm('Delete scene "' + scene.title + '" ?' )
      if (del) { this.$store.commit('deleteScene', scene.id) }
    },
  },
}
</script>

<style>

.play-n-tabs {
  margin: 0 0 10px 0;
}

.chainLoop {
  cursor: pointer;
}

.scene-tabs {
  background: #858;
  display: inline-block;
  padding: 5px;
}

.scene-tab {
  display: inline-block;
  background: #aaa;
  padding: 0 3px;
  margin: 0 3px;
  min-width: 100px;
}

.add-scene {
}

.currentScene {
  box-shadow: 0px -1px 24px 3px rgba(255, 255, 255, 0.75);
}

.scene-bench-tabs {
  background: #885;
  display: inline-block;
  float: right;
  padding: 2px
}

.scene-bench-tab {
  display: inline-block;
  background: #aaa;
  padding: 0 3px;
  margin: 0 3px;
}

</style>
