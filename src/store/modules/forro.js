import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-forros/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {},"limit":500
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoForro: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      defaultColor: null,
      colores: []
    },
    forros: []
  },
  mutations: {
    setForros(state, data) {
      state.forros = data;
    },

    setNuevoForro(state, forro) {
      state.nuevoForro = forro;
    },

    iniciarForro(state) {
      state.nuevoForro = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        defaultColor: null,
        colores: []
      };
    }

  },
  actions: {
    async getForros({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {},"limit":500
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setForros', res.data.docs);
      } else {
        console.log('ErrorGET');
      }
    },

    async updateForro({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevoForro._id}/`, state.nuevoForro, {
        params: {
          "rev": state.nuevoForro._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setForros', response.data.docs);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveForro({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoForro, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setForros', response.data.docs);
      } else {
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteForro({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevoForro._id}`, {
        params: {
          "rev": state.nuevoForro._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setForros', response.data.docs);
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    forros: state => state.forros,

    nuevoForro: state => state.nuevoForro,
    isValid: state => {
      if (state.nuevoForro.nombre != null &&
        state.nuevaForro.nombre != '' &&
        state.nuevoForro.nombre != ' ' &&
        state.nuevoForro.colores.length >0 &&
        state.nuevoForro.defaultColor !=null
        ) {
        return true;
      } else {
        return false
      }

    },
  }
}