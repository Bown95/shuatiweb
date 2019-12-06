import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { api } from "./assets/js/config";
// 按需引入
import "./plugins/iview.js";

Vue.config.productionTip = false;
Vue.prototype.$api = api;

window.$api = api;
// var that = this;

import axios from "axios";
import qs from "qs";
Vue.config.keyCodes.caps = 20;
Vue.prototype.axios = axios;
Vue.config.productionTip = false;
axios.interceptors.request.use(function(config) {
  if (config.method == "post") {
    config.data = qs.stringify(config.data);
  }
  return config;
});
axios.interceptors.response.use(
  response => {
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  },
  error => {
    return Promise.reject(error);
  }
);
// 每次转跳 回到顶部
router.afterEach(() => {
  window.scrollTo(0, 0);
});

axios
  .get("/config.json", {})
  .then(function(data) {
    Object.assign(api, data);
    axios.defaults.baseURL = api.baseUrl;
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  })
  .catch(function() {});
