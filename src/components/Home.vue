<template>
  <div class="container">
    <Calendars v-if="wrfFiles.length" :filesData="wrfFiles" />
  </div>
</template>

<script>
import axios from "axios";
import { utcParse, timeFormat } from "d3-time-format";

import Calendars from "./Calendars.vue";

export default {
  name: "Home",
  data() {
    return {
      wrfFiles: []
    };
  },
  components: {
    Calendars
  },
  mounted: function() {
    axios
      .get("http://119.148.6.66:5000/api/wrf")
      .then(res => {
        this.wrfFiles = res.data.map(el => {
          let dateDigitFormatter = timeFormat("%Y%m%d"),
            date = utcParse("%Y-%-m-%-d")(
              `${el.forecastDate.y}-${el.forecastDate.m}-${el.forecastDate.d}`
            );
          return {
            ...el,
            date,
            sameDay:
              +dateDigitFormatter(
                utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(el.modifiedTime)
              ) === +dateDigitFormatter(date),
            id: +dateDigitFormatter(date),
            yr: el.forecastDate.y
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
