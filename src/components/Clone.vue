<template>
  <input :value="clone" readonly>
</template>

<script>
export default {

  props: [
    'tag',
  ],

  computed: {
    clone () {
      return `repo init -u git://codeaurora.org/platform/manifest.git -b release -m ${this.tag}.xml --repo-url=git://codeaurora.org/tools/repo.git --repo-branch=caf-stable`
    },
  },

  attached: function () {
    this.$el.select()
  },

}
</script>

<style lang="sass" scoped>
input {
  margin: 0;
  height: auto;
  border: none !important;
  box-shadow: none !important;
  color: darkgreen;
}
</style>
