import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-hormas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
      "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    hormas: []
  },
  mutations: {
    setHormas(state, data) {
      state.hormas = data;
      console.log("setHormas");
    }

  },
  actions: {
    async getHormas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setHormas', res.data.docs);
    },

    async updateHorma({
      commit
    }, horma) {
       await axios.put(`${url}${horma._id}/`, horma, {
        params: {
          "rev": horma._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setHormas', response.data.docs);
    },

    async saveHorma({
      commit
    }, horma) {
      await axios.post(`${url}`, horma, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setHormas', response.data.docs);
    },

    async deleteHorma({commit}, horma){
      await axios.delete(`${url}${horma._id}`, {
          params: {
              "rev": horma._rev
          },
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
      }, credentials.authentication);
      
      const response = await getAll();
      commit('setHormas', response.data.docs);
  }
  },
  getters: {
    hormas: state => state.hormas
  }
}