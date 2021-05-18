import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-lineas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


async function actualizarEnEstilo(linea, del) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "$or": [
        { "linea._id": linea._id },
        { "linea.nombre": linea.nombre }
      ]
    }
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    estilo.linea = linea;

    if (del) {
      //estilo.linea = null;
    }


  });

  const res = await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, {
    "docs": estilos
  }, credentials.authentication);


  return res;
}


export default {
  namespaced: true,
  state: {
    nuevaLinea: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      tacon: false,
      plantilla: null,
      avillos: []
    },
    lineas: [],
    avillos: [],
    plantillas: []
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
        plantilla: null,
        avillos: []
      };
    },

    setData(state, data) {
      state.avillos = data[0].data.docs;
      state.plantillas = data[1].data.docs;
      state.nuevaLinea.plantilla = state.plantillas[0];
    },


  },
  actions: {

    async iniciarLinea({
      commit
    }) {
      commit('initialize');

      const data = await axios.all([
        axios.post(`http://localhost:5984/zapp-avillos/_find`, {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-plantillas/_find', {
          "selector": {}
        }, credentials.authentication),
      ]);

      let isOK = true;
      data.forEach(res => {
        if (res.statusText != "OK") {
          isOK = false;
        }
      });

      if (isOK) {
        commit('setData', data);
      }

      return isOK



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
      let nueva = state.nuevaLinea;
      nueva.nombre = nueva.nombre.toUpperCase();
      let res = await axios.put(`${url}${nueva._id}/`, nueva, {
        params: {
          "rev": nueva._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setLineas', response.data.docs);
        actualizarEnEstilo(nueva,false);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async saveLinea({
      commit,
      state
    }) {
      let nueva = state.nuevaLinea;
      nueva.nombre = nueva.nombre.toUpperCase();
      let res = await axios.post(`${url}`, nueva, {
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
    avillos: state => state.avillos,
    plantillas: state => state.plantillas,

    nuevaLinea: state => state.nuevaLinea
  }
}