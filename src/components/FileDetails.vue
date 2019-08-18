<template>
  <div class="container">
    <p>File details {{ $route.params.id }}</p>
    <p v-if="Object.keys(details).length">{{ JSON.stringify(details) }}</p>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: grid;
  margin: 0 auto;
  max-width: 100%;
  width: 1200px;
}
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
    axios
      .get(`http://119.148.6.66:5000/api/wrf/${this.$route.params.id}00`)
      .then(res => {
        this.details = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
