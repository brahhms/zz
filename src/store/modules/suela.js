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
    nuevaSuela: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      defaultColor: null,
      colores: []
    },
    suelas: []
  },
  mutations: {
    setSuelas(state, data) {
      state.suelas = data;
    },

    setNuevaSuela(state, suela) {
      state.nuevaSuela = suela;
    },

    iniciarSuela(state) {
      state.nuevaSuela = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        defaultColor: null,
        colores: []
      };
    }

  },
  actions: {
    async getSuelas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setSuelas', res.data.docs);
      } else {
        console.log('ErrorGET');
      }
    },

    async updateSuela({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevaSuela._id}/`, state.nuevaSuela, {
        params: {
          "rev": state.nuevaSuela._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setSuelas', response.data.docs);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveSuela({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevaSuela, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setSuelas', response.data.docs);
      } else {
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteSuela({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevaSuela._id}`, {
        params: {
          "rev": state.nuevaSuela._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setSuelas', response.data.docs);
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    suelas: state => state.suelas,

    nuevaSuela: state => state.nuevaSuela
  }
}