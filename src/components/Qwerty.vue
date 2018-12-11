<template>

<div id="qwerty" :class="{ activeRegion: activeRegion === 'qwerty-player' }" >
    <!-- <textarea id="write" rows="6" cols="60"></textarea> -->
    <ul id="keyboard">
        <li :class="{ active: allDown.indexOf('`') >-1 || down.indexOf('~') >-1 }" class="symbol">R</li>
        <li :class="{ active: allDown.indexOf('1') >-1 }" @mousedown="startPitch('1')" @mouseup="stopPitch('1')" @mouseleave="stopPitch('1')" class="symbol">{{ qwertyVals["1"] }}</li>
        <li :class="{ active: allDown.indexOf('2') >-1 }" @mousedown="startPitch('2')" @mouseup="stopPitch('2')" @mouseleave="stopPitch('2')" class="symbol">{{ qwertyVals["2"] }}</li>
        <li :class="{ active: allDown.indexOf('3') >-1 }" @mousedown="startPitch('3')" @mouseup="stopPitch('3')" @mouseleave="stopPitch('3')" class="symbol">{{ qwertyVals["3"] }}</li>
        <li :class="{ active: allDown.indexOf('4') >-1 }" @mousedown="startPitch('4')" @mouseup="stopPitch('4')" @mouseleave="stopPitch('4')" class="symbol">{{ qwertyVals["4"] }}</li>
        <li :class="{ active: allDown.indexOf('5') >-1 }" @mousedown="startPitch('5')" @mouseup="stopPitch('5')" @mouseleave="stopPitch('5')" class="symbol">{{ qwertyVals["5"] }}</li>
        <li :class="{ active: allDown.indexOf('6') >-1 }" @mousedown="startPitch('6')" @mouseup="stopPitch('6')" @mouseleave="stopPitch('6')" class="symbol">{{ qwertyVals["6"] }}</li>
        <li :class="{ active: allDown.indexOf('7') >-1 }" @mousedown="startPitch('7')" @mouseup="stopPitch('7')" @mouseleave="stopPitch('7')" class="symbol">{{ qwertyVals["7"] }}</li>
        <li :class="{ active: allDown.indexOf('8') >-1 }" @mousedown="startPitch('8')" @mouseup="stopPitch('8')" @mouseleave="stopPitch('8')" class="symbol">{{ qwertyVals["8"] }}</li>
        <li :class="{ active: allDown.indexOf('9') >-1 }" @mousedown="startPitch('9')" @mouseup="stopPitch('9')" @mouseleave="stopPitch('9')" class="symbol">{{ qwertyVals["9"] }}</li>
        <li :class="{ active: allDown.indexOf('0') >-1 }" @mousedown="startPitch('0')" @mouseup="stopPitch('0')" @mouseleave="stopPitch('0')" class="symbol">{{ qwertyVals["0"] }}</li>
        <li :class="{ active: allDown.indexOf('-') >-1 }" @mousedown="startPitch('-')" @mouseup="stopPitch('-')" @mouseleave="stopPitch('-')" class="symbol">{{ qwertyVals["-"] }}</li>
        <li :class="{ active: allDown.indexOf('=') >-1 }" @mousedown="startPitch('=')" @mouseup="stopPitch('=')" @mouseleave="stopPitch('0')" class="symbol">{{ qwertyVals["="] }}</li>
        <li :class="{ active: allDown.indexOf('Backspace') >-1 }" @mousedown="startPitch('Backspace')" @mouseup="stopPitch('Backspace')" @mouseleave="stopPitch('Backspace')" class="delete lastitem">{{ qwertyVals["Backspace"] }}</li>
        <li class="tab"></li>
        <li :class="{ active: allDown.indexOf('q') >-1 }" @mousedown="startPitch('q')" @mouseup="stopPitch('q')" @mouseleave="stopPitch('q')" ref="qwerty-q" class="letter" >{{ qwertyVals["q"] }}</li>
        <li :class="{ active: allDown.indexOf('w') >-1 }" @mousedown="startPitch('w')" @mouseup="stopPitch('w')" @mouseleave="stopPitch('w')" ref="qwerty-w" class="letter">{{ qwertyVals["w"] }}</li>
        <li :class="{ active: allDown.indexOf('e') >-1 }" @mousedown="startPitch('e')" @mouseup="stopPitch('e')" @mouseleave="stopPitch('e')" ref="qwerty-e"class="letter">{{ qwertyVals["e"] }}</li>
        <li :class="{ active: allDown.indexOf('r') >-1 }" @mousedown="startPitch('r')" @mouseup="stopPitch('r')" @mouseleave="stopPitch('r')" ref="qwerty-r" class="letter">{{ qwertyVals["r"] }}</li>
        <li :class="{ active: allDown.indexOf('t') >-1 }" @mousedown="startPitch('t')" @mouseup="stopPitch('t')" @mouseleave="stopPitch('t')" ref="qwerty-t" class="letter">{{ qwertyVals["t"] }}</li>
        <li :class="{ active: allDown.indexOf('y') >-1 }" @mousedown="startPitch('y')" @mouseup="stopPitch('y')" @mouseleave="stopPitch('y')" ref="qwerty-y" class="letter">{{ qwertyVals["y"] }}</li>
        <li :class="{ active: allDown.indexOf('u') >-1 }" @mousedown="startPitch('u')" @mouseup="stopPitch('u')" @mouseleave="stopPitch('u')" ref="qwerty-u" class="letter">{{ qwertyVals["u"] }}</li>
        <li :class="{ active: allDown.indexOf('i') >-1 }" @mousedown="startPitch('i')" @mouseup="stopPitch('i')" @mouseleave="stopPitch('i')" ref="qwerty-i" class="letter">{{ qwertyVals["i"] }}</li>
        <li :class="{ active: allDown.indexOf('o') >-1 }" @mousedown="startPitch('o')" @mouseup="stopPitch('o')" @mouseleave="stopPitch('o')" ref="qwerty-o" class="letter">{{ qwertyVals["o"] }}</li>
        <li :class="{ active: allDown.indexOf('p') >-1 }" @mousedown="startPitch('p')" @mouseup="stopPitch('p')" @mouseleave="stopPitch('p')" ref="qwerty-p" class="letter">{{ qwertyVals["p"] }}</li>
        <li :class="{ active: allDown.indexOf('[') >-1 }" @mousedown="startPitch('[')" @mouseup="stopPitch('[')" @mouseleave="stopPitch('[')" ref="qwerty-[" class="symbol">{{ qwertyVals["["] }}</li>
        <li :class="{ active: allDown.indexOf(']') >-1 }" @mousedown="startPitch(']')" @mouseup="stopPitch(']')" @mouseleave="stopPitch(']')" ref="qwerty-]" class="symbol">{{ qwertyVals["]"] }}</li>
        <li :class="{ active: allDown.indexOf('\\') >-1 }" @mousedown="startPitch('\\')" @mouseup="stopPitch('\\')" @mouseleave="stopPitch('\\')" ref="qwerty-\" class="symbol lastitem">{{ qwertyVals["\\"] }}</li>
        <li class="capslock"></li>
        <li :class="{ active: allDown.indexOf('a') >-1 }" @mousedown="startPitch('a')" @mouseup="stopPitch('a')" @mouseleave="stopPitch('a')" class="letter">{{ qwertyVals["a"] }}</li>
        <li :class="{ active: allDown.indexOf('s') >-1 }" @mousedown="startPitch('s')" @mouseup="stopPitch('s')" @mouseleave="stopPitch('s')" class="letter">{{ qwertyVals["s"] }}</li>
        <li :class="{ active: allDown.indexOf('d') >-1 }" @mousedown="startPitch('d')" @mouseup="stopPitch('d')" @mouseleave="stopPitch('d')" class="letter">{{ qwertyVals["d"] }}</li>
        <li :class="{ active: allDown.indexOf('f') >-1 }" @mousedown="startPitch('f')" @mouseup="stopPitch('f')" @mouseleave="stopPitch('f')" class="letter">{{ qwertyVals["f"] }}</li>
        <li :class="{ active: allDown.indexOf('g') >-1 }" @mousedown="startPitch('g')" @mouseup="stopPitch('g')" @mouseleave="stopPitch('g')" class="letter">{{ qwertyVals["g"] }}</li>
        <li :class="{ active: allDown.indexOf('h') >-1 }" @mousedown="startPitch('h')" @mouseup="stopPitch('h')" @mouseleave="stopPitch('h')" class="letter">{{ qwertyVals["h"] }}</li>
        <li :class="{ active: allDown.indexOf('j') >-1 }" @mousedown="startPitch('j')" @mouseup="stopPitch('j')" @mouseleave="stopPitch('j')" class="letter">{{ qwertyVals["j"] }}</li>
        <li :class="{ active: allDown.indexOf('k') >-1 }" @mousedown="startPitch('k')" @mouseup="stopPitch('k')" @mouseleave="stopPitch('k')" class="letter">{{ qwertyVals["k"] }}</li>
        <li :class="{ active: allDown.indexOf('l') >-1 }" @mousedown="startPitch('l')" @mouseup="stopPitch('l')" @mouseleave="stopPitch('l')" class="letter">{{ qwertyVals["l"] }}</li>
        <li :class="{ active: allDown.indexOf(';') >-1 }" @mousedown="startPitch(';')" @mouseup="stopPitch(';')" @mouseleave="stopPitch(';')" class="symbol">{{ qwertyVals[";"] }}</li>
        <li :class="{ active: allDown.indexOf('\'') >-1 }" @mousedown="startPitch('\'')" @mouseup="stopPitch('\'')" @mouseleave="stopPitch('\'')" class="symbol">{{ qwertyVals["'"] }}</li>
        <li :class="{ active: allDown.indexOf('Enter') >-1 }" class="return lastitem">Enter</li>
        <li class="left-shift"></li>
        <li :class="{ active: allDown.indexOf('z') >-1 }" @mousedown="startPitch('z')" @mouseup="stopPitch('z')" @mouseleave="stopPitch('z')" ref="qwerty-z" class="letter">{{ qwertyVals["z"] }}</li>
        <li :class="{ active: allDown.indexOf('x') >-1 }" @mousedown="startPitch('x')" @mouseup="stopPitch('x')" @mouseleave="stopPitch('x')" ref="qwerty-x" class="letter">{{ qwertyVals["x"] }}</li>
        <li :class="{ active: allDown.indexOf('c') >-1 }" @mousedown="startPitch('c')" @mouseup="stopPitch('c')" @mouseleave="stopPitch('c')" class="letter">{{ qwertyVals["c"] }}</li>
        <li :class="{ active: allDown.indexOf('v') >-1 }" @mousedown="startPitch('v')" @mouseup="stopPitch('v')" @mouseleave="stopPitch('v')" class="letter">{{ qwertyVals["v"] }}</li>
        <li :class="{ active: allDown.indexOf('b') >-1 }" @mousedown="startPitch('b')" @mouseup="stopPitch('b')" @mouseleave="stopPitch('b')" class="letter">{{ qwertyVals["b"] }}</li>
        <li :class="{ active: allDown.indexOf('n') >-1 }" @mousedown="startPitch('n')" @mouseup="stopPitch('n')" @mouseleave="stopPitch('n')" class="letter">{{ qwertyVals["n"] }}</li>
        <li :class="{ active: allDown.indexOf('m') >-1 }" @mousedown="startPitch('m')" @mouseup="stopPitch('m')" @mouseleave="stopPitch('m')" class="letter">{{ qwertyVals["m"] }}</li>
        <li :class="{ active: allDown.indexOf(',') >-1 }" @mousedown="startPitch(',')" @mouseup="stopPitch(',')" @mouseleave="stopPitch(',')" class="symbol">{{ qwertyVals[","] }}</li>
        <li :class="{ active: allDown.indexOf('.') >-1 }" @mousedown="startPitch('.')" @mouseup="stopPitch('.')" @mouseleave="stopPitch('.')" class="symbol">{{ qwertyVals["."] }}</li>
        <li :class="{ active: allDown.indexOf('/') >-1 }" @mousedown="startPitch('/')" @mouseup="stopPitch('/')" @mouseleave="stopPitch('/')" class="symbol">{{ qwertyVals["/"] }}</li>
        <li class="right-shift lastitem"></li>
    </ul>
    {{ down }}
</div>


</template>

<script>

// https://www.reddit.com/r/vuejs/comments/8izmhj/best_approach_to_x_y_coordinate_box/?st=jh5j4qi6&sh=54697a12

export default {
  name: "",

  props: ['down', 'playerInstrument'],

  data: () => ({
    mouseplaying: ["test"],
  }),

  computed: {
    activeRegion(){
      return this.$store.state.activeRegion
    },
    qwertyVals(){
      return this.$store.getters.qwertyVals
    },
    allDown(){
      //let allDown = this.down.concat(this.mouseplaying)
      return this.down.concat(this.mouseplaying)
    },
  },

  methods: {
    startPitch(key){
      // in-progress: getting the keys to light up on mousedown
      this.playerInstrument.triggerAttack(this.qwertyVals[key], Tone.context.currentTime)
      this.mouseplaying.push(key)
    },
    stopPitch(key){
      if (this.$store.state.playerParams.instrumentType === 'monoSynth'){
        this.playerInstrument.triggerRelease()
      } else {
        this.playerInstrument.triggerRelease(this.qwertyVals[key])
      }
      this.mouseplaying.splice(this.mouseplaying.indexOf(key), 1)
    },
/*  Not using...
    highlightKey(key){
      const qwertyId = 'qwerty-' + key
      console.log("qwertyDisplay ref key", key)
    },
    test(){
      console.log("qwertyDisplay ref test yes")
    },
*/

  },

}
</script>

<style>

#qwerty {
/*  margin: 0 auto; */
  float: left;
  width: 688px;
  border: 1px solid transparent
}
#qwerty.activeRegion {
  border: 1px solid white;
  box-shadow: 0px -1px 24px 3px rgba(255, 255, 255, 0.75);
  /* animation: blinker 2s linear infinite; */
}

#keyboard {
  margin: 0;
  padding: 0;
  list-style: none;
}

#keyboard li {
  float: left;
  margin: 0 5px 5px 0;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #bbd;
  border: 1px solid #f9f9f9;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
}

.capslock, .tab, .left-shift {
  clear: left;
}

#keyboard .tab, #keyboard .delete {
  width: 70px;
}

#keyboard .capslock {
  width: 80px;
}

#keyboard .return {
  width: 77px;
}

#keyboard .left-shift {
  width: 95px;
}

#keyboard .right-shift {
  width: 109px;
}

.lastitem {
  margin-right: 0;
}

.uppercase {
  text-transform: uppercase;
}

.on {
  display: none;
}

#keyboard li.active {
  background-color: #3b7;
}

/*
#keyboard li:hover {
  position: relative;
  top: 1px;
  left: 1px;
  border-color: #e5e5e5;
  cursor: pointer;
}
*/

</style>
