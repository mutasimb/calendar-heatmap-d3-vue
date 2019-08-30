import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { timeFormat, utcParse, timeParse } from "d3-time-format";
import { timeMinute } from "d3-time";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    wrfFiles: [],
    infoBox: {}
  },
  getters: {
    wrfFilesLength: state => state.wrfFiles.length,
    processWrfFiles: state => {
      let zone = new Date().getTimezoneOffset();
      return state.wrfFiles.map(el => {
        let modifiedDateId = datetime =>
            +timeFormat("%Y%m%d")(timeMinute.offset(datetime, 360 + zone)),
          forecastDate = timeParse("%Y-%-m-%-d")(
            `${el.forecastDate.y}-${el.forecastDate.m}-${el.forecastDate.d}`
          ),
          modifiedDateTimeUtc = utcParse("%Y-%m-%dT%H:%M:%S.%LZ")(
            el.modifiedTime
          ),
          modifiedDateTimeBd = timeMinute.offset(
            modifiedDateTimeUtc,
            360 + zone
          ),
          modifiedDateBd = timeFormat("%Y%m%d")(modifiedDateTimeBd),
          modifiedTimeBd = timeFormat("%H%M%S.%L")(modifiedDateTimeBd);
        return {
          ...el,
          modifiedDateBd,
          modifiedTimeBd,
          sameDay: +modifiedDateBd === +timeFormat("%Y%m%d")(forecastDate),
          id: +timeFormat("%Y%m%d")(forecastDate),
          yr: el.forecastDate.y
        };
      });
    },
    hoveredBoxInfo: state => state.infoBox
  },
  mutations: {
    wrfFilesLoaded: (state, filesData) => {
      state.wrfFiles = filesData;
    },
    loadInfoBox: (state, fileData) => {
      state.infoBox = fileData;
    }
  },
  actions: {
    getWrfFiles: ({ commit }) => {
      axios
        .get("http://119.148.6.66:5000/api/wrf")
        .then(res => {
          commit("wrfFilesLoaded", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});
