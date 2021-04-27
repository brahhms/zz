import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-lineas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}



export default {
  namespaced: true,
  state: {
    nuevaLinea: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      tacon: false,
      avillos: []
    },
    lineas: [],
    avillos:[]
  },
  mutations: {
    setLineas(state, data) {
      state.lineas = data;
    },

    setNuevaLinea(state, linea) {
      state.nuevaLinea = linea;
    },

    initialize(state) {
      state.nuevaLinea = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        tacon: false,
        avillos: []
      };
    }
    ,
    setAvillos(state, avillos) {
      state.avillos = avillos;
    }


  },
  actions: {

    async iniciarLinea({
      commit
    }) {
      commit('initialize');
      const res = await axios.post(`http://localhost:5984/zapp-avillos/_find`, {
        "selector": {}
      }, credentials.authentication);

      if (res.statusText=='OK') {
        commit('setAvillos', res.data.docs);
        return true
      } else {
        return false
      }

    },


    async getLineas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setLineas', res.data.docs);
      } else {
        console.log('ErrorGET');
      }
    },

    async updateLinea({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevaLinea._id}/`, state.nuevaLinea, {
        params: {
          "rev": state.nuevaLinea._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setLineas', response.data.docs);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveLinea({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevaLinea, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setLineas', response.data.docs);
      } else {
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteLinea({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevaLinea._id}`, {
        params: {
          "rev": state.nuevaLinea._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setLineas', response.data.docs);
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    lineas: state => state.lineas,
    avillos:state=> state.avillos,

    nuevaLinea: state => state.nuevaLinea
  }
}