<template>
  <div class="container">
    <svg class="calendar" :height="svgHeight + cellsize" :width="width + 2" ref="svg" />
    <InfoBox :info="info" />
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
.calendar {
  grid-area: calendar;
}
</style>

<script>
import { interpolateCool } from "d3-scale-chromatic";
import { range } from "d3-array";
import { timeFormat, timeParse, utcParse } from "d3-time-format";
import { timeDay, timeMonths, timeYear, timeWeek } from "d3-time";
import { scaleBand, scaleSequential } from "d3-scale";
import { select } from "d3-selection";

import InfoBox from "./InfoBox";

export default {
  data() {
    return {
      svgHeight: 0,
      width: 0,
      cellsize: 0,
      info: {}
    };
  },
  components: {
    InfoBox
  },
  props: {
    filesData: Array
  },
  mounted: function() {
    let cellsize = 17,
      height = cellsize * 8,
      width = cellsize * 53,
      years = this.filesData
        .map(el => el.yr)
        .filter((el, i, arr) => arr.indexOf(el) === i)
        .map(el => ({
          year: el,
          dates: timeDay
            .range(new Date(el, 0, 1), new Date(el + 1, 0, 1), 1)
            .map(date => {
              let id = +timeFormat("%Y%m%d")(date),
                returnable = {
                  date,
                  id,
                  U: +timeFormat("%U")(date),
                  w: +timeFormat("%w")(date)
                },
                dateWrf = this.filesData.find(file => file.id === id);

              return dateWrf
                ? {
                    ...returnable,
                    ...dateWrf
                  }
                : returnable;
            })
        })),
      svgHeight = years.length * height;

    this.width = width;
    this.svgHeight = svgHeight;
    this.cellsize = cellsize;

    let yearBand = scaleBand()
        .range([0, svgHeight])
        .domain(years.map(el => el.year)),
      weekdayBand = scaleBand()
        .range([0, height - cellsize])
        .domain(range(7)),
      weekIndexBand = scaleBand()
        .range([0, width])
        .domain(range(53)),
      colorScale = scaleSequential(interpolateCool).domain([
        timeParse("%H%M%S")("060000"),
        timeParse("%H%M%S")("235959")
      ]),
      monthPath = t0 => {
        let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(),
          d1 = t1.getDay(),
          w0 = timeWeek.count(timeYear(t0), t0),
          w1 = timeWeek.count(timeYear(t1), t1);

        return `M${(w0 + 1) * cellsize},${d0 * cellsize}H${w0 * cellsize}V${7 *
          cellsize}H${w1 * cellsize}V${(d1 + 1) * cellsize}H${(w1 + 1) *
          cellsize}V0H${(w0 + 1) * cellsize}Z`;
      };

    let yearG = select(this.$refs.svg)
      .selectAll("g")
      .data(years)
      .enter()
      .append("g")
      .attr("transform", d => `translate(1, ${cellsize + yearBand(d.year)})`);

    yearG
      .selectAll(".month")
      .data(d => timeMonths(new Date(d.year, 0, 1), new Date(d.year + 1, 0, 1)))
      .enter()
      .append("path")
      .attr("class", "month")
      .attr("fill", "transparent")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", monthPath);

    yearG
      .selectAll("rect")
      .data(d => d.dates)
      .enter()
      .append("rect")
      .attr("height", cellsize - 2)
      .attr("width", cellsize - 2)
      .attr("x", d => weekIndexBand(d.U) + 1)
      .attr("y", d => weekdayBand(d.w) + 1)
      .attr("fill", d =>
        d.modifiedTime
          ? d.sameDay
            ? colorScale(utcParse("%H:%M:%S.%LZ")(d.modifiedTime.split("T")[1]))
            : "red"
          : "#eeeeee"
      )
      .attr("fill-opacity", d =>
        d.modifiedTime ? (d.sameDay ? "1.0" : "0.35") : "1.0"
      )
      .on("mouseover", d => {
        if (d.fileName) this.info = d;
      })
      .on("mouseout", d => {
        this.info = {};
      })
      .on("click", d => {
        this.$router.push({ name: "FileDetails", params: { id: d.id } });
      });
  }
};
</script>
