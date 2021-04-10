import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-forros/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
      "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    forros: []
  },
  mutations: {
    setForros(state, data) {
      state.forros = data;
      console.log("setForros");
    }

  },
  actions: {
    async getForros({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setForros', res.data.docs);
    },

    async updateForro({
      commit
    }, forro) {
       await axios.put(`${url}${forro._id}/`, forro, {
        params: {
          "rev": forro._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setForros', response.data.docs);
    },

    async saveForro({
      commit
    }, forro) {
      await axios.post(`${url}`, forro, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setForros', response.data.docs);
    },

    async deleteForro({commit}, forro){
      await axios.delete(`${url}${forro._id}`, {
          params: {
              "rev": forro._rev
          },
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
      }, credentials.authentication);
      
      const response = await getAll();
      commit('setForros', response.data.docs);
  }
  },
  getters: {
    forros: state => state.forros
  }
}