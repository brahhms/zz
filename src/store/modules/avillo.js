import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-avillos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoAvillo: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      cantidad: 0,
      unidad: "pares"
    },
    avillos: [],
    unidades: ["pares",
      "pares en pliego",
      "galones"
    ]
  },
  mutations: {
    setAvillos(state, data) {
      state.avillos = data;
      console.log("setAvillos");
    },

    setNuevoAvillo(state, avillo) {
      state.nuevoAvillo = avillo;
    },

    iniciarAvillo(state) {
      state.nuevoAvillo = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        cantidad: 0,
        unidad: "pares"
      };
    }

  },
  actions: {
    async getAvillos({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setAvillos', res.data.docs);
    },

    async updateAvillo({
      commit,
      state
    }) {
      await axios.put(`${url}${state.nuevoAvillo._id}/`, state.nuevoAvillo, {
        params: {
          "rev": state.nuevoAvillo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setAvillos', response.data.docs);
    },

    async saveAvillo({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoAvillo, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setAvillos', response.data.docs);
      }


    },

    async deleteAvillo({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoAvillo._id}`, {
        params: {
          "rev": state.nuevoAvillo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAvillos', response.data.docs);
    }
  },
  getters: {
    avillos: state => state.avillos,
    unidades: state => state.unidades,

    nuevoAvillo: state => state.nuevoAvillo
  }
}