<template>
  <div class="container">
    <Calendars v-if="wrfFilesLength" :filesData="processWrfFiles" />
    <InfoBox :info="hoveredBoxInfo" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: auto 265px;
  grid-template-rows: auto;
  grid-template-areas: "calendar info-box";

  margin: 0 auto;
  max-width: 100%;
  width: 1200px;
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

import Calendars from "./Calendars.vue";
import InfoBox from "./InfoBox.vue";

export default {
  name: "Home",
  components: {
    Calendars,
    InfoBox
  },
  computed: {
    ...mapGetters(["wrfFilesLength", "processWrfFiles", "hoveredBoxInfo"])
  },
  methods: {
    ...mapActions(["getWrfFiles"])
  },
  mounted: function() {
    this.getWrfFiles();
  }
};
</script>
