import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-adornos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoAdorno: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      cantidad: 0,
      unidad: "pares"
    },
    adornos: [],
    unidades: ["pares",
      "pares en pliego",
      "galones"
    ]
  },
  mutations: {
    setAdornos(state, data) {
      state.adornos = data;
      console.log("setAdornos");
    },

    setNuevoAdorno(state, adorno) {
      state.nuevoAdorno = adorno;
    },

    iniciarAdorno(state) {
      state.nuevoAdorno = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        cantidad: 0,
        unidad: "pares"
      };
    }

  },
  actions: {
    async getAdornos({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setAdornos', res.data.docs);
    },

    async updateAdorno({
      commit,
      state
    }) {
      await axios.put(`${url}${state.nuevoAdorno._id}/`, state.nuevoAdorno, {
        params: {
          "rev": state.nuevoAdorno._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setAdornos', response.data.docs);
    },

    async saveAdorno({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoAdorno, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setAdornos', response.data.docs);
      }


    },

    async deleteAdorno({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoAdorno._id}`, {
        params: {
          "rev": state.nuevoAdorno._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAdornos', response.data.docs);
    }
  },
  getters: {
    adornos: state => state.adornos,
    unidades: state => state.unidades,

    nuevoAdorno: state => state.nuevoAdorno
  }
}