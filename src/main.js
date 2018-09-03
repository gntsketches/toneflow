import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store';
//import Tone from 'tone'
//import draggable from 'vuedraggable'

export const bus = new Vue()

// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

const vm = new Vue({
  el: '#app',
  store: store,
  render: h => h(App)
})



// ES6 elipses function (...) may not work in slightly older browsers.
// to fix,CLI: npm install babel-preset-state-2 --save-dev
// also, ["stage-2"] preset in bablerc (however this is already state-3!)
