<template>
  <table class="highlight">

    <thead>
      <tr>
        <th>Date</th>
        <th></th>
        <th><input type="text" v-model="tag" placeholder="Tag"></th>
        <th><input type="text" v-model="chipset" placeholder="Chipset"></th>
        <th><input type="text" v-model="version" placeholder="Android version"></th>
      </tr>
    </thead>

    <tbody>
      <template
        v-for="build in release
        | filterBy tag in 'tag'
        | filterBy chipset in 'chipset'
        | filterBy version in 'version'"
        track-by="$index">

        <build :build="build">

      </template>
    </tbody>

  </table>
</template>

<script>
import Build from './Build.vue'

export default {

  components: { Build },

  props: [
    'release',
  ],

  data: () => ({
    tag: '',
    chipset: '',
    version: '',
  }),

  attached: function () {
    $('.chipsets-filter').dropdown()
  }

}
</script>

<style lang="sass" scoped>
input {
  margin: 0;
  height: auto;
  border: none !important;
  box-shadow: none !important;
}

th, th input {
  font-size: 12px;
  font-family: monospace;
  font-weight: normal;
}

th {

  &:nth-of-type(1) {
    width: 14em;
  }

  &:nth-of-type(2) {
    width: 2em;
  }

  &:nth-of-type(4) {
    width: 15em;
  }

  &:nth-of-type(5) {
    width: 15em;
  }

}

th {

  &:first-of-type {
    padding-left: 2em;
  }

  &:last-of-type {
    padding-right: 2em;
  }

}
</style>
