// consider: constructor approach?
//import Tone from 'tone'


//import { store } from './store/store';
//console.log("store", store)

export let AudioManager = {
  scenes: {},
  playerSynth: new Tone.PolySynth(4, Tone.Synth, {
    "oscillator" : {
        "type": "triangle",
    }
  })
}




/* playerSynth options:
change wave Type
gain
fade in
fade out


*/
