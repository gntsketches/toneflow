<template>

  <div class="global-controls">

    <span class="file-name" >{{ fileName === 'default' ? 'new composition' : fileName }}</span>


    <div class="button-esq" v-on:click="save" >Save</div>
    <div class="button-esq" v-on:click="saveScene" >Save Scene</div>
    <div class="button-esq" v-on:click="load" >Load</div>

    <select v-on:change="changeLoadTarget" v-bind:value="fileName">
      <option v-for="name in fileNames" >{{ name }}</option>
    </select>

    <div class="button-esq" v-on:click="download" >Download</div>
    <div class="button-esq" v-on:click="downloadScene" >Download Scene</div>

<!--    <label class="fileContainer" >
        Upload
        <input type="file" @change="processFile($event)" />
    </label> -->

    <span>Upload:</span>
    <input type="file" class="button-esq" @change="processFile($event)" />

    <div class="button-esq info-menu-button" v-if="hideInfoMenu" v-on:click="toggleInfoMenu">Show Info</div>
    <div class="button-esq info-menu-button" v-else v-on:click="toggleInfoMenu">Hide Info</div>

    <div class="button-esq global-controls-right" v-on:click="toggleEditMode">{{ editMode }}</div>
    <div class="button-esq global-controls-right" v-on:click="toggleEntrySound">{{ entrySound }}</div>



  </div>

</template>



<script>

export default {

  data() {
    return {
      fileNames: []
    }
  },

  computed: {
    editMode(){
      let editMode = ucfirst(this.$store.state.editMode)
      return editMode
    },
    entrySound(){
      return this.$store.state.entrySound ? 'Entry Sound On' : 'Entry Sound Off'
    },
    fileName(){
      return this.$store.state.fileName
    },
    hideInfoMenu(){
      return this.$store.state.hideInfoMenu
    }

  },


  methods: {
    toggleEditMode(){
      this.$store.commit('toggleEditMode')
    },
    toggleEntrySound(){
      this.$store.commit('toggleEntrySound')
    },
    save(){
      this.$store.dispatch('save')
      this.getFileNames()
    },
    saveScene(){
      this.$store.dispatch('saveScene')
      this.getFileNames()
    },
    getFileNames(){
      let fileNames = []
      for (var key in localStorage){
        if (key.slice(0,4) === 'TF3_') {
          fileNames.push(key.slice(4))
        } else if (key.slice(0,5) === 'TF3S_') {
          fileNames.push(key.slice(3))
        }
      }
      this.fileNames = fileNames
    },
    changeLoadTarget(e){
      const loadTarget = 'TF3_' + e.target.value
      this.$store.commit('changeLoadTarget', loadTarget)
    },
    load(){
      this.$store.dispatch('load', localStorage.getItem( this.$store.state.loadTarget ))
    },
    download(){
      this.$store.dispatch('download')
    },
    downloadScene(){
      this.$store.dispatch('downloadScene')
    },
    processFile(event) {
      const file = event.target.files[0]
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        const json = JSON.parse(fileReader.result)  // JSON.parse here turns a string into a string... must be parsed *again* (in improvedLoad) to turn it into an object!
        this.$store.dispatch('load', json)
      })
      fileReader.readAsText(file)
    },

    toggleInfoMenu(){
      this.$store.commit('toggleInfoMenu')
    },
  },

  created(){
    this.getFileNames()
  },

}

// https://stackoverflow.com/questions/38744932/how-to-call-multiple-function-with-v-onclick

</script>


<style>

.file-name {
  font-size: 20px;
  padding: 2px 6px 2px 6px;
  background: #ccc;
}

.global-controls {
  margin: 0 0 10px 0;
  padding: 5px;
  background-color: #aaa;
}

/* https://coderwall.com/p/uer3ow/total-input-type-file-style-control-with-pure-css */
/*
.fileContainer {
    overflow: hidden;
    position: relative;
    display: inline-block;
    background: #abe;
    padding: 1px 5px;
}
.fileContainer [type=file] {
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
    cursor: pointer;
}
*/




/* https://stackoverflow.com/questions/5013683/css-float-and-padding */
.global-controls-right {
  float: right;
  margin: 0 10px 0 0;
}

.info-menu-button {
  float: right;
  margin: 0 10px 0 0;
}

</style>
