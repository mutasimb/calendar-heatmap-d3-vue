<template>
  <div class="container">
    <p>File details {{ $route.params.id }}</p>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      details: {}
    };
  },
  mounted: function() {
    console.log({ id: this.$route.params.id });
  }
};
</script>
