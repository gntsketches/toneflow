<template>
  <div class="info" v-bind:class="{ hideInfo: hideInfo }">

  <div class="info-menu">
      <span v-bind:class="{ infoMenuSelected: infoSection === 'about' }" @click="changeInfoSection('about')">ABOUT</span>
      <span v-bind:class="{ infoMenuSelected: infoSection === 'guide' }" @click="changeInfoSection('guide')">GUIDE</span>
      <span v-bind:class="{ infoMenuSelected: infoSection === 'shortcuts' }" @click="changeInfoSection('shortcuts')">SHORTCUTS</span>
      <div class="x-out-info" @click="toggleInfoMenu">(x)</div>
  </div>

      <div class="info-text info-about" v-if="infoSection === 'about'">
          <h1>Toneflow</h1>
          <p>...is an app for music composition, improvisation, and interactive ear training.
            It is built to be played with the <em>QWERTY</em> keyboard and offers randomized notes in patterns chosen by the user.
            <em>Keyboard shortcuts</em> are used for swift navigation.
            The sounds feature instrument samples and emulation of old-school synthesizers.
            Toneflow currently works best in the Chrome browser.
            <!-- (see the <span style="text-decoration: underline; cursor: pointer;" @click="changeInfoSection('help')">HELP</span> menu.)-->
          </p>
          <br>
          <h1>Support</h1>
          <p>
            Please consider supporting my work with a sponsorship through <a href="https://www.patreon.com/gntsketches" target="_blank">Patreon</a>!
            Toneflow 3 is in BETA, and so I am also looking for technical consultation on code performance & structure, audio engineering, UI, and graphic design.
            And of course, bug testing and user feedback of any sort is also very helpful!
            You can contact me at: gntsketches (at) gmail (dot) com, and you can find more of my music
            and other projects at <a href="https://www.gntsketches.com" target="_blank">gntsketches.com</a>.
          </p>
          <br>
          <h1>Development</h1>
          <p>
            There are many improvements and expansions I hope to make during the next year:
            <br><br>
            <ul>
              <li>Recording of MP3 and MIDI</li>
              <li>Improved performance: better audio quality, responsiveness, and capacity to handle faster changes and more tracks</li>
              <li>More responsive and elegant design and user-interface</li>
              <li>Improved useability on mobile</li>
              <li>Expanded features for ease of composition & improvisation</li>
              <li>Online video tutorials and tutorial features on the app</li>
            </ul>
          </p>
          <br>

          <h1>Versions</h1>
          <p>
            Toneflow is in version 3.1.0 <br><br>
            <a target="_blank" href="http://www.gntsketches.com/toneflow.php">Toneflow 1</a> had the basic elements of randomized selection for meditative ear training.<br><br>
            <a target="_blank" href="http://gntsketches.com/toneflow2.html">Toneflow 2</a> was my first attempt at a multi-track program. It lacks compositional features and has a slow UI,
              but there are other charms to be discovered. Big thanks to William Turner and his book
              <a href="http://www.javascriptforsoundartists.com/" target="_blank">Javascript for Sound Artists</a>, which provided the education I needed to build it.
            <!-- <a target="_blank" href="http://www.gntsketches.com/toneflow0_4.php">Toneflow 0</a> just plays random notes of the major scale. -->
            <br>
          </p>
          <br>

          <h1>Technical</h1>
          <p>
            Toneflow is built using:<br>
            <a href="https://vuejs.org/" target="_blank">Vue.js</a>,<br>
            <a href="https://tonejs.github.io/" target="_blank">Tone.js</a>,<br>
            <a href="https://dmauro.github.io/Keypress/" target="_blank">Keypress.js</a>,<br>
            the <a href="https://www.npmjs.com/package/vue-knob-control" target="_blank">Vue-Knob-Control plugin</a>,<br>
            and of course good old <a href="http://vanilla-js.com/" target="_blank">Vanilla.js!</a><br>
          </p>
          <br><br><br>

      </div>

      <div class="info-text info-guide" v-if="infoSection === 'guide'">
          <h1>Getting Started</h1>
          <p>
            <br>
            <strong class="underline">Naviagtion</strong><br>
            Toneflow is played primarily with the <em>QWERTY</em> computer keyboard (the mouse plays a supporting role.)
            There are four main 'regions' which can be focused to accept keyboard input.<br><br>
            <ul>
              <li>The <strong>QWERTY Player</strong> at the bottom of the screen, which allows you to play the computer keyboard as an instrument.
                Focus this with <em>shift-z</em>.</li>
              <li>The <strong>Track Entry</strong> zone mid-screen, where looping and changing tracks can be composed.
                Focus this with <em>shift-a</em>.</li>
              <li>The <strong>Piano Selector</strong> at the top of the screen
                (in the middle of the "<strong>Dashboard</strong>")
                allows you to specify which pitches will be chosen from upon when the app picks random notes.
                Focus this with <em>shift-q</em>.</li>
              <li>The <strong>General Inputs</strong> such as number fields and drop-down menus which change app settings.
                Focus these by mouse-click or with one of various shortcuts (such as <em>shift-t</em> to change the tempo/BPM).
                You can move forward or backward through these input fields by pressing <em>tab</em> or <em>shift-tab</em>.
                Drop-down menues can be opened and selected with the <em>enter</em> key.</li>
            </ul>
            <br>
            Each region (or the specific general input) becomes highlighted when focused.
            Entering a value into an input will return focus to the QWERTY player, Track Entry, or Piano Selector (whichever was previously focused.)

            <br><br>
            <strong class="underline">Track Entry</strong><br>
            When the app loads, the Track Entry region is focused.
            Pressing the keys add notes to the first <strong>track</strong> one at a time.
            'Rests' are added with the <em>space bar</em>. Notes can be removed with the <em>Delete</em> key.
            The track-loop can be started and stopped with the <strong>Play</strong> button in the upper left
            of the <strong>dashboard</strong>, or with the <em>Esc</em> key.
            To edit notes in your track, press the <em>left and right arrow keys</em>.
            This moves the (flashing & underlined) cursor along the track.
            You can toggle the editing cursor between <strong>overwrite</strong> and
            <strong>insert</strong> modes with the button in the upper right,
            or by pressing the <em>insert</em> key. The tempo can be changed in the <strong>BPM</strong> input.
            By default, tracks play a sample of an acoustic guitar swell; this and other sound parameters can be changed in the track
            <strong>Sound Panel</strong> below the notes. (Toneflow's sounds are discussed below.)
          </p>
          <br>
          <p>
            You can add tracks with the <strong>Add Track</strong> button, or by pressing <em>ctrl-enter</em> when the Track Region is focused.
            (You can add as many tracks as you want, though performance degrades eventually.)
            <em>Up and down arrow keys</em> move the editing cursor between tracks.
            The dotted outline indicates what note on each track is currently playing;
            to reset the tracks, click the "Reset Scene" button or press <em>shift-r</em>.
            Tracks can be rearranged by dragging.
            By deafualt, the first track entered is the <strong>Lead</strong> track (which affects a variety of things) -
            the lead track can be changed next to the BPM input in the dashboard.
            Also by default, the notes sound as they are entered - this can be toggled by button (upper right) or by pressing <em>shift-=</em>.
            When tracks have been entered, they may be deleted with the <strong>(X)</strong> button on the right-hand side.
            (The lead track cannot be deleted.)
          </p>
          <br>
          <p>
            <strong class="underline">QWERTY Player</strong><br>
            When the Qwerty Player region is focused (<em>shift-z</em>), the app can be played as an instrument without entering pitches to a track.
            (You can also use the mouse to play tones by clicking on the Qwerty keyboard display, regardless of which region is selected.)
            By default, the Player Region has a polyphonic synthesizer sound, which along with other parameters
            can be adjusted. The polySynth and sampler can play chords, though some note combinations may
            '<a href="https://en.wikipedia.org/wiki/Rollover_(key)" target="_blank">ghost</a>' -
            this is a hardware issue, not a bug in Toneflow.) To the left of the display, the <strong>Octave</strong>
            can be changed (<em>shift-x/c</em>) as well as the keyboard <strong>Layout</strong> (<em>shift-b</em>).
            Pressing the arrow keys while playing the Qwerty will bend the pitch.
            <br><br>
            Like on tracks, the instrument and sound settings can be adjusted with the adjacent fields and knobs.
            You can save these <strong>Settings</strong> to Qwerty Player region,
            with the numbered buttons in the left hand side.
            To do so, right-click on a button or press <em>ctrl-shift-(number key)</em> in a sequence
            (one at a time, not simultaneously.)
            The button is blue when a setting has been saved. To switch settings, left-click a button or press
            <em>shift-(number)</em>. ("0" restores the default settings.)
            The current setting is highlighted with a green border.

          </p>
          <br><br>
          <h1>Randomizing & Track Controls</h1>
          <p>
            The <strong class="underline">Piano Selector</strong>
            is used to specify which of the 12 chromatic pitches are picked for note randomization - selected pitches are green.
            Only the letter name of the pitch is selected - not the octave.
            This letter-name selection applies to all tracks; the note-range is specified in the track controls.
            Click on the piano keys to change the selection, or focus the piano with <em>shift-q</em>
            and use the Qwerty keys.
            <br><br>
            To add random notes to a track, press the <em>backtick (`)</em> key when the cursor is at the end of a track.
            Pressing <em>shift-`</em>(shift-backtick) while the cursor is on a note will pick a new random pitch.
            The <strong>Fill</strong> and <strong>Distribute</strong> buttons (dashboard left)
            generate a new expression for the track which currently has the cursor.
            Fill length is in a field by the button,
            and also changes automatically with the length of the lead track.
            (You can also use <em>shift-f</em> to Fill a track.)
            The Distribute feature will use every pitch in the Piano Selector once.
            <br><br>
            Notes in a track can change automatically, depending on their <strong>auto-change</strong> status,
            (indicated by shape).
            To change a note's auto-change status, press the backtick (`) while the cursor is on that note.
            Square notes are fixed and never auto-change;
            circular notes are subject to auto-change and may be a rest;
            squares with rounded corners will auto-change but will never be a rest.
            <br><br>

            The number of notes that auto-change, and frequency
            of auto-change (per number of track cycles) can be adjusted in the <strong>track controls</strong>
            using the input fields to the right of the <strong>Change</strong> button.
            Clicking this button will cause the track to change immediately,
            and <em>shift-g</em> will change the track that currently has the cursor.
            (This will work even if the change-frequency field is set to 0.)
            Use <em>shift-}</em> to apply a change to every track;
            <em>ctrl-shift-}</em> will change all changeable note on every track.
            <br><br>
            The range of pitches from which random notes are picked can be adjusted by the
            <strong>lo</strong> and <strong>hi</strong> selection fields.
            <br><br>
            The percentage <strong>(%)</strong> field determines the odds that a
            randomized note will be a pitch (rather than a rest) when it changes.
            (This field also determines track density when using the Fill and Distribute functions.)
            <br><br>
            Auto-changes can be disabled for all tracks by clicking the <strong>Changes Active</strong>
            button in the dashboard(right) or by pressing <em>shift-\</em>.
            <br><br>
            The track's <strong>Remember</strong> and <strong>Return</strong> buttons can set and then return a track
            to a remembered expression after it has changed.
            The <strong>Remember Tracks</strong> and <strong>Return Tracks</strong> on the dashboard (left), affect all tracks at once.
            Tracks will reset to their remembered states when a scene loads
            if the "on scene change" box is checked. (The <em>shift-{</em> shortcut will also return all tracks.)
            <br><br>
            Further features of the Track Controls sections include the track number,
            a <strong>Hide/Show</strong> button for track pitches (useful in ear training),
            a <strong>Mute</strong> button (<strong>M</strong>),
            and a carrot-selector to open and close the panel of knobs that control the track sounds.
          </p>
          <br><br>
          <h1>Changing Scenes and Compostion</h1>
          <p>
            Toneflow can have multiple <strong>scenes</strong>, each with their own tracks and different settings.
            They can be played independently, or chained sequentially for a compositional flow.
            Scenes are assigned randomized titles, which can be changed in the entry field below the "Play" button.
            To add a new scene, click the "<strong>+</strong>" button to the right of the <strong>scene tab</strong>
            (in line with the Play button), or use <em>ctrl-alt-s</em>.

            <br><br>
            The order of scenes in the flow can be rearranged by mouse-dragging.
            A scene can be "benched" (to the right) by clicking on the "<strong>-</strong>" button on the scene's tab.
            This removes them from the composition flow; benched scenes do not play.
            From there can be deleted with "<strong>-</strong>" or returned to the flow with "<strong>+</strong>".

            <br><br>
            You can switch to a scene by clicking on the scene's tab, or move one scene at a time through the composition flow
            with <em>shift-e</em> (forward) and <em>shift-w</em> (backward). Scenes change immediately if the app is not playing.
            The <strong>Scene change on:</strong> selector specifies what increment will pass
            before changing scenes if the app is playing.
            (Note that if "Modulation" or "Form" is selected, the scene will only change if automodulation or a form is in use - see below.)
            <br><br>
            If <strong>Chain: Off</strong> is selected, the scene will change at the end of the selected increment,
            and stay on that scene until another is selected.
            If <strong>Chain: On</strong> is selected, the scene will repeat the increment the number of times selected in the
            <strong>Chain Reps</strong> input field, and then advance. After playing all scenes in the flow, the
            composition will reset to the first scene and either restart or stop depending on
            whether <strong>Loop</strong> or <strong>Once</strong> is selected. When a scene change is forthcoming,
            a blue bar fills to show the time until the change and the name of the next scene appears after the arrow.
            <strong>Load Qwerty</strong> can be used to specify the setting Player Region that loads along with the scene.
          </p>
          <br><br>
          <h1>Modulation</h1>
          <p>
            The right-hand side of the dashboard provides options for modulating the pitches in the Piano Selector.
            There are two modulation styles: <strong>Drift</strong> and <strong>Form</strong>. In the Drift style,
            a new <strong>mode</strong> (scale) is chosen randomly every time, whereas in the Form style,
            modulations follow a determined structure. Clicking the <strong>Modulate</strong>
            button will prompt the next modulation.
            When <strong>Auto On</strong> is selected,
            the next modulation will happen along with the note-changing cycles of the Lead Track,
            according to the frequency in the adjacent input field ("per").
            When <strong>Filter On</strong> is selected, any changeable
            note on any track that is not also a pitch in the Piano Selector will be randomly assigned a new note.

            <br><br>
            Toneflow recognizes eighteen types of modes and chord structures. Modes available are:
            Diatonic (Dia) - ie: the natural major scale, Melodic Minor (Mel), Harmonic Minor (Har),
            Diminished (Dim), Augmented (Aug), and Chromatic (Chr). (Since modes specify notes to be chosen from at random,
            modes with identical sets of notes are ragarded as the same. For example, "C Major", "D Dorian",
            and "G Myxolydian" are all "C Diatonic".) You can also select Major (Maj), Minor (Min), and Suspended (Sus) triads;
            Major 7th (Ma7), Dominant 7th (Dom), Minor 7th (Mi7), Half-Diminished (Hdm) and Diminished 7th (Dm7) chords;
            Blues (Blu) and minor Pentatonic (Pen) scales; or a simple Fifth (Fth) or single note (One).

            <br><br>
            The odds that one of these types of modes will be picked at random can be altered in the
            <strong>Modulation Weights</strong> section. For example, if "Dia" is set to "2" and "Mel" is set to "1",
            a Diatonic mode (any of the 12) is twice as likely to be chosen as a Melodic Minor mode (any of the 12).
            Right-clicking on the name of a mode will re-set all other weights to 0; left-clicking on the name will
            modulate the piano to that mode or queue it as upcoming if "Auto" is selected.
            <strong>+ Types</strong> increments the weight of all modes.

            <br><br>
            It is possible to limit the root-note options from which Toneflow will choose a mode;
            left-click on the pitch names (above the mode names) to toggle this, or right-click to select only one root pitch.

            <br><br>
            <strong>Modulation Form</strong><br>
            You can click in the <strong>Form Entry</strong> field, to use text to enter specific modes.
            Only lowercase letters are accepted, sharps are always used (no flats), and modes should be separated by spaces.
            For example, <strong>cdia d#dia</strong> will modulate between C diatonic and D#(Eb) diatonic.
            You can specify the first note of the tracks by prefixing the mode with a letter name and a backslash.
            For example, <strong>f#\edia</strong> modulates to E diatonic and fixes a F# to the first note, likely yielding an F#-Dorian flavor.
            The current <strong>Modulation Step</strong> will be highlighed - note that when a form is chosen, it does not automatically
            advance to the first mode in the form. Click the Modulation button (or press <em>shift-p</em>) to begin the form.

            <br><br>
            It is also possible to enter a "general" form for modulations,
            and allow Toneflow to pick the specific modes (based on the modulation weights.)
            To do this, prefix letter names with a hyphen. For example, if you enter <strong>-a -a -b -a</strong>,
            Toneflow might pick "Cdia, Cdia, G#mel, Cdia". (Note that in this case,
            the letter names entered do not correspond to pitch names!) However, randomly picked form sections can still be prefixed
            by root-note choices - for example <strong>A#\-a</strong>. Finally, when building a form,
            it is possible to mix specified modes with randomized ones; <strong>amel ddia -a -b</strong> would
            pick random modes for the last two steps.
          </p>
          <br><br>
          <h1>Sounds</h1>
          <p>
            Toneflow uses instrument samples and synthesizers, both of which can be shaped and altered in various ways.
            The same sound options are available for Tracks and for the Qwerty keyboard.
            'PolySynth' can play multiple pitches at once, whereas 'MonoSynth' can only play one note at a time,
            but has the <strong>Portamento</strong> option for gliding the pitch between notes.
            The basic synthesizer <a href="https://en.wikipedia.org/wiki/Waveform" target="_blank">wave types</a>
            are sine, triangle, sawtooth, and square. More complex synthesizer sounds (AM, FM, Fat, and PWM)
            are also available - these types open up additional controls when selected.

            <br><br>
            <strong class="underline">Sound Shaping & Effects</strong><br>
            The <strong>Gain</strong> is the magnitide of the signal, similar to volume.
            <strong>Attack, Decay, Sustain, Release</strong> are elements of the the "envelope" of the sound's volume,
            <a href="https://github.com/Tonejs/Tone.js/wiki/Envelope" target="_blank">described with a diagram here</a>.
            When <strong>Delay On</strong> is active, <strong>Delay Time & Delay Feedback</strong> affect the repeat or echo of notes.
            <strong>Distortion</strong> is basically digital fuzz on the signal.
            The tone of the synth can be adjusted with a Filter, which cuts out specified frequencies.
            <strong>Wet</strong> affects how much of the filtered sound (vs. unfiltered sound) is sent to the output.
            <strong>Filter Type</strong> refers to the nature of signal subtraction relative to the
            <strong>Base</strong> frequency. For example, a "lowpass" filter with a base of 200 (Hz) allows
            pitches below 200hz to pass, and begins to subtract frequencies above.
            <strong>Rolloff</strong> is the drop in decibels per octave after the cutoff frequency.
            <strong>Q</strong> apparently makes <a href="https://en.wikipedia.org/wiki/Q_factor" target="_blank">
            flying saucer noises</a>.

            <br><br>
            The filter can be modulated by a Low Frequency Oscillator (LFO). This periodically changes the
            filter's Base Frequency setting according to another wave type which has it's own frequency
            (generally below 20Hz.)
            <strong>Octaves</strong> determines the range of sweep above and below the Base Frequency,
            whereas <strong>Depth</strong> determines the depth of that sweep
            (ie: whether the sweep reaches maximum range, or only some fraction.)
            <br><br>
          </p>
          <h1>Saving & Loading</h1>
          <p>
            Toneflow allows you to <strong>Save</strong> compositions, as well as individual scenes,
            in the browser's "Local Storage".
            These are displayed in the drop-down menu adjacent to the <strong>Load</strong> button;
            scenes are labeled with the prefix <em>"S_"</em>, and will be added to the current composition when loaded.
            <br><br>
            However, Local Storage does not transfer between browsers.
            <strong>Download</strong> (or <strong>Download Scene</strong>) will
            export a copy of the current composition or scene as a <em>.json</em> file. These are prefixed
            <em>TF3_</em> for compositions and <em>TF3_S_</em> for scenes.
            The <strong>Choose File</strong> button then allows you to locate and upload that file.
            For greater control over browser local storage, I recommend the
            <a href="https://chrome.google.com/webstore/detail/localstorage-manager/fkhoimdhngkiicbjobkinobjkoefhkap?hl=en-US" target="_blank">
              Local Storage Manager</a> plugin for Google Chrome.
            <br><br>
          </p>
      </div>

      <div class="info-text info-shortcuts" v-if="infoSection === 'shortcuts'">

          <h1>Basic Functions</h1>
          <p>
            <strong>Esc</strong>: Toggle play<br>
            <strong>Insert</strong>: Toggle edit mode<br>
            <strong>Delete</strong>: Delete a track note<br>
            <strong>`</strong>: New random track note / toggle note-change style<br>
            <strong>~</strong>: Randomize editing note<br>
            <strong>+</strong>: Toggle note-entry sound<br>
            <strong>Tab</strong>: Change focus to next input field<br>
            <strong>Shift-Tab</strong>: Change focus to previous input field<br>
            <strong>Ctrl-Enter</strong>: Adds a new track<br>
          </p>
          <br><br>
          <h1>Arrow Keys</h1>
          <p>
            <strong>ctrl-left/right</strong>: moves cursor left/right 8 notes<br>
            <strong>alt-left/right</strong>: sets cursor to track start/end<br>
            <strong>ctrl-up/down</strong>: shifts editing note up/down in selected pitches<br>
            <strong>alt-up/down</strong>: shifts editing note up/down by an octave<br>
            <strong>when QWERTY player is focused</strong>: bend pitch<br>
          </p>
          <br><br>
          <h1>Shifted QWERTY</h1>
          <p>
            <strong>0-9</strong>: load QWERTY Player settings (0 is default)
            <br><br>
            <strong>Q</strong>: focus Piano-Selector<br>
            <strong>W</strong>: shift scene backward<br>
            <strong>E</strong>: shift scene forward<br>
            <strong>R</strong>: reset scene tracks<br>
            <strong>T</strong>: focus tempo (BPM) input<br>
            <strong>Y</strong>: toggle scene chaining<br>
            <strong>U</strong>: toggle scene-chain looping<br>
            <strong>I</strong>: toggle modulation style<br>
            <strong>O</strong>: toggle auto-modulation<br>
            <strong>P</strong>: modulate or queue modulation<br>
            <strong>{</strong>: return all tracks to remembered tunes<br>
            <strong>}</strong>: apply changes to all tracks<br>
            <strong>|</strong>: toggle changes-active<br>
          <br><br>
            <strong>A</strong>: focus Track-Entry<br>
            <strong>S</strong>: toggle track mute<br>
            <strong>D</strong>: distribute all selected pitches to editing track<br>
            <strong>F</strong>: fill editing track with _x_ notes<br>
            <strong>G</strong>: apply changes to editing track<br>
            <strong>H</strong>: toggle hide pitches of editing track<br>
            <strong>J</strong>: focus editing track gain<br>
            <strong>K</strong>: focus editing track filter-wet<br>
            <strong>L</strong>: focus editing track LFO frequency<br>
            <strong>:</strong>: focus editing track change total<br>
            <strong>"</strong>: focus editing track change-per<br>
            <br><br>
            <strong>Z</strong>: focus Qwerty-Player<br>
            <strong>X</strong>: shift Qwerty pitches down an octave<br>
            <strong>C</strong>: shift Qwerty pitches up an octave<br>
            <strong>V</strong>: toggle Delay On/Off<br>
            <strong>B</strong>: toggle Qwerty layout<br>
            <strong>N</strong>: focus Qwerty gain knob<br>
            <strong>M</strong>: focus Qwerty attack knob<br>
            <strong><</strong>: focus Qwerty filter-wet knob<br>
            <strong>></strong>: focus Qwerty filter LFO frequency<br>
            <strong>?</strong>: toggle this info menu<br>
          </p>
          <br><br>
          <h1>Ctrl Key</h1>
          <p>
            <strong>ctrl-b</strong>: set track line groupings (for better arrangement of longer tracks)<br>
            <strong>ctrl-space</strong>: hold ctrl and press space repeatedly to set track color alternation (for alternate meters)<br>
            <strong>ctrl-shift-w</strong>: cancel scene change<br>
            <strong>ctrl-shift-e</strong>: cancel scene change<br>
            <strong>ctrl-shift-p</strong>: toggle the editing track's sound panel<br>
            <strong>ctrl-shift-}</strong>: change all changeable notes of all tracks<br>
            <strong>ctrl-shift-s</strong>: interpolate notes of editing track with rests<br>
            <strong>ctrl-shift-d</strong>: double the tune of the editing track<br>
            <strong>ctrl-shift-x</strong>: shift all editing track notes and range down an octave<br>
            <strong>ctrl-shift-c</strong>: shift all editing track notes and range up an octave<br>
            <strong>ctrl-shift-m</strong>: focus the "modulate per" input field<br>
          </p>

          <br><br>
          <h1>Sequence Shortcuts</h1>
          <p>
            (Press the keys one at a time, not together)<br>
            <strong>ctrl-shift-(number)</strong>: save QWERTY Player settings (default cannot be overwritten)<br>
            <strong>ctrl-shift-+</strong>: add a random note to all tracks<br>
            <strong>ctrl-shift--</strong>: delete the last note of all tracks<br>
            <strong>ctrl-shift-i</strong>: reset the app's audio (may help with errors) <br>
            <strong>ctrl-shift-s</strong>: add a new scene<br>
          </p>

          <br><br>

      </div>

  </div>
</template>


<script>
export default {
  name: "",
  data: () => ({
    infoSection: 'about',
  }),

  computed: {
    hideInfo(){
      return this.$store.state.hideInfoMenu
    },

  },

  methods: {
    changeInfoSection(section){
      this.infoSection = section
      console.log(this.infoSection)
    },
    toggleInfoMenu(){
      this.$store.commit('toggleInfoMenu')
    },

  },

}
</script>


<style scoped>

/* https://stackoverflow.com/questions/41321592/scoped-css-not-being-applied-within-the-component */
/* https://stackoverflow.com/questions/45898865/how-to-correctly-use-scoped-styles-in-vuejs-single-file-components */

.info {
  position: absolute;
  width: 300px;
  height: 800px;
  right: 0px;
  top: 40px;
  background: #bbb;
  padding: 5px 5px 0 10px;;
  z-index: 10;
  overflow: scroll;
}

.hideInfo {
  display: none;
}

.info-menu {
  padding: 10px 2px;
  background: #888;
  position: relative;
}

.infoMenuSelected {
  background: #444;
}

.info-menu span {
  padding: 5px 8px;
  color: #afa;
  cursor: pointer;
  font-size: 16px;
}

.x-out-info {
  position: absolute;
  top: 0;
  right: 2px;
  color: #000;
  cursor: pointer;
}

.info-text {
  margin-top: 10px;
}

h1 {
  font-size: 30px;
  padding: 5px;
  text-align: center;
  font-weight: bold;
}

p {
  font-size: 20px;
}

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}

a {
  text-decoration: underline;
  color: blue;
}

ul {
  margin-left:20px;
}

li {
   list-style-type: disc;
   list-style-position: outside;
}

.underline {
  text-decoration: underline;
}



</style>
