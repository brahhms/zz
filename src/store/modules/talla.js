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
      nombre: null
    },
    tallas: []
  },
  mutations: {
    setTallas(state, data) {
      state.tallas = data;
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
      
      if(res.statusText=='OK'){
        commit('setTallas', res.data.docs);
      }else{
        console.log('ErrorGET');
      }
    },

    async updateTalla({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevaTalla._id}/`, state.nuevaTalla, {
        params: {
          "rev": state.nuevaTalla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setTallas', response.data.docs);
      }else{
        console.log('errorUPDATE');
      }
      return res.data.ok
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
        const response = await getAll();
        commit('setTallas', response.data.docs);
      }else{
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteTalla({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevaTalla._id}`, {
        params: {
          "rev": state.nuevaTalla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setTallas', response.data.docs);
      }else{
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    tallas: state => state.tallas,

    nuevaTalla: state => state.nuevaTalla
  }
}