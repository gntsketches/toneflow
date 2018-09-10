
export const modeData = {
  dia: {
    C: ['C','D','E','F','G','A','B'],
    G: ['G','A','B','C','D','E','F#'],
    D: ['D','E','F#','G','A','B','C#'],
    A: ['A','B','C#','D','E','F#','G#'],
    E: ['E','F#','G#','A','B','C#','D#'],
    B: ['B','C#','D#','E','F#','G#','A#'],
   Fs: ['F#','G#','A#','B','C#','D#','F'],
   Cs: ['C#','D#','F','F#','G#','A#','C'],
   Gs: ['G#','A#','C','C#','D#','F','G'],
   Ds: ['D#','F','G','G#','A#','C','D'],
   As: ['A#','C','D','D#','F','G','A'],
    F: ['F','G','A','A#','C','D','E'],
  },
  mel: {
    C: ['C','D','D#','F','G','A','B'],
    G: ['G','A','A#','C','D','E','F#'],
    D: ['D','E','F','G','A','B','C#'],
    A: ['A','B','C','D','E','F#','G#'],
    E: ['E','F#','G','A','B','C#','D#'],
    B: ['B','C#','D','E','F#','G#','A#'],
   Fs: ['F#','G#','A','B','C#','D#','F'],
   Cs: ['C#','D#','E','F#','G#','A#','C'],
   Gs: ['G#','A#','B','C#','D#','F','G'],
   Ds: ['D#','F','F#','G#','A#','C','D'],
   As: ['A#','C','C#','D#','F','G','A'],
    F: ['F','G','A','A#','C','D','E'],
  },
  har: {
    C: ['C','D','D#','F','G','G#','B'],
    G: ['G','A','A#','C','D','D#','F#'],
    D: ['D','E','F','G','A','A#','C#'],
    A: ['A','B','C','D','E','F','G#'],
    E: ['E','F#','G','A','B','C','D#'],
    B: ['B','C#','D','E','F#','G','A#'],
   Fs: ['F#','G#','A','B','C#','D','F'],
   Cs: ['C#','D#','E','F#','G#','A','C'],
   Gs: ['G#','A#','B','C#','D#','E','G'],
   Ds: ['D#','F','F#','G#','A#','B','D'],
   As: ['A#','C','C#','D#','F','F#','A'],
    F: ['F','G','G#','A#','C','C#','E'],
  },
  dim: {
    C: ['C','D','D#','F','F#','G#','A','B'],
   Cs: ['C#','D#','E','F#','G','A','A#','C'],
    D: ['D','E','F','G','G#','A#','B','C#'],
   Ds: ['C','D','D#','F','F#','G#','A','B'],
    E: ['C#','D#','E','F#','G','A','A#','C'],
    F: ['D','E','F','G','G#','A#','B','C#'],
   Fs: ['C','D','D#','F','F#','G#','A','B'],
    G: ['C#','D#','E','F#','G','A','A#','C'],
   Gs: ['D','E','F','G','G#','A#','B','C#'],
    A: ['C','D','D#','F','F#','G#','A','B'],
   As: ['C#','D#','E','F#','G','A','A#','C'],
    B: ['D','E','F','G','G#','A#','B','C#'],
  },
  aug: {
    C: ['C','D','E','F#','G#','A#'],
   Cs: ['C#','D#','F','G','A','B'],
    D: ['C','D','E','F#','G#','A#'],
   Ds: ['C#','D#','F','G','A','B'],
    E: ['C','D','E','F#','G#','A#'],
    F: ['C#','D#','F','G','A','B'],
   Fs: ['C','D','E','F#','G#','A#'],
    G: ['C#','D#','F','G','A','B'],
   Gs: ['C','D','E','F#','G#','A#'],
    A: ['C#','D#','F','G','A','B'],
   As: ['C','D','E','F#','G#','A#'],
    B: ['C#','D#','F','G','A','B'],
  },
  chr: {
    C: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
   Cs: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    D: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
   Ds: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    E: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    F: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
   Fs: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    G: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
   Gs: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    A: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
   As: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    B: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  },
  maj: {
    C: ['C','E','G'],
    G: ['G','B','D'],
    D: ['D','F#','A'],
    A: ['A','C#','E'],
    E: ['E','G#','B'],
    B: ['B','D#','F#'],
   Fs: ['F#','A#','C#'],
   Cs: ['C#','F','G#'],
   Gs: ['G#','C','D#'],
   Ds: ['D#','G','A#'],
   As: ['A#','D','F'],
    F: ['F','A','C'],
  },
  min: {
    C: ['C','D#','G'],
    G: ['G','A#','D'],
    D: ['D','F','A'],
    A: ['A','C','E'],
    E: ['E','G','B'],
    B: ['B','D','F#'],
   Fs: ['F#','A','C#'],
   Cs: ['C#','E','G#'],
   Gs: ['G#','B','D#'],
   Ds: ['D#','F#','A#'],
   As: ['A#','C#','F'],
    F: ['F','G#','C'],
  },
  sus: {
    C: ['C','F','G'],
    G: ['G','C','D'],
    D: ['D','G','A'],
    A: ['A','D','E'],
    E: ['E','A','B'],
    B: ['B','E','F#'],
   Fs: ['F#','B','C#'],
   Cs: ['C#','F#','G#'],
   Gs: ['G#','C#','D#'],
   Ds: ['D#','G#','A#'],
   As: ['A#','D#','F'],
    F: ['F','A#','C'],
  },

  ma7: {
    C: ['C','E','G','B'],
    G: ['G','B','D','F#'],
    D: ['D','F#','A','C#'],
    A: ['A','C#','E','G#'],
    E: ['E','G#','B','D#'],
    B: ['B','D#','F#','A#'],
   Fs: ['F#','A#','C#','F'],
   Cs: ['C#','E#','G#','C'],
   Gs: ['G#','C','D#','G'],
   Ds: ['D#','G','A#','D'],
   As: ['A#','D','F','A'],
    F: ['F','A','C','E'],
  },
  dom: {
    C: ['C','E','G','A#'],
    G: ['G','B','D','F'],
    D: ['D','F#','A','C'],
    A: ['A','C#','E','G'],
    E: ['E','G#','B','D'],
    B: ['B','D#','F#','A'],
   Fs: ['F#','A#','C#','E'],
   Cs: ['C#','E#','G#','B'],
   Gs: ['G#','C','D#','F#'],
   Ds: ['D#','G','A#','C#'],
   As: ['A#','D','F','G#'],
    F: ['F','A','C','D#'],
  },
  mi7: {
    C: ['C','D#','G','A#'],
    G: ['G','A#','D','F'],
    D: ['D','F','A','C'],
    A: ['A','C','E','G'],
    E: ['E','G','B','D'],
    B: ['B','D','F#','A"'],
   Fs: ['F#','A','C#','E'],
   Cs: ['C#','E','G#','B'],
   Gs: ['G#','B','D#','F#'],
   Ds: ['D#','F#','A#','C#'],
   As: ['A#','C#','F','G#'],
    F: ['F','G#','C','D#'],
  },

  hdm: {
    C: ['C','D#','F#','A#'],
    G: ['G','A#','C#','F'],
    D: ['D','F','G#','C'],
    A: ['A','C','D#','G'],
    E: ['E','G','A#','D'],
    B: ['B','D','F','A"'],
   Fs: ['F#','A','C','E'],
   Cs: ['C#','E','G','B'],
   Gs: ['G#','B','D','F#'],
   Ds: ['D#','F#','A','C#'],
   As: ['A#','C#','E','G#'],
    F: ['F','G#','B','D#'],
  },
  dm7: {
    C: ['C','D#','F#','A'],
    G: ['G','A#','C#','E'],
    D: ['D','F','G#','B'],
    A: ['A','C','D#','F#'],
    E: ['E','G','A#','C#'],
    B: ['B','D','F','G#'],
   Fs: ['F#','A','C','D#'],
   Cs: ['C#','E','G','A#'],
   Gs: ['G#','B','D','F'],
   Ds: ['D#','F#','A','C'],
   As: ['A#','C#','E','G'],
    F: ['F','G#','B','D'],
  },
  blu: {
    C: ['C','D#','F','F#','G','A#'],
    G: ['G','A#','C','C#','D','F'],
    D: ['D','F','G','G#','A','C'],
    A: ['A','C','D','D#','E','G'],
    E: ['E','G','A','A#','B','D'],
    B: ['B','D','E','F','F#','A'],
   Fs: ['F#','A','B','C','C#','E'],
   Cs: ['C#','E','F#','G','G#','B'],
   Gs: ['G#','B','C#','D','D#','F#'],
   Ds: ['D#','F#','G#','A','A#','C#'],
   As: ['A#','C#','D#','E','F','G#'],
    F: ['F','G#','A#','B','C','D#'],
  },

  pen: {
    C: ['C','D#','F','G','A#'],
    G: ['G','A#','C','D','F'],
    D: ['D','F','G','A','C'],
    A: ['A','C','D','E','G'],
    E: ['E','G','A','B','D'],
    B: ['B','D','E','F#','A"'],
   Fs: ['F#','A','B','C#','E'],
   Cs: ['C#','E','F#','G#','B'],
   Gs: ['G#','B','C#','D#','F#'],
   Ds: ['D#','F#','G#','A#','C#'],
   As: ['A#','C#','D#','F','G#'],
    F: ['F','G#','A#','C','D#'],
  },

  fth: {
    C: ['C','G'],
    G: ['G','D'],
    D: ['D','A'],
    A: ['A','E'],
    E: ['E','B'],
    B: ['B','F#'],
   Fs: ['F#','C#'],
   Cs: ['C#','G#'],
   Gs: ['G#','D#'],
   Ds: ['D#','A#'],
   As: ['A#','F'],
    F: ['F','C'],
  },
  one: {
    C: ['C'],
    G: ['G'],
    D: ['D'],
    A: ['A'],
    E: ['E'],
    B: ['B'],
   Fs: ['F#'],
   Cs: ['C#'],
   Gs: ['G#'],
   Ds: ['D#'],
   As: ['A#'],
    F: ['F'],
  },


}





/*
C D
G A
D E
A  C
*/
