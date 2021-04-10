import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-materiales/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
      "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    materiales: []
  },
  mutations: {
    setMateriales(state, data) {
      state.materiales = data;
      console.log("setMateriales");
    }

  },
  actions: {
    async getMateriales({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setMateriales', res.data.docs);
    },

    async updateMaterial({
      commit
    }, material) {
       await axios.put(`${url}${material._id}/`, material, {
        params: {
          "rev": material._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setMateriales', response.data.docs);
    },

    async saveMaterial({
      commit
    }, material) {
      await axios.post(`${url}`, material, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setMateriales', response.data.docs);
    },

    async deleteMaterial({commit}, material){
      await axios.delete(`${url}${material._id}`, {
          params: {
              "rev": material._rev
          },
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
      }, credentials.authentication);
      
      const response = await getAll();
      commit('setMateriales', response.data.docs);
  }
  },
  getters: {
    materiales: state => state.materiales
  }
}