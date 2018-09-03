"use strict";


/*


Questions:
- crackling in Chrome especially
- ugly click strategies
- osc apparently still pops even if scheduled after fade (I think that's what's happening...?)
- fade time apparently longer than I think it should be? (maybe mousedown is activating multiple instances?)
-
- how many oscs can run? (browser capacity?)
-
- WHY does this need to track on/off status so as not to start multiple oscs with onkeydown hold WHEREAS CirclesRC doesn't do that?

*/


// Uh-Oh. keyCode is deprecated: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode


$(function(){

    var audioContext = new AudioContext();

    var literalPatch = {

		"buzzy":     // fadeout of 0.5 ish works nice
        [{
            "type": "sawtooth",
            "frequency": 63.4,
            "volume": 1
        }, {
            "type": "triangle",
            "frequency": 63.4,
            "volume": 1
        }, {
            "type": "sawtooth",
            "frequency": 63.3,
            "volume": 0
        }],


    /*
    Main UI: octave, display each pitch name that is played

    Keyboard input for each note (start with 1 octave)
        So your problem is, if you play more than one note at once, it's not cancelling the previous oscillators
        That's because app.oscillators is an array which is reassigned every time play is pressed.
        So you need an object that tracks oscillator assignments by id, like in the RC tuts.


    */



    var apiReader = function(patchProp) {

        var app = {
            playing:false,
            patchParams: undefined,
            gainNodes: {},
            oscillators: {},
            mainGain: audioContext.createGain(),
            mainGainVal: 0.3,
            fadeIn: 0.1,
            fadeOut: 0.3,   //  this is working but it seems like if it's set at, say, 1, it takes longer than one second to fade...

            play: function(index,key) {
                app.mainGain.gain.value = app.mainGainVal;
                app.mainGain.connect(audioContext.destination);

                var ref = Math.random();
                keyRef[key] = ref;

                //  will this need a ref value too? ... YES!
                app.gainNodes[ref] = app.patchParams.map(function(val) {
                    var gain = audioContext.createGain();
                    gain.gain.value = val.volume;
                    return gain;
                });
                app.oscillators[ref] = app.patchParams.map(function(val, i) {
                    var osc = audioContext.createOscillator();
                    osc.type = val.type;
                    osc.frequency.value = val.frequency;
                    osc.detune.value = (val.frequency) + (index * 100);
                    osc.connect(app.gainNodes[ref][i]);
                    app.gainNodes[ref][i].connect(app.mainGain);
                    app.gainNodes[ref][i].gain.value = 0;
                    osc.start(audioContext.currentTime);
                    app.gainNodes[ref][i].gain.setTargetAtTime(val.volume, audioContext.currentTime, app.fadeIn);
                    // unless gain is not set to 0 first, then targeted at 1, it overrides volume specification... with the target set longer, like 5 seconds, there's a nice fade in of the new values

                    return osc;
                });
            //    console.log(app.gainNodes);
            //    console.log("post-play",app.oscillators);
            },

            // this runs on any keydown (mousout?) at all. is it interfering?
            stop: function(ref) {
                for (var i = 0; i < app.oscillators[ref].length; i += 1) {
                    app.gainNodes[ref][i].gain.setTargetAtTime(0, audioContext.currentTime, app.fadeOut);
            //     console.log("stopping",i);
			//	console.log("oscillators[",ref,"]",app.oscillators[ref]);
                    app.oscillators[ref][i].stop(audioContext.currentTime + app.fadeOut + 3);
            //        console.log(audioContext.currentTime+app.fadeOut);
                }
                delete(app.oscillators[ref]);
             //   console.log("post-delete",app.oscillators);
            }
        };

//	ok, so the length of the hold depends on the +x after app.fadeOut ... so the first-pressed osc is not fading properly
// 	aha. the gainNodes have no ref!
// 	also remember the fade-times seemed weird/maybe too long anyway...
// may be helpful: https://stackoverflow.com/questions/43610937/web-audio-api-correct-way-to-stop-oscillator-connected-to-release-envelope


        app.patchParams = literalPatch[patchProp];

        return app;
    };

    var synth = apiReader("aLittleLonely");









    var keyIndexArray = $("#piano").children(); // using this?



});
