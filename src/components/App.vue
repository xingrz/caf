<template>
  <article class="app">

    <template v-if="release.length">
      <release :release="release">
    </template>

    <template v-else>
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    </template>

  </article>
</template>

<script>
import Release from './Release.vue'

export default {

  components: { Release },

  data: () => ({
    release: [],
  }),

  ready: function () {
    $.getJSON('https://caf.leanapp.cn/latest')
      .then(release => this.release = release)
  },

}
</script>
