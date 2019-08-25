import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { timeFormat, utcParse } from "d3-time-format";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    wrfFiles: [],
    infoBox: {}
  },
  getters: {
    wrfFilesLength: state => state.wrfFiles.length,
    processWrfFiles: state =>
      state.wrfFiles.map(el => {
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
      }),
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
