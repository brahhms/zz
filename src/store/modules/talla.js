import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-tallas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {},"limit":500
  }, credentials.authentication);
  return response;
}

async function existeNombre(nombre) {
  const response = await axios.post(`${url}_find`, {
    "selector": {
      "nombre": nombre
    },"limit":500
  }, credentials.authentication);

  if (response.data.docs.length > 1) {
    await axios.delete(`${url}${response.data.docs[1]._id}`, {
      params: {
        "rev": response.data.docs[1]._rev
      },
      "auth": credentials.authentication.auth,
      "headers": credentials.authentication.headers,
    }, credentials.authentication);
    response.data.docs.pop();
  }


  return response.data.docs.length > 0;
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
        "selector": {},"limit":500
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setTallas', res.data.docs);
      } else {
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
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveTalla({
      commit,
      state
    }) {


      if (await existeNombre(state.nuevaTalla.nombre)) {
        return "Ya existe una talla con ese nombre"
      } else {
        let res = await axios.post(`${url}`, state.nuevaTalla, {
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
        }, credentials.authentication);
        if (res.data.ok) {
          const response = await getAll();
          commit('setTallas', response.data.docs);
          return "Talla guardada exitosamente!"
        } else {
          "Error al guardar talla"
        }

      }



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
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    tallas: state => state.tallas.sort((a, b) => {
      if (Number(a.nombre) > Number(b.nombre))
        return 1;
  
      if (Number(a.nombre) < Number(b.nombre))
        return -1;
  
      return 0;
    }),

    nuevaTalla: state => state.nuevaTalla
  }
}