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

        "aLittleLonely":
        [{
           "type": "sine",
            "frequency": 122.5,
            "volume": 1
        }, {
            "type": "square",
            "frequency": 122.5,
            "volume": 0.2
        }, {
            "type": "sine",
            "frequency": 122.4,
            "volume": 0
        }],

        "iSawTheSine":     // fadeout of 0.5 ish works nice
        [{
            "type": "sine",
            "frequency": 122.5,
            "volume": 1
        }, {
            "type": "sawtooth",
            "frequency": 63.4,
            "volume": 0.15
        }, {

            "type": "sine",
            "frequency": 122.4,
            "volume": 0
        }],

        "tryingToBeSmooth":
        [{
			"type": "sine",
			"frequency": 63.4,
			"volume": 1
			}, {
			"type": "square",
			"frequency": 63.4,
			"volume": 0.025
			}, {

			"type": "sine",
			"frequency": 61.1,
			"volume": 0
        }]
    }


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

    $("#PatchSelect").on("change", function(){
        var newPatch = this.value;
        synth.patchParams = literalPatch[newPatch];
        makeOscsUI();
        updateSynthParams();

    });

    $("#KeysMainVol").val(synth.mainGainVal);
    $("#KeysMainVol").on("change", function(){
        var newMainVol = this.value;
        synth.mainGainVal = newMainVol;
    });

    $("#KeysFadeIn").val(synth.fadeIn);
    $("#KeysFadeIn").on("change", function(){
        var value = this.value;
        var newFadeIn = parseFloat(value,10);
        synth.fadeIn = newFadeIn;
    });

    $("#KeysFadeOut").val(synth.fadeOut);
    $("#KeysFadeOut").on("change", function() {
        var value = this.value
        var newFadeOut = parseFloat(value,10);
        synth.fadeOut = newFadeOut;
    });

    // building this...
    function makeOscsUI (){
        $("#Keys-UI-Sub").empty()
        for (var i=0; i<synth.patchParams.length; i++) {
            $("#Keys-UI-Sub").append("<p class = 'KeysUI track-UI'>"+ synth.patchParams[i].type +":</p>");    // function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1);}
            $("#Keys-UI-Sub").append("<p class = 'KeysUI'>Vol</p>");
            $("#Keys-UI-Sub").append("<input id='PatchParamVol-"+i+"' class = 'KeysUI NumberInput3' name='"+i+"' type='number' min='0' step='0.01'>");
            $("#Keys-UI-Sub").append("<p class = 'KeysUI'>&nbspTune</p>");
            $("#Keys-UI-Sub").append("<input id='PatchParamTune-"+i+"' class = 'KeysUI NumberInput4' name='"+i+"' type='number' min='0' step='0.1'>");
            $("#Keys-UI-Sub").append("<p class = 'KeysUI'>&nbsp&nbsp</p>");
        }
    }
    makeOscsUI();

    function updateSynthParams(){
        for (var i=0; i<synth.patchParams.length; i++) {
            $("#PatchParamVol-"+i).val(synth.patchParams[i].volume);
            $("#PatchParamVol-"+i).on("change", function() {
                var value = this.value;
                var name = this.name;
                var newPatchVol = parseFloat(value,10);
                synth.patchParams[name].volume = newPatchVol;
                console.log("paramVol",synth.patchParams[name].volume)
            });

            $("#PatchParamTune-"+i).val(synth.patchParams[i].frequency);
            $("#PatchParamTune-"+i).on("change", function() {
                var value = this.value;
                var name = this.name;
                var newPatchFreq = parseFloat(value,10);
                synth.patchParams[name].frequency = newPatchFreq;
                console.log("paramFreq",synth.patchParams[name].frequency)

            });

        }
    }
    updateSynthParams();

    var keyCorrespondence = {
        "90":0,
        "83":1,
        "88":2,
        "68":3,
        "67":4,
        "86":5,
        "71":6,
        "66":7,
        "72":8,
        "78":9,
        "74":10,
        "77":11,
        "188":12,
		"76":13,
		"190":14,
		"186":15,
		"191":16,
		"222":17,

        "81":12,
        "50":13,
        "87":14,
        "51":15,
        "69":16,
        "82":17,
        "53":18,
        "84":19,
        "54":20,
        "89":21,
        "55":22,
        "85":23,
        "73":24,        //  I 	(C)
        "57":25,        //  9   (C#)
        "79":26,        //  O   (D)
        "48":27,        //  0   (D#)
        "80":28,        //  P   (E)
        "219":29,       //  [   (F)
        "61":30,        //  =   (F#)	FIREFOX
        "187":30,       //  =   (F#)	CHROME
        "221":31,       //  ]   (G)
        "8":32,         // 	bks (G#)
        "220":33,       //    \ (A)
		"46":34			//	del (A#)
    };

    var keyRef = {
        "Click":0,
        "90":0,
        "83":0,
        "88":0,
        "68":0,
        "67":0,
        "86":0,
        "71":0,
        "66":0,
        "72":0,
        "78":0,
        "74":0,
        "77":0,
        "188":0,
		"76":0,
		"190":0,
		"186":0,
		"191":0,
		"222":0,

        "81":0,
        "50":0,
        "87":0,
        "51":0,
        "69":0,
        "82":0,
        "53":0,
        "84":0,
        "54":0,
        "89":0,
        "55":0,
        "85":0,
        "73":0,
        "57":0,        //   9    (C#)
        "79":0,        //   O    (D)
        "48":0,        //   0    (D#)
        "80":0,        //   P    (E)
        "219":0,       //   [    (F)
        "61":0,        //   =    (F#)	FIREFOX
        "187":0,       //   =    (F#)	CHROME
        "221":0,       //   ]    (G)
        "8":0,         //   bks  (G#)
        "220":0,
		"46":0		   //	del (A#)
    };



    var keyIndexArray = $("#piano").children(); // using this?

    document.onkeydown = function(event){

        // if (in keyCorrespondence) {}         // most needed on stop, because this already has a conditional.
        // note that more keydown/up code will be added as you add more shortcut options... so more conditionals...

        var key = event.keyCode;            // console.log(key);
        var keyIndex = keyCorrespondence[key];      // console.log(keyIndex);
        if (keyRef[key]===0){           // prevents multiple calls which would otherwise occur from holding a key down
            synth.play(keyIndex,key);
            $("#piano").children().eq(keyIndex).children().eq(0).addClass("KeyPlaying");
            // works. but you have to do the children().eq() twice to get the div inside the li...
            // you'd think this first method would work, but it doesn't: $("#piano").children().eq(keyIndex).first().removeClass("KeyPlaying"); // also just the same
        }
    };

    document.onkeyup = function(event){

        // if (in keyCorrespondence) {}     // this would be good to limit the notes that call this function...

        var key = event.keyCode;
        var keyIndex = keyCorrespondence[key];
        var ref = keyRef[key];
        synth.stop(ref);
        keyRef[key]=0;
        $("#piano").children().eq(keyIndex).children().eq(0).removeClass("KeyPlaying");

    };



    // the way you fix this is (something like) by passing the ref into the function rather than the key. Then both input functions generate the ref.


// https://stackoverflow.com/questions/9122078/difference-between-onclick-vs-click
// https://stackoverflow.com/questions/20180490/difference-between-jquerys-onclick-vs-click
// https://stackoverflow.com/questions/17961154/what-is-the-difference-between-onclick-function-and-onclick-function
// and see fiddle: https://stackoverflow.com/questions/10082031/why-use-jquery-on-instead-of-click

    $(function() {

        $(".key").on("mousedown", function() {
    		$(this).addClass("KeyPlaying");
            var index = $(this).index('.key');
            console.log(index);
            synth.play(index,"Click");
        });
        $(".key").on("mouseup mouseout", function() {		// more to the point. this calls it *every* time the mouseleaves. hmmm. // this calls it twice (on both mouseup and mouseout) causing an an error as it tries to call this function on undefined the second time. also there is no problem with this error. try and fix it?
            // if (synth.playing) {$(".key").on("mouseout mouseout", function(){ ...etc... });}
            var index = $(this).index('.key');
            console.log(index);
    		$(this).removeClass("KeyPlaying");
            var ref = keyRef["Click"];
            synth.stop(ref);
            // how to get ref here?

        });
    });


});
