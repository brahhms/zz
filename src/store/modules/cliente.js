import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-clientes/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoCliente: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      codigoPais: null,
      telefono: null,
      direccion: null,
      documento: null
    },
    clientes: [],
    codigos: [
      {
        codigo: "+501",
        pais: "Belice"
      }, {
        codigo: "+502",
        pais: "Guatemala"
      }, {
        codigo: "+503",
        pais: "El Salvador"
      },
      {
        codigo: "+504",
        pais: "Honduras"
      },
      {
        codigo: "+505",
        pais: "Nicaragua"
      },
      {
        codigo: "+506",
        pais: "Costa Rica"
      },
      {
        codigo: "+507",
        pais: "Panama"
      },
    ]
  },
  mutations: {
    setClientes(state, data) {
      state.clientes = data;
      console.log("setClientes");
    },

    setNuevoCliente(state, cliente) {
      state.nuevoCliente = cliente;
    },

    iniciarCliente(state) {
      state.nuevoCliente = {
        _id: undefined,
        _rev: undefined,
        nombre: null
      };
    }

  },
  actions: {
    async getClientes({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setClientes', res.data.docs);
    },

    async updateCliente({
      commit,
      state
    }) {
      await axios.put(`${url}${state.nuevoCliente._id}/`, state.nuevoCliente, {
        params: {
          "rev": state.nuevoCliente._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setClientes', response.data.docs);
    },

    async saveCliente({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoCliente, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setClientes', response.data.docs);
      }


    },

    async deleteCliente({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoCliente._id}`, {
        params: {
          "rev": state.nuevoCliente._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setClientes', response.data.docs);
    }
  },
  getters: {
    clientes: state => state.clientes,
    codigos: state => state.codigos,

    nuevoCliente: state => state.nuevoCliente
  }
}