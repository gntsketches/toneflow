
PUSH:
  - fixed playerDelay wiring problems


***********************************************************************************************************
* USE-OF!
*************************************************************************************************************/

{

  REPERTOIRE

    BUILDING
      The 9 in 90
        Fade in the saw bassline, then unmute the triangle bass...
        b section countermelody:  E G|GB |AA |
      Crazy PWM Delay
        start with Q way up! add another fm track so the sound FX can be as far out as possible
      Practice
      Gradus ad Gigus
        a: Bass notes on Z keys, solo on Q keys
        b:
          - how to 'pull back' as it gets into chromatic section... attack and release? (raise, then lower at end?)
          - ?next form mode of D\Cdia


      Big Fast Ripples
      Day Frame (100)
        - into a bit of delay with c section?
        - change note with qwerty, mouse click for playerSynth
      Swells
      Swampy Love (130)
        - double the phrase length of the second scene (new melodic material)
      E delay (120)
        - experiment with different chord progressions

    IN THE WINGS
      Flow Five
      A Min Melody
      Sea Delay Set +


  COMPOSITION THOUGHTS

  Nice Sounds:
    - one sine 8 beat and one sawtooth 8 beat, C4 to C5, 160 BPM Change per 4, Mod per 8, Dia Dia Mel Har

  Stuff to Try:
    - jamming using ABAC Form with change set to 0, the track converged to a couple notes which didnt really change much as the formStep changed.

  - Jam on diminished scale...

  PERMORMING
    - use 'Camtasia' to record jam sessions so you can get youtube vids.


  EAR TRAINING
    opens UI space in third block - you can have a 'hide all' option (to hide upcoming mode, maybe key selections, etc.)

}




********************************************************************************************************************
* CURRENT CODING
**********************************************************************************************************************/

{

  - Form input doesnt seem to be accepting some values... JuJu progression wont advance beyond b\baug

  - Track Distortion not working...

  - Button for changeAll
  - Shortcut for changeAll by number selected...?
  - advance meter for til-change on each track?
  - reset remembered on scene change ...

  - Gradus - on load up: cannnot read property dispose of undefined...
  - In Gradus, when adding a new scene, it has blanks in new modulations... doesnt happen for more recently created compositions and is ok on load...
  - when shift-} ing, was putting rests in first soft-square note

  - Make track-all-rests shortcut

  - Copy scene

  - Different playerQWERTY settings for each scene
    - method to copy/import playerQWERTY settings from one scene to another

  - Highlight active track rather than tracks section
  - make shift-w/e to tab through more than than one scene while playing

  - modulation weights select the mode when you click the arrow...
      - test right-cicks...

  - dragging scenes leaves current editingSceneNumber (so it changes the scene...) do you want that different?
      - check out addNewScene...         state.editingSceneId = newScene.id

}

PRO FEEDBACK
  - initializeSceneAudio

FORUMS / ASK
  - What is the best way to wire delays?
    - because when delay time is at 0, it is *doubling* the volume...!
  - what is the best way to wire gains?
    - equalize / divide gains

INFO
  - Recommend localstorage plugin
  - Shift-D

********************************************************************************************************
TESTING
********************************************************************************************************

{
  builds for adding tracks, scenes, renaming, key responsiveness, (loading: - may need to dispose of all Tone objects... crackling on play after load if you dont refresh page...)

  scene_max_test_1 : maxed out tone12 at 5, but was clean on reload (due to renaming?)

}

************************************************************************************************/
* FEATURES PARKING LOT
***************************************************************************************************/

{
  - change each track by one note (to go along with changeAll )
  - new scene inherits tempo from previous scene
  - multiple track variations for each scene... ?
  - toggle filterPitchesOnChange
  - move playing indexes forward/backward with arrows... which shortcuts?
  - button for add track (for now, just does "enter"... later, see also: refactoring > "new track" vs "entered tracks"...  )
  - shortcut to extend range up or down an octave (ctrl shift up arrow ctrl shift down arrow)... or perhaps it widens/narrows it in both directions?
  - sleep feature
  - track edit arrow keys repeat ok (will need to be keypress)

  // are these doable in keypress? (without registering each number value as a separate handler? ie: can keypress accept an arbitrary number?
    - toggle all tracks to changePer 0 & back (change on/off)  (to change max / to change _x_)
    - all tracks for rest percent settings
    - sequence combo for modulation per: ctrl M #

  // sceneChangeQueue! General setting to delay change until cycle complete...
    - maybe changesQueued goes over on the info section? (particularly if it happens on lead change and not on modulation)
    - doesnt affect: volume; does affect: mute, change, modulate,

}


******************************************************************************************************
* PERFORMANCE
********************************************************************************************************/

{

  CONSIDERING:
  - multi-track tester: https://codepen.io/anon/pen/zLJzdq

  https://superuser.com/questions/408570/how-can-i-tell-when-the-last-time-chrome-updated

    - Tone is a dependency in package.json ... could this be interfering with loading the script directly... ?

    - is DOM complexity a factor? (per desalasworks...) This might explain why the app seems like it used to have better performance but it has been gradually declining.
        - how do I find out if DOM complexity is a factor?
            - a factor in what? synth distortion? flanges?

    Multiple Threads, multiple cores - how can I use more cores? Maybe I have "resource contention/exhaustion". Can I make parts of this asynchronous?
      - Can this be split between multiple cores?
      - whats the relationsip between browser and core use? multi-threading for javascript.
      - music program javascript multiple cores
        - multiple threaded approaches to music applications...

    Analyze loops in this context...
        "Profiling" - breaking down and benchmarking how long is each part of the app taking...
            - profiling library

    Why does it sound ok until you add one more?

    Whats the difference between CPU, memory, disk

    http://desalasworks.com/article/javascript-performance-techniques/
    https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution
    https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/
    https://www.upwork.com/hiring/development/11-tips-to-optimi

    Web Workers:
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

    - substantial distortion if you just push a 8-note track into the second place!
      - I betcha you ar not disposing of the synth when you do that, just creating a new one...!
        - kinda looks like it, because in setUpNewTrack you are splicing a track before doing initializeSceneAudio (which does the dispose)
          - but is the synth actually involved in that? or just the track which provides the info about how to play it?

    - multitrack/multiscene:
        - crackling & timing-performance breakdown when number of tracks/scenes begins to rise...
          - seems to be the case whether the tracks are all on one scene or multiple (the total number of tracks is the problem. It can handle four. Five starts to break down, 6 is unplayable.)
        - use .dispose()?
        - You probably need to read this: https://padenot.github.io/web-audio-perf/

        - let vs var performance?

        RESOURCES
          - https://www.w3schools.com/js/js_performance.asp

      Reddit: https://www.reddit.com/r/javascript/comments/8uxcyl/understanding_javascript_performance_specific_to/?st=jj1zm4ds&sh=4c0b6e95
        - Algorithmic complexity
        - Garbage collection
            - Memory leaks?: https://www.youtube.com/watch?v=xrX_BtOUDls
            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management
            https://javascript.info/garbage-collection
            https://codeburst.io/javascript-memory-management-and-garbage-collection-in-javascript-ebe7a97d7143
        - Profiling (using browser profiling tools)

    - WINDOWS 10
      - just as Modern Setup Host hijaks all my CPU!
      - windows audio device graph isolation (~25% with headphones, dropped to ~15% on removal)
      - Carbonite! at ~25% even with WiFi off.
      - wsappx   https://www.howtogeek.com/320261/what-is-wsappx-and-why-is-it-running-on-my-pc/
      - service host superfetch
      - avast
      - microsoft compatability telemetry
      - https://windows10skill.com/google-chrome-high-cpu-usage/
      - https://productforums.google.com/forum/#!topic/chrome/ruecK_0P8K8
      - https://www.reddit.com/r/Windows10/comments/3awn3s/chrome_using_insane_cpu_usage_on_windows_10_but/?st=jjho0zgv&sh=44f965aa

    - LINUX
      - L-Ubuntu

    - MACHINE
      - GPU vs. CPU in terms of laptop vs desktop
        - sound in Python...

}


******************************************************************************************************
* DESIGN & UI HMMM
********************************************************************************************************/

{

  UI HMMM:
    - apparently a rest note can change to a rest note. (rest note is outside prev-note test loop)
    - some way to indicate that a button (eg: 'remember' has been pressed), like a flash or something
    - - Filter range vs filter selectedNotes ?
    - option: Chain reps vs Modulation reps to advance scene?
    - Mute track option
        - works, but with a click...
    - Does "Reset" reset the form? (resetScene mutation)
        - If so, does formStep go to -1 or 0?
    - shortcut for returnAllTunes, but rememberAllTunes not so far beacuse it would be easy to hit by accident while playing
    - 'return' greyed until something is remembered. returnAll is a bit more tricky, it''s just un-greyed when any track is remembered
    - Use of 'Distribute' with form - if form section is prefixed, distribute overwrites first note with prefix (so its not an accurate distribution). Would be cooler if it didnt.
        - ALSO if could be cool to have an option where it distributes the whole mode each time it modulates.
    - 'suspendChanges' option (boolean check in advanceAndPlayTrack on lines which use scene.changeCycles,  zeros track changeCycles)
        - does advance scenes, but wont advance modulations (resets blue bar each cycle)
    - Is the note randomization algorithm good (specifically with reagrd to how rests are handled?)

    ShortCuts & Playbility:
    - seems like, stay away from just 'ctrl-' shortcuts, because those are common?
    - MAYBE the 'playing' shortcuts have just shift-, and 'composing' shortcuts have ctrl-shift- or a seqeunce combo?
        - so FILL and DISTRIBUTE become ctrl-shift- ? (except I use them alot...)

    // Address this when you build changeQueue, because they both will require thought on the play logic
    - Change scene on next cycle? changecycle? Modulation cycle? (seems like it''s next cycle)
        - set chain reps at 0 to delay chain advance indefinitely?
        - apparently chainReps overrides shift-e
        - grey out "chain reps" when it''s set at 0 ?

  DESIGN HMMM:
    - better highlighting for focussed elements
    - entry tone: use ableton-esq headphones icon?
    - conditionally bind titles? https://www.reddit.com/r/vuejs/comments/8960ze/conditional_attributes_titles/?st=jhxk7a9m&sh=371ba71c
    - Nice components: https://github.com/ambewas/react-audio-tools



}


*****************************************************************************************************/
* REFACTORING / BUGS / MORE HMMMMMMM
******************************************************************************************************/


BUGGIN {

    Text Entry
      - scenes to save with lower-case "s"
      - cant use caps in scene rename or in harmonic form entry
      - cant input spaces in scene rename

    - after changing the selectedNotes in an element of the form, it returns to those same elements when it comes through the form again (eg: in Gradus, removed some chromatic elements, and they where gone next time I scrolled through form)

    - keyboard use of html-dropdowns with *enter* are getting stuck and entering track again...
        betcha its because of "activeRegion" : if (this.activeRegion==='' && e.key==='Enter') { this.down = [] } // this prevents 'Enter' from getting stuck in down when a select is focussed. It works but feeling a bit suspicious. (Or perhaps more conditions are needed here?)
    - a#\g#dia in "four nasty" doesnt place a# in bottom (lead) track... ???

    - double OR bar (||) in buildHarmonicForm regex...?

    - looks like, if you change an element (mode) in the form once youre into the form, it doesnt change the actual pitch set until the next time around... ? (or maybe its just for the next mode up?)
        - I think its just for the next mode up, because thats already been established (as it moves through the form calls the next formStep)
            - maybe not even worth fixing? since you cant edit the form while its playing anyway.
        - today it just jumped past that section of the form, weird. (It was the last section.)It highlighted it for half a second first then went back to the first part.


    - (Oops, deleted 'giant step'!) Watch for this bug: 'giant step' doesnt fill first note on lead track for a#\d#dia

    - param entry
        - hmmm. tab/shift-tab highlights QWERTY  when tabbing through select options
            - review the whole active-region thing... some bugs there...
            - Inputs doesnt always send you back to previous region on blur... if youve been in other input fields I think it overwrites 'previousRegion'
            - HTML "select" items (will? do?) now have changeFunction (?), using bus...
                - is anything actually using the bus to call clearKeyFromDown? yet at least in TuneChanger it does so...
        - validate...
            - if you enter or leave a field after spacebar, it stays blank. should resume previous (or at least defaults.)
            - ".2" as durartion will crash Tone (vs "0.2")
        - shortcuts around trackControls sometimes will leave a field blank, and also
        - Enter doesnt always take you back to editingTrack


    - when track removed ...
        during play crashes it
        lead track number disappears. probs has to do with this.

    - changing scene NAME causes huge distortion and phase-out, seems to be overloading something...

    Fixed Already?
      - 4/10/18 This may be fixed, but Watch for it: Some bug when track added, maybe after deleting, where the tune doesn''t change when UI tune display changes
      // 7/24 ? Didn't do this: - Play crashes when upper and lower range are the same :^)   // Tone.min.js:9 Uncaught ReferenceError: trackIndex is not defined - at eval (store.js?c2d1:1005)
      - What happens if you input (rather than scroll) changeMax to a number higher than the actual changeable number? seems like it already has some kind of validation...
      - ctrl-up or down will place -1 or 10, but not change from it. fix with regex.

}

REFACTORING {

  - import helper.js rather than load

  "New track" vs "Entered tracks" structure...
    - Doesnt seem like this is serving. Should be able to add or delete from anywhere
    - remove "entering track" thing... all tracks are equal, you can delete any but the lead track (if only one, automatically becomes lead)


  - General cleanup
      - store actions and mutation classifications
      - "mute" is an option on synths and you dont need to the pre-post mute volume selectors. (but check if you need it for samples before you change things...)
      - seems like you are not DRY about changing the value of fill length... maybe you can use a watcher to update it based on the length of the lead track (rather than changing the value in the functionality of the various places you update the length)

  - Keyboard entry & shortcuts - organize & refactor, keypress compatability
      - register and unregister combos by region (per reddit)  //https://www.reddit.com/r/javascript/comments/8l9h2j/use_of_keypress_library_with_conditional_input/?st=jhi4stc9&sh=44da25e6
      - Ctrl-R plays pitch...

  - 'BIG' FUNCTIONS to reduce
      - morphSelectedNotes
      - buildHarmonicForm
      - changeTune
      - advanceTrackStep
      - onkeydown


  - rather than making '_' a note/pitch, would it make more sense to append it in render?

  - examine activeRegion and previousRegion, enter commands vs shortcuts... how do you want to do this? Note difference in focusFunction (to use previousRegion or not)

  - activeRegion: maybe the focusFunction and enterFunction could be referenced from somewhere else to standardize them?

  - Changing Scenes:
    - I *think* with the current logic the scene chain will only override a user change select if its the last leadCycle
    - highlight or tag lead track ... YES can do but gotta think about the track control component structure...

  - Component Structure
    - Pull RangeAdjust and TuneChanger up into TrackControls? (easier maniuplation of methods, etc...)
    - Pull ChangeTrackWave up into TrackSoundPanel? (especially as you develop alternate sound panels...)
    - Harmonic Form display should be its own component.
      - BUT, consider that other functionality may be added later (for example, fixed-tunes to go along with harmonic form.)
      - So it might be best to wait and see how it all settles out since you dont yet know how everything will be added/removed/changed.


    - use of: mapState, mapGetters, mapMutations... https://vuex.vuejs.org/guide/state.html#the-mapstate-helper
      https://www.npmjs.com/package/vuex-pathify ( see https://www.reddit.com/r/vuejs/comments/8t53lw/specify_object_value_with_vuex_vmodel/?st=jirsykxc&sh=866c915f)
      https://softwareengineering.stackexchange.com/questions/368922/architectural-problem-in-use-of-tonejs-with-vuex/372924#372924


  MODULATION STUFF
    Tightening things up:
    - check for presence or absence of '-' in mode naming conventions (internally)
        - yeah you are using that to split the root vs type in the pickMode function
    - is there a difference between MODE and MODULATION? When are you using these?
      - also modulationType is more specific than "modulation" ... switch to using that when that's what you're doing
    - re DRIFT, turning off autoModulate does not reset change counter to 0. (? Do you want that ?)
      - I think this is the same thing: when you do some progress towards a modulation, then change PER to 0 then back to 1, the blue bar is still at the same value


  VUEX
    - Modules:
        - read that article first. maybe modularize by function type?
        - there was a reddit post about this...
    - track editing?
    - autoModulate vs toggleAutoModulate
        - seemed like there was some good reason autoModulate accepted on/off rather than a toggle. What was it? Currently toggleAutoModulate is for the keyboard shortcut:
    POSTS
    https://forum.vuejs.org/t/helper-method-and-vuex/5193/3  https://forum.vuejs.org/t/best-practices-for-breaking-down-complex-actions/36734
    https://stackoverflow.com/questions/50995066/specify-object-value-with-vuex-v-model   => https://vuex.vuejs.org/guide/forms.html
    https://www.reddit.com/r/vuejs/comments/8t53lw/specify_object_value_with_vuex_vmodel/?st=jirk6063&sh=128b9ea4
    "Wouldn't it make more sense to write all your logic for local state instead and use a watcher to write to Vuex?" // https://codepen.io/autumnwoodberry/pen/PjLdEP?editors=1010


  - Select Elements:
    https://stackoverflow.com/questions/6210800/javascript-force-select-element-to-dropdown
    https://stackoverflow.com/questions/2932504/display-dropdown-options-on-focus
    https://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript/36581696#36581696

  - Crazy crackling when adding tracks or changing wave... fixed with:
        for (let nodeList in sceneAudio){ sceneAudio[nodeList].forEach( (nodeListItem, index) => { nodeListItem.dispose() }) }
        so DISPOSE is the thing. Ask about this! (ie: overwriting the container object itself is not enough ... apparently the objects stay in memory... )
            heres a post, possibly relevant: https://groups.google.com/forum/#!topic/tonejs/7fuL_8_SlIo


  NAMES TO CHANGE:
    - 'Morph' too Power Rangers...
        - can do this fast with WEBSTORM...?
    - 'modulationCycles' : this is easy to confuse with formStep...

  CODE HMMM:
    - In main.js: "Vue.directive('focus', { ...etc. " ... is this in use?
    - "Uncaught SyntaxError: Tone.TimeBase: Unexpected end of expression at t.TimeBase._parsePrimary "
    - What happens to change tune when no piano notes are selected?
    - maxChangeable: if a track is at maximum & a note.random is switched from 'fixed', the changeNumber will increase with it. kind of a nice feature actually, but did I code this deliberately?
    - changing tempo from changeScene mutation (to be action?) feels a little hackey. or like I might forget its there...?
    - distribute... currently ignores length...
    - There was some (Vue) duplicated-thing-please-use-keys error. Do I need more Vue keys?
    - Be wary of Hot-Recompile... see Tone.Transport.clear...  (seems that the Tone functions are out of Vue scope!)
      - may need to brush up on lifecycle methods...

}


********************************************************************************************/
* WISH LIST / SOMEDAY-MAYBE
**********************************************************************************************/

{

  SOUNDS
      - samples
      - pitched percussion
      - drone track

  INFO - change size of info box... https://www.npmjs.com/package/vue-draggable-resizable

  NEW-SCENE-AUTOFILL
    - Fill new scene with two new random tracks - should cover "fix track" memory options for mode morph
      and desire to have something brand new happen. (new scene tempo matches current scene tempo)
        - you made functions for this... which ones?? are they still there?
        - using a helper to fill tracks, hmmm.
        - cant make much progress on this until you figure out multitrack crackle

  - lengthen and shorten note duration with shift-arrows
      - use gradient to show note stretch behind other notes
      - will it accept, say, 3 8n ? or how does that work?

  - edit scene without changing/playing it (previous scene still plays in the background)
  - (delays: if/else for synch to tempo '8n' vs value in seconds? )
  - option where track only plays one note; all change together to a new note
  - "grab bag" or "repertoire" list of tunes (in common across all compositions?)
      wherein you can add items to the bag, and it will pull them out for you at random
      also can be done manually or auto
      -? modulatable? or otherwise adaptable to the current settings?
      eventually, "teachable" through Tensorflow or some AI library

  MOUSE OPTIONS: (could be fun to adjust track with mouse while paying QWERTY; also could make it more useable in mobile)...
      - Tracks: how to get all the possibilities in there? click to focus, double click to empty or fill, wheel to select notes, context menu for other stuff...

  LOAD    - can be very slow! need a spinny wheel, or to figure out better performance...

  - and of course VERTICAL CHORD EDITING, which might just be a different app (since it seems so mouse/drag heavy...)

  Less-needed shotcuts:
    - shortcuts to choose specific mode
    - shortcut for modulatePerLeadChanges?
    - Jump to scene (maybe mouse is fine? also same number value question. also app cant handle many scenes yet - is it a desired feature?)
    - Filter pitches?
    - double/halve tempo(?)
    - (enter) to copy track (maybe once performance is awesome...)
    - used to have a leadSelect shortcut (on "L"!), which you removed.
    - Shortcut to adjust fill number


  MOBILE
    - https://www.npmjs.com/package/mobile-detect

}


***************************************************************************************************
* SYNTHS AND SOUNDS
*****************************************************************************************************/

{

  Synth Pens
    synth:  https://codepen.io/anon/pen/JvoVxb
    polysynth:
      https://codepen.io/anon/pen/yjZrje
      ADSR https://codepen.io/anon/pen/VdLdGZ
    https://codepen.io/anon/pen/odmRYJ?editors=0010
    FILTERS: https://codepen.io/anon/pen/JZYqQx
             https://codepen.io/anon/pen/ejrbdj
    - Other types of synths / waves. Understanding Tone synths
      - change voice UI
    - Explore other effects (filters) & UI
    - Probably - bar approach for effects and such rather than x & y box
    Various synth settings
      "type": "amsine",
      "partials" : [0, 2, 3, 4], // or whatever. Partials seem to override wave type...(?)


  https://www.reddit.com/r/audioengineering/comments/96ksi6/im_building_a_free_daw_but_where_i_could_find_the/?st=jl63bdhs&sh=7805dbc5

}




***********************************************************************************************************
* LINKS
*************************************************************************************************************/

{


  QWERTY:
  https://www.reddit.com/r/javascript/comments/85s591/keyboard_input_and_best_practices_for_conditional/?st=jf1rswvi&sh=6ead2280
  https://www.reddit.com/r/vuejs/comments/85td7m/keyboard_input_and_best_practices_for_conditional/?st=jf1rdsj1&sh=39df5365
  ?Maybe https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements
  ?Maybe https://code.luasoftware.com/tutorials/vuejs/parent-call-child-component-method/

  https://codepen.io/anon/pen/JvoVxb
  https://codepen.io/anon/pen/NMqJep


  https://dmauro.github.io/Keypress/
  https://github.com/madrobby/keymaster
  https://github.com/kylestetz/AudioKeys

  TONEJS:
  https://www.reddit.com/r/vuejs/comments/8a4jlz/architectural_problem_in_use_of_tonejs_with_vuex/?st=jfo2yt35&sh=ed6e00b9
  (demos mutating Tone.Synth() on $store.state ... )
  https://www.reddit.com/r/webaudio/comments/8a4lrg/architectural_problem_in_use_of_tonejs_with_vuex/?st=jfo277dc&sh=37055828
  https://groups.google.com/forum/#!forum/tonejs
  Suspended bug: The AudioContext was not allowed to start. It must be resume (or created) after a user gesture on the page.
  - https://groups.google.com/forum/#!searchin/tonejs/resume$20audiocontext|sort:date/tonejs/Jdcb9x3vgqY/L-ifpYHICAAJ
  - Tone.context (logged "suspended")
  - Tone.context.resume() fixed it...

  Tone Performance:
  https://github.com/Tonejs/Tone.js/issues/341

  KNOB
  https://mail.google.com/mail/u/0/#inbox/163a3acf0243d273


  SAVE/LOAD & export/ import
  - https://www.reddit.com/r/javascript/comments/925uxe/can_you_importexport_localstorage_via_url/?st=jk31bus7&sh=509faee5
  - https://gist.github.com/andjosh/7867934
  - https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
  - https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file


  MISC:
  https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
  - Array.findIndex
  - Array.includes
  Vue vs Vanilla: https://itnext.io/reddits-voting-ui-in-vanilla-vs-react-vs-vue-vs-hyperapp-shedding-light-on-the-purpose-of-spa-ee6b6ac9a8cc
  https://flaviocopes.com/vue-cheat-sheet/
  "upload" - FileReader()! https://www.reddit.com/r/javascript/comments/997rlw/read_contents_of_userchosen_json_or_txt_file/?st=jl6pxdd1&sh=2bbae24f


  POSTS-GONE-BY:
  https://www.reddit.com/r/vuejs/comments/89kkfc/vuex_getters_for_dynamic_array/?st=jfkdao52&sh=9376ba1c
  https://github.com/Tonejs/Tone.js/issues/306
  https://www.reddit.com/r/vuejs/comments/8kn53j/how_to_blur_all_inputs/?st=jhf63g3q&sh=5c93aa7b
  https://css-tricks.com/debouncing-throttling-explained-examples/


  AI
   https://www.youtube.com/watch?v=HQ9q8-079vg  Tensorflow & Vue

}


************************************************************************************************
* HISTORY:
************************************************************************************************

{
  - Development process: single HTML file & CDN, multiple Vue components with multiple files, move to webpack build, move to Vuex, multi-track, multi-scene...
}


*********************************************************************************************/
* STUDY
**********************************************************************************************/

{

  BROWSER
    https://www.reddit.com/r/Windows10/comments/9im0ev/windows_remembers_previous_file_wont_overwrite/?st=jmj9zpks&sh=8211809a


  http://blog.chrislowis.co.uk/2013/06/17/synthesis-web-audio-api-envelopes.html
  https://noisehack.com/how-to-build-monotron-synth-web-audio-api/
  https://noisehack.com/how-to-build-supersaw-synth-web-audio-api/
  https://www.webaudioweekly.com/
  https://www.youtube.com/watch?v=vKGKJprJhkc
  - https://hackernoon.com/please-stop-using-console-log-its-broken-b5d7d396cf15
  - dig into Tune source code for synths, etc.
  - WebAudio book

  - WEBSTORM.yes
  - right click, find usages
  - ctrl click on object to go to it
  - refactor renames classes etc.
  - it GITS *for* you

}
