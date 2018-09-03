
<template>

		<div class="piano-selector" :class="{ activeRegion: activeRegion === 'piano-selector' }" >
			<ul>
				<li class="white c" @click="handleSendSelections('C')" :class="{ selected: checkNoteSelect('C') }" >C</li>
				<li class="black cs" @click="handleSendSelections('C#')" :class="{ selected: checkNoteSelect('C#') }" >C#</li>
				<li class="white d" @click="handleSendSelections('D')" :class="{ selected: checkNoteSelect('D') }" >D</li>
				<li class="black ds" @click="handleSendSelections('D#')" :class="{ selected: checkNoteSelect('D#') }" >D#</li>
				<li class="white e" @click="handleSendSelections('E')" :class="{ selected: checkNoteSelect('E') }" >E</li>
				<li class="white f" @click="handleSendSelections('F')" :class="{ selected: checkNoteSelect('F') }" >F</li>
				<li class="black fs" @click="handleSendSelections('F#')" :class="{ selected: checkNoteSelect('F#') }" >F#</li>
				<li class="white g" @click="handleSendSelections('G')" :class="{ selected: checkNoteSelect('G') }" >G</li>
				<li class="black gs" @click="handleSendSelections('G#')" :class="{ selected: checkNoteSelect('G#') }" >G#</li>
				<li class="white a" @click="handleSendSelections('A')" :class="{ selected: checkNoteSelect('A') }" >A</li>
				<li class="black as" @click="handleSendSelections('A#')" :class="{ selected: checkNoteSelect('A#') }" >A#</li>
				<li class="white b" @click="handleSendSelections('B')" :class="{ selected: checkNoteSelect('B') }" >B</li>
			</ul>
		</div>

</template>

<script>

export default {

	  data() {
			return {
			}
	  },

		computed: {
			activeRegion(){
				return this.$store.state.activeRegion
			},
			editingSceneNumber(){
				return this.$store.state.editingSceneNumber
			},
			selectedNotes(){
				return this.$store.state.scenes[this.editingSceneNumber].selectedNotes
			},
		},

	  methods: {
			handleSendSelections: function (note) {
				this.$store.commit('updateSelectedNotes', note)
	    },

			checkNoteSelect: function(note) {
				if (this.selectedNotes.indexOf(note) === -1) { return false}
				else { return true }
			}

	  },

}

</script>


<style>

.piano-selector {
  margin: 0 0 10px 0;
	float: left;
	border: 1px solid transparent
}
.piano-selector.activeRegion {
	border: 1px solid white;
	box-shadow: 0px -1px 24px 3px rgba(255, 255, 255, 0.75);
/*	animation: blinker 2s linear infinite; */
}

.piano-selector ul {
	height:110px; width:300px;
	position:relative;
	border:1px solid #160801;
	background: #aaf;
	vertical-align: bottom;
}

.piano-selector li {
	display: inline-block;
	list-style:none;
	position:relative;
	float:left;
	text-align: center;
	cursor: pointer;
}


.piano-selector .white {
	height:100px; width:40px;
	z-index:1;
	border: 1px solid black;
	background: white;
	line-height: 165px;

}

.piano-selector .black {
	height:60px; width:30px;
	margin:0 0 0 -16px;
	z-index:2;
	border:1px solid #000;
	background: #333;
	line-height: 80px;
	color: white;
}

.piano-selector .white.selected { background: #8d8 }
.piano-selector .black.selected { background: #070 }

.piano-selector .d,.e,.g,.a,.b { margin:0 0 0 -16px;  }
.piano-selector .f { margin: 0 0 0 0px}


</style>
