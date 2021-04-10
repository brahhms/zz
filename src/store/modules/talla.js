import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-tallas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevaTalla: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      cantidad: 0,
      unidad: "pares"
    },
    tallas: [],
    unidades: ["pares",
      "pares en pliego",
      "galones"
    ]
  },
  mutations: {
    setTallas(state, data) {
      state.tallas = data;
      console.log("setTallas");
    },

    setNuevaTalla(state, talla) {
      state.nuevaTalla = talla;
    },

    iniciarTalla(state) {
      state.nuevaTalla = {
        _id: undefined,
        _rev: undefined,
        nombre: null
      };
    }

  },
  actions: {
    async getTallas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setTallas', res.data.docs);
    },

    async updateTalla({
      commit,
      state
    }) {
      await axios.put(`${url}${state.nuevaTalla._id}/`, state.nuevaTalla, {
        params: {
          "rev": state.nuevaTalla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setTallas', response.data.docs);
    },

    async saveTalla({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevaTalla, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setTallas', response.data.docs);
      }


    },

    async deleteTalla({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevaTalla._id}`, {
        params: {
          "rev": state.nuevaTalla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setTallas', response.data.docs);
    }
  },
  getters: {
    tallas: state => state.tallas,
    unidades: state => state.unidades,

    nuevaTalla: state => state.nuevaTalla
  }
}