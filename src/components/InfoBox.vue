<template>
  <div class="info-box">
    <template v-if="!Object.keys(info).length">
      <h4>WRF Forecast files</h4>
      <p>Welcome! This is a small application for monitoring the availability of BMD's WRF forecast output files in the CSRD server.</p>
    </template>
    <template v-else>
      <h4>{{ info.fileName }}</h4>
      <p>Forecast: {{ info.id | parseForecastDate | formatForecastDate }}</p>
      <p>Size: {{ info.size | bytesToSize }}</p>
      <p>Received on {{ info.modifiedTime | parseReceivedDateTime | formatReceivedDateTime }}</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.info-box {
  grid-area: info-box;
  width: 100%;
  margin: 16px 0;
  padding: 15px;
  border: 2px solid black;
  h4 {
    margin-bottom: 10px;
  }
  p {
    margin-top: 5px;
    margin-bottom: 0;
    font-size: 13px;
  }
  > :first-child {
    margin-top: 0;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
</style>

<script>
import { utcParse, timeParse, timeFormat } from "d3-time-format";

export default {
  props: {
    info: Object
  },
  filters: {
    parseReceivedDateTime: function(timeStr) {
      return utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(timeStr);
    },
    formatReceivedDateTime: function(datetimeObj) {
      return timeFormat("%B %-d, %Y at %-I:%M:%S %p")(datetimeObj);
    },
    parseForecastDate: function(id) {
      return timeParse("%Y%m%d")(id);
    },
    formatForecastDate: function(dateObj) {
      return timeFormat("%B %-d, %Y")(dateObj);
    },
    bytesToSize: function(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return bytes
        ? Math.round((bytes * 10) / Math.pow(1024, i)) / 10 + " " + sizes[i]
        : "0 Byte";
    }
  }
};
</script>
