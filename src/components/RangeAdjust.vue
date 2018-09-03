<template>

	 <div class="range-adjust">

		 <div>
			 <span>Lo</span>
			 <select 	:id="'rangeLow-'+trackId"
			 					v-model:value="rangeLow"
			 					@focus="focusFunction"
       					@change="changeFunction($event)"
			 >
				 <option v-for="pitch in lowerRangeOptions" :key="Math.random().toString().slice(2)" >{{ pitch }}</option>
			 </select>
		 </div>
			<div>
				<span>Hi</span>
				<select 	:id="'rangeHigh-'+trackId"
									v-model:value="rangeHigh"
									@focus="focusFunction"
									@change="changeFunction($event)"
				>
					<option v-for="pitch in upperRangeOptions" :key="Math.random().toString().slice(2)" >{{ pitch }}</option>
				</select>
			</div>

	</div>

</template>

<script>
// https://www.reddit.com/r/vuejs/comments/8cchun/rendering_order_of_select_option/?st=jg1s57qb&sh=74171ee4

import {bus} from '../main.js'

export default{

		props: ['trackNumber', 'trackId'],

		data() {
			return {}
		},

		computed: {
			scene(){
				return this.$store.state.scenes[this.$store.state.editingSceneNumber]
			},
			rangeLow: {
				get(){
					return this.scene.tracks[this.trackNumber].rangeLow
				},
				set(value){
					this.$store.commit('adjustRange', { trackNumber: this.trackNumber, range: 'low', pitch: value })
				},
			},
			rangeHigh: {
				get(){
					return this.scene.tracks[this.trackNumber].rangeHigh
				},
				set(value){
					this.$store.commit('adjustRange', { trackNumber: this.trackNumber, range: 'high', pitch: value })
				},
			},

			upperRangeOptions: function () {
				const fullRange = this.$store.state.fullRange
				const highRange = fullRange.slice(fullRange.indexOf(this.rangeLow))
				return highRange.reverse()
			},
			lowerRangeOptions: function () {
				const fullRange = this.$store.state.fullRange
				const lowRange = fullRange.slice(0, fullRange.indexOf(this.rangeHigh)+1)
				return lowRange.reverse()
			}
	  },

		methods: {
			focusFunction(){
	      console.log("focussing")
				this.$store.commit('changePreviousRegion', this.$store.state.activeRegion)
				this.$store.commit('changeActiveRegion', 'track-controls')
	    },
	    changeFunction(event){
	      event.target.blur()
	      this.$store.commit('changeActiveRegion', this.$store.state.previousRegion)
				bus.$emit('clearKeyFromDown', 'Enter')
	    },
		},

		created(){

		}

}

</script>

<style >

.range-adjust {
/*  position: relative;*/
}

.range-adjust div {
	float:left;
}

.range-adjust span {
	display: inline-block;
	width: 20px;
}
.range-adjust select {
	width: 50px;
}


</style>
