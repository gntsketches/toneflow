// consider: constructor approach?

export let AudioManager = {
  scenes: {},
/*  playerSynth: new Tone.PolySynth(4, Tone.Synth, {
    "oscillator" : {
        "type": "triangle",
    }
  }), */

/*  trackInstrument: (track) => {
    let trackInstrument = ''
    if (track.instrumentType === 'synth'){
      trackInstrument = new Tone.Synth()
      trackInstrument.set({
        "oscillator" : {
          "type"     : track.waveType
        },
        "envelope"   : {
          "attack"   : track.attack ,
          "decay"    : track.decay,
          "sustain"  : track.sustain,
          "release"  : track.release,
        },
        "portamento" : track.portamento,
      })
    } else {
      switch (track.sampleType){
        case 'piano':
          trackInstrument = new Tone.Sampler({
              "C2" : "piano1_C2.mp3",
              "C3" : "piano1_C3.mp3",
              "G3" : "piano1_G3.mp3",
              "C4" : "piano1_C4.mp3",
              "G4" : "piano1_G4.mp3",
              "C5" : "piano1_C5.mp3",
              "C6" : "piano1_C6.mp3",
            }, {
              'baseUrl' : 'src/tones/piano1/'
          })
          break
        case 'elecPno1':
          trackInstrument = new Tone.Sampler({
              "C1" : "elecPno1_C1.mp3",
              "C2" : "elecPno1_C2.mp3",
              "C3" : "elecPno1_C3.mp3",
              "C4" : "elecPno1_C4.mp3",
              "G5" : "elecPno1_C5.mp3",
              "C6" : "elecPno1_C6.mp3",
              "C7" : "elecPno1_C7.mp3",
            }, {
              'baseUrl' : 'src/tones/elecPno1_mp3s/'
          })
          break
        case 'elecPno2':
          trackInstrument = new Tone.Sampler({
              "C1" : "elecPno2_C1.mp3",
              "C2" : "elecPno2_C2.mp3",
              "C3" : "elecPno2_C3.mp3",
              "C4" : "elecPno2_C4.mp3",
              "G5" : "elecPno2_C5.mp3",
              "C6" : "elecPno2_C6.mp3",
              "C7" : "elecPno2_C7.mp3",
            }, {
              'baseUrl' : 'src/tones/elecPno2_mp3s/'
          })
          break
        case 'elecPno3':
          trackInstrument = new Tone.Sampler({
              "C2" : "elecPno3_C2.mp3",
              "C3" : "elecPno3_C3.mp3",
              "C4" : "elecPno3_C4.mp3",
              "G5" : "elecPno3_C5.mp3",
              "C6" : "elecPno3_C6.mp3",
              "C7" : "elecPno3_C7.mp3",
            }, {
              'baseUrl' : 'src/tones/elecPno3_mp3s/'
          })
          break
        case 'gtrSwell':
          trackInstrument = new Tone.Sampler({
              "C2" : "gtrSwell_C2.mp3",
              "C3" : "gtrSwell_C3.mp3",
              "C4" : "gtrSwell_C4.mp3",
              "C5" : "gtrSwell_C5.mp3",
              "C6" : "gtrSwell_C6.mp3",
            }, {
              'baseUrl' : 'src/tones/gtrSwell_mp3s/'
          })
          break
        case 'gtrMute':
          trackInstrument = new Tone.Sampler({
              "C2" : "gtrMute_C1.mp3",
              "C3" : "gtrMute_C2.mp3",
              "C4" : "gtrMute_C3.mp3",
              "C5" : "gtrMute_C4.mp3",
              "C6" : "gtrMute_C5.mp3",
            }, {
              'baseUrl' : 'src/tones/gtrMute_mp3s/'
          })
          break
        case 'bassGtr':
          trackInstrument = new Tone.Sampler({
              "C1" : "bassGtr_C1.mp3",
              "C2" : "bassGtr_C2.mp3",
              "C3" : "bassGtr_C3.mp3",
              "C4" : "bassGtr_C4.mp3",
              "E4" : "bassGtr_E4.mp3",
            }, {
              'baseUrl' : 'src/tones/bassGtr_mp3s/'
          })
          break
        case 'marimba':
          trackInstrument = new Tone.Sampler({
              "C0" : "marimba_C0.mp3",
              "C1" : "marimba_C1.mp3",
              "C2" : "marimba_C2.mp3",
              "C3" : "marimba_C3.mp3",
              "C4" : "marimba_C4.mp3",
              "C5" : "marimba_C5.mp3",
              "C6" : "marimba_C6.mp3",
              "C7" : "marimba_C7.mp3",
            }, {
              'baseUrl' : 'src/tones/marimba_mp3s/'
          })
          break
        case 'strings':
          trackInstrument = new Tone.Sampler({
              "C1" : "stringSection_C0.mp3",
              "C2" : "stringSection_C1.mp3",
              "C3" : "stringSection_C2.mp3",
              "C4" : "stringSection_C3.mp3",
              "C5" : "stringSection_C4.mp3",
              "C6" : "stringSection_C5.mp3",
              "C7" : "stringSection_C6.mp3",
            }, {
              'baseUrl' : 'src/tones/stringSection_mp3s/'
          })
          break
      }
    }
    return trackInstrument
  },*/

  instrument: (instrumentType, sampleType, track) => {
    let instrument = ''
    if (instrumentType === 'monoSynth'){
      instrument = new Tone.Synth()
      instrument.set({
        "oscillator" : {
          "type"     : track.waveType
        },
        "envelope"   : {
          "attack"   : track.attack ,
          "decay"    : track.decay,
          "sustain"  : track.sustain,
          "release"  : track.release,
        },
        "portamento" : track.portamento,
      })
    } else if (instrumentType === 'polySynth'){
      instrument = new Tone.PolySynth(4, Tone.Synth)
      instrument.set({
        "oscillator" : {
          "type"     : track.waveType
        },
        "envelope"   : {
          "attack"   : track.attack ,
          "decay"    : track.decay,
          "sustain"  : track.sustain,
          "release"  : track.release,
        },
      })
    } else {
      switch (sampleType){
        case 'piano':
          instrument = new Tone.Sampler({
            "C2" : "piano1_C2.mp3",
            "C3" : "piano1_C3.mp3",
            "G3" : "piano1_G3.mp3",
            "C4" : "piano1_C4.mp3",
            "G4" : "piano1_G4.mp3",
            "C5" : "piano1_C5.mp3",
            "C6" : "piano1_C6.mp3",
          }, {
            'baseUrl' : 'assets/tones/piano1/'
          })
          break
        case 'elecPno1':
          instrument = new Tone.Sampler({
            "C1" : "elecPno1_C1.mp3",
            "C2" : "elecPno1_C2.mp3",
            "C3" : "elecPno1_C3.mp3",
            "C4" : "elecPno1_C4.mp3",
            "C5" : "elecPno1_C5.mp3",
            "C6" : "elecPno1_C6.mp3",
            "C7" : "elecPno1_C7.mp3",
          }, {
            'baseUrl' : 'assets/tones/elecPno1_mp3s/'
          })
          break
        case 'elecPno2':
          instrument = new Tone.Sampler({
            "C1" : "elecPno2_C1.mp3",
            "C2" : "elecPno2_C2.mp3",
            "C3" : "elecPno2_C3.mp3",
            "C4" : "elecPno2_C4.mp3",
            "C5" : "elecPno2_C5.mp3",
            "C6" : "elecPno2_C6.mp3",
            "C7" : "elecPno2_C7.mp3",
          }, {
            'baseUrl' : 'assets/tones/elecPno2_mp3s/'
          })
          break
        case 'elecPno3':
          instrument = new Tone.Sampler({
            "C2" : "elecPno3_C2.mp3",
            "C3" : "elecPno3_C3.mp3",
            "C4" : "elecPno3_C4.mp3",
            "C5" : "elecPno3_C5.mp3",
            "C6" : "elecPno3_C6.mp3",
            "C7" : "elecPno3_C7.mp3",
          }, {
            'baseUrl' : 'assets/tones/elecPno3_mp3s/'
          })
          break
        case 'gtrSwell':
          instrument = new Tone.Sampler({
            "C2" : "gtrSwell_C2.mp3",
            "C3" : "gtrSwell_C3.mp3",
            "C4" : "gtrSwell_C4.mp3",
            "C5" : "gtrSwell_C5.mp3",
            "C6" : "gtrSwell_C6.mp3",
          }, {
            'baseUrl' : 'assets/tones/gtrSwell_mp3s/'
          })
          break
        case 'gtrMute':
          instrument = new Tone.Sampler({
            "C2" : "gtrMute_C1.mp3",
            "C3" : "gtrMute_C2.mp3",
            "C4" : "gtrMute_C3.mp3",
            "C5" : "gtrMute_C4.mp3",
            "C6" : "gtrMute_C5.mp3",
          }, {
            'baseUrl' : 'assets/tones/gtrMute_mp3s/'
          })
          break
        case 'bassGtr':
          instrument = new Tone.Sampler({
            "C1" : "bassGtr_C1.mp3",
            "C2" : "bassGtr_C2.mp3",
            "C3" : "bassGtr_C3.mp3",
            "C4" : "bassGtr_C4.mp3",
            "E4" : "bassGtr_E4.mp3",
          }, {
            'baseUrl' : 'assets/tones/bassGtr_mp3s/'
          })
          break
        case 'marimba':
          instrument = new Tone.Sampler({
            "C0" : "marimba_C0.mp3",
            "C1" : "marimba_C1.mp3",
            "C2" : "marimba_C2.mp3",
            "C3" : "marimba_C3.mp3",
            "C4" : "marimba_C4.mp3",
            "C5" : "marimba_C5.mp3",
            "C6" : "marimba_C6.mp3",
            "C7" : "marimba_C7.mp3",
          }, {
            'baseUrl' : 'assets/tones/marimba_mp3s/'
          })
          break
        case 'strings':
          instrument = new Tone.Sampler({
            "C1" : "stringSection_C0.mp3",
            "C2" : "stringSection_C1.mp3",
            "C3" : "stringSection_C2.mp3",
            "C4" : "stringSection_C3.mp3",
            "C5" : "stringSection_C4.mp3",
            "C6" : "stringSection_C5.mp3",
            "C7" : "stringSection_C6.mp3",
          }, {
            'baseUrl' : 'assets/tones/stringSection_mp3s/'
          })
          break
        case 'digiHarp':
          instrument = new Tone.Sampler({
            "C1" : "digiHarp_C0.mp3",
            "C2" : "digiHarp_C1.mp3",
            "C3" : "digiHarp_C2.mp3",
            "C4" : "digiHarp_C3.mp3",
            "C5" : "digiHarp_C4.mp3",
            "C6" : "digiHarp_C5.mp3",
            "C7" : "digiHarp_C6.mp3",
          }, {
            'baseUrl' : 'assets/tones/digiHarp_mp3s/'
          })
          break
      }
    }
    return instrument
  },

  playerPolySynth: () => {
    return new Tone.PolySynth(4, Tone.Synth)
  },
  playerMonoSynth: () => {
    return new Tone.Synth()
  },

  /*
  playerPianoSampler: () => {
    return new Tone.Sampler({
        "C2" : "piano1_C2.mp3",
        "C3" : "piano1_C3.mp3",
        "G3" : "piano1_G3.mp3",
        "C4" : "piano1_C4.mp3",
        "G4" : "piano1_G4.mp3",
        "C5" : "piano1_C5.mp3",
        "C6" : "piano1_C6.mp3",
      }, {
        'baseUrl' : 'src/tones/piano1/'
    })
  },
  playerGtrMuteSampler: () => {
    return new Tone.Sampler({
        "C2" : "gtrMute_C1.mp3",
        "C3" : "gtrMute_C2.mp3",
        "C4" : "gtrMute_C3.mp3",
        "C5" : "gtrMute_C4.mp3",
        "C6" : "gtrMute_C5.mp3",
      }, {
        'baseUrl' : 'src/tones/gtrMute_mp3s/'
    })
  },
  playerGtrSwellSampler: () => {
    return new Tone.Sampler({
        "C2" : "gtrSwell_C2.mp3",
        "C3" : "gtrSwell_C3.mp3",
        "C4" : "gtrSwell_C4.mp3",
        "C5" : "gtrSwell_C5.mp3",
        "C6" : "gtrSwell_C6.mp3",
      }, {
        'baseUrl' : 'src/tones/gtrSwell_mp3s/'
    })
  },
  playerMarimbaSampler: () => {
    return new Tone.Sampler({
        "C0" : "marimba_C0.mp3",
        "C1" : "marimba_C1.mp3",
        "C2" : "marimba_C2.mp3",
        "C3" : "marimba_C3.mp3",
        "C4" : "marimba_C4.mp3",
        "C5" : "marimba_C5.mp3",
        "C6" : "marimba_C6.mp3",
        "C7" : "marimba_C7.mp3",
      }, {
        'baseUrl' : 'src/tones/marimba_mp3s/'
    })
  },
  playerStringsSampler: () => {
    return new Tone.Sampler({
        "C1" : "stringSection_C0.mp3",
        "C2" : "stringSection_C1.mp3",
        "C3" : "stringSection_C2.mp3",
        "C4" : "stringSection_C3.mp3",
        "C5" : "stringSection_C4.mp3",
        "C6" : "stringSection_C5.mp3",
        "C7" : "stringSection_C6.mp3",
      }, {
        'baseUrl' : 'src/tones/stringSection_mp3s/'
    })
  },
  */

}
