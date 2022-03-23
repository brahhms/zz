import Vue from "vue";
import axios from "axios";

const config = {
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:5984/",
  method: "post",
  auth: {
    username: process.env.COUCH_USERNAME || "admin",
    password: process.env.COUCH_PASSWORD || "admin",
  },
  headers: { "Content-Type": "application/json; charset=utf-8" },
  transformRequest: [
    (data) => {
      if (!data) {
        data = { selector: {} };
      }
      data.limit = 1000;
      return JSON.stringify(data);
    },
  ],
};

const axios_client = axios.create(config);

Vue.prototype.axios_client = axios_client;

export { axios_client };
