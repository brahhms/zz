import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-suelas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
      "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    suelas: []
  },
  mutations: {
    setSuelas(state, data) {
      state.suelas = data;
      console.log("setSuelas");
    }

  },
  actions: {
    async getSuelas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setSuelas', res.data.docs);
    },

    async updateSuela({
      commit
    }, suela) {
       await axios.put(`${url}${suela._id}/`, suela, {
        params: {
          "rev": suela._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setSuelas', response.data.docs);
    },

    async saveSuela({
      commit
    }, suela) {
      await axios.post(`${url}`, suela, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setSuelas', response.data.docs);
    },

    async deleteSuela({commit}, suela){
      await axios.delete(`${url}${suela._id}`, {
          params: {
              "rev": suela._rev
          },
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
      }, credentials.authentication);
      
      const response = await getAll();
      commit('setSuelas', response.data.docs);
  }
  },
  getters: {
    suelas: state => state.suelas
  }
}