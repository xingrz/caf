<template>
  <tr>
    <td>{{dateFormated}}</td>
    <td @click="clone"><i class="material-icons" title="repo init">code</i></td>
    <td v-if="cloning"><clone :tag="build.tag"></td>
    <td v-else @click="select">{{build.tag}}</td>
    <td>{{build.chipset}}</td>
    <td>{{build.version}}</td>
  </tr>
</template>

<script>
import moment from 'moment'

import Clone from './Clone.vue'

export default {

  components: { Clone },

  props: [
    'build',
  ],

  data: () => ({
    cloning: false,
  }),

  computed: {
    dateFormated () {
      return moment(this.build.date).format('YYYY/MM/DD')
    },
  },

  methods: {
    clone (e) {
      this.cloning = !this.cloning
    },
    select (e) {
      const node = e.target.firstChild

      const range = document.createRange()
      range.setStart(node, 0)
      range.setEnd(node, e.target.innerText.length)

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    },
  },

}
</script>

<style lang="sass" scoped>
td, td input {
  font-size: 14px;
  font-family: monospace;
  font-weight: normal;
}

td {
  white-space: nowrap;

  &:first-of-type {
    padding-left: 2em;
  }

  &:last-of-type {
    padding-right: 2em;
  }

  .material-icons {
    font-size: 14px;
    cursor: pointer;
    position: relative;
    top: 3px;
  }
}
</style>
