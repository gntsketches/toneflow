<template>
  <div class="player-ui-wrapper">

    <player-info></player-info>
    <qwerty :down="down" :playerInstrument="playerInstrument" ref="qwertyDisplay"></qwerty>
    <player-controls-filters></player-controls-filters>

  </div>
</template>
<script>

import PlayerInfo from './PlayerInfo.vue'
import Qwerty from './Qwerty.vue'
import PlayerControlsFilters from './PlayerControlsFilters.vue'

export default {
  name: "",
  components: {
    'player-info': PlayerInfo,
    'qwerty': Qwerty,
    'player-controls-filters': PlayerControlsFilters,
  },
  props: ['down', 'playerInstrument'],

  data: () => ({

  })
}
</script>

<style>

.player-ui-wrapper {
  background: #556;
}

.player-ui-wrapper:after {
  content: "";
  display: table;
  clear: both;
}



</style>
