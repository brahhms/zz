import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-hormas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevaHorma: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      paraTacon:false
    },
    hormas: []
  },
  mutations: {
    setHormas(state, data) {
      state.hormas = data;
    },

    setNuevaHorma(state, horma) {
      state.nuevaHorma = horma;
    },

    iniciarHorma(state) {
      state.nuevaHorma = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        paraTacon:false
      };
    }

  },
  actions: {
    async getHormas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      
      if(res.statusText=='OK'){
        commit('setHormas', res.data.docs);
      }else{
        console.log('ErrorGET');
      }
    },

    async updateHorma({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevaHorma._id}/`, state.nuevaHorma, {
        params: {
          "rev": state.nuevaHorma._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setHormas', response.data.docs);
      }else{
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveHorma({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevaHorma, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setHormas', response.data.docs);
      }else{
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteHorma({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevaHorma._id}`, {
        params: {
          "rev": state.nuevaHorma._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setHormas', response.data.docs);
      }else{
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    hormas: state => state.hormas,

    nuevaHorma: state => state.nuevaHorma
  }
}