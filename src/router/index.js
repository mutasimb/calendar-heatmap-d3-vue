import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/Home";
import FileDetails from "@/components/FileDetails";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/file/:id",
      name: "FileDetails",
      component: FileDetails
    }
  ]
});
