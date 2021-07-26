import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-lineas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}, "limit": 500
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
    }, "limit": 500
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


async function getAvillos() {
  const res = await axios.post(`http://localhost:5984/zapp-avillos/_find`, {
    "selector": {}, "limit": 500
  }, credentials.authentication);
  return res.data.docs;
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
      avillos: [],
      horma: undefined,
      suela: undefined,
      forro: undefined
    },
    lineas: [],


    plantillas: [],
    hormas: [],
    suelas: [],
    forros: []
  },
  mutations: {
    setLineas(state, data) {
      state.lineas = data;
    },

    async setNuevaLinea(state, linea) {
      state.nuevaLinea = linea;
      if (linea._id !== undefined && linea._id !== null) {
        let avillos = await getAvillos();
        avillos.forEach(avillo => {
          linea.avillos.forEach(a => {
            if (a.nombre == avillo.nombre || a._id == avillo._id) {
              avillo.cantidad = a.cantidad;
              avillo.cantidadInicial = a.cantidadInicial;
              avillo.unidad = a.unidad;
              avillo.unidadConversion = a.unidadConversion;
              avillo.icon = "mdi-check";
            }
          });
        });
        state.nuevaLinea.avillos = avillos;
      }

    },

    initialize(state) {
      state.nuevaLinea = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        tacon: false,
        plantilla: null,
        avillos: [],
        horma: undefined,
        suela: undefined,
        forro: undefined
      };
    },

    setData(state, data) {

      state.plantillas = data[0].data.docs;
      state.hormas = data[1].data.docs;
      state.suelas = data[2].data.docs;
      state.forros = data[3].data.docs;
      state.nuevaLinea.plantilla = state.plantillas[0];
      state.nuevaLinea.horma = state.hormas[0];
      state.nuevaLinea.suela = state.suelas[0];
      state.nuevaLinea.forro = state.forros[0];
    },

    setAvillosDeLinea(state, avillos) {
      state.nuevaLinea.avillos = state.nuevaLinea.avillos.concat(avillos);
    },


  },
  actions: {

    async iniciarLinea({
      commit
    }) {
      commit('initialize');

      const data = await axios.all([

        axios.post('http://localhost:5984/zapp-plantillas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-hormas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-suelas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-forros/_find', {
          "selector": {}, "limit": 500
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

    async actualizarAvillos({
      commit, state }) {
      //state.nuevaLinea.avillos = state.nuevaLinea.plantilla.avillos;
      const res = await axios.post(`http://localhost:5984/zapp-avillos/_find`, {
        "selector": {
          "nombre": {
            "$nin": state.nuevaLinea.avillos.map(x => { return x.nombre })
          }
        }, "limit": 500
      }, credentials.authentication);


      commit('setAvillosDeLinea', res.data.docs);
    },

    async getLineas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}, "limit": 500
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
      nueva.avillos = nueva.avillos.filter(a => Number(a.cantidad) > 0);
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
        actualizarEnEstilo(nueva, false);
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
      nueva.avillos = nueva.avillos.filter(a => Number(a.cantidad) > 0);

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

    plantillas: state => state.plantillas,
    hormas: state => state.hormas,
    suelas: state => state.suelas,
    forros: state => state.forros,

    isValid: state => {

      if (state.nuevaLinea.nombre != null &&
        state.nuevaLinea.nombre != '' &&
        state.nuevaLinea.nombre != ' ' &&
        state.nuevaLinea.plantilla != null &&
        state.nuevaLinea.horma != undefined &&
        state.nuevaLinea.suela != undefined &&
        state.nuevaLinea.forro != undefined) {
        return true;
      } else {
        return false
      }
    },

    nuevaLinea: state => state.nuevaLinea
  }
}