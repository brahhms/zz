import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-materiales/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {},"limit":500
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoMaterial: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      defaultColor: null,
      colores: []
    },
    materiales: []
  },
  mutations: {
    setMateriales(state, data) {
      state.materiales = data;
    },

    setNuevoMaterial(state, material) {
      state.nuevoMaterial = material;
    },

    iniciarMaterial(state) {
      state.nuevoMaterial = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        defaultColor: null,
        colores: []
      };
    }

  },
  actions: {
    async getMateriales({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {},"limit":500
        
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setMateriales', res.data.docs);
      } else {
        console.log('ErrorGET');
      }
    },

    async updateMaterial({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevoMaterial._id}/`, state.nuevoMaterial, {
        params: {
          "rev": state.nuevoMaterial._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setMateriales', response.data.docs);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveMaterial({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoMaterial, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setMateriales', response.data.docs);
      } else {
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deleteMaterial({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevoMaterial._id}`, {
        params: {
          "rev": state.nuevoMaterial._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setMateriales', response.data.docs);
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    materiales: state => state.materiales,

    nuevoMaterial: state => state.nuevoMaterial,
    isValid: state => {
      if (state.nuevoMaterial.nombre != null &&
        state.nuevaMaterial.nombre != '' &&
        state.nuevoMaterial.nombre != ' ' &&
        state.nuevoMaterial.colores.length >0 &&
        state.nuevoMaterial.defaultColor !=null
        ) {
        return true;
      } else {
        return false
      }

    },
  }
}