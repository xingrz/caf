import Vue from 'vue'
import VueAnimatedList from 'vue-animated-list'

import App from './components/App.vue'

Vue.use(VueAnimatedList)

new Vue({
  el: 'body',
  components: { App },
})
