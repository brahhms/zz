import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-plantillas/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}

async function actualizarEnLinea(plantilla, del) {
  const response = await axios.post(`http://localhost:5984/zapp-lineas/_find`, {
    "selector": {
      "$or": [
        { "plantilla._id": plantilla._id },
        { "plantilla.nombre": plantilla.nombre }
      ]
    }
  }, credentials.authentication);

  let lineas = response.data.docs;

  lineas.forEach(linea => {
    linea.plantilla = plantilla;

    if (del) {
      linea.plantilla = null;
    }


  });

  const res = await axios.post(`http://localhost:5984/zapp-lineas/_bulk_docs`, {
    "docs": lineas
  }, credentials.authentication);


  return res;
}

async function actualizarEnEstilo(plantilla, del) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "$or": [
        { "linea.plantilla._id": plantilla._id },
        { "linea.plantilla.nombre": plantilla.nombre }
      ]
    }
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    estilo.linea.plantilla = plantilla;

    if (del) {
      estilo.linea.plantilla = null;
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
    nuevaPlantilla: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      avillos: []
    },
    plantillas: []
  },
  mutations: {


    setPlantillas(state, data) {
      state.plantillas = data;
    },

    setNuevaPlantilla(state, plantilla) {
      state.nuevaPlantilla = plantilla;
    },

    initialize(state) {
      state.nuevaPlantilla = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        avillos: []
      };
    }
    ,
    setAvillos(state, avillos) {

      if (state.nuevaPlantilla.avillos.length == 0) {
        state.nuevaPlantilla.avillos = avillos;
      } else {
        avillos.forEach(avillo => {
          console.log(state.nuevaPlantilla.avillos.filter(a => a.nombre != avillo.nombre));
        });
      }

      // avillos.filter(avillo=> avillo.nombre!= );




    }


  },
  actions: {

    async iniciarPlantilla({
      commit
    }) {

      const res = await axios.post(`http://localhost:5984/zapp-avillos/_find`, {
        "selector": {}
      }, credentials.authentication);



      if (res.statusText == 'OK') {
        commit('initialize');
        commit('setAvillos', res.data.docs);
        return true
      } else {
        return false
      }

    },


    async getPlantillas({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('setPlantillas', res.data.docs);
      } else {
        console.log('ErrorGET');
      }
    },

    async updatePlantilla({
      commit,
      state
    }) {
      let res = await axios.put(`${url}${state.nuevaPlantilla._id}/`, state.nuevaPlantilla, {
        params: {
          "rev": state.nuevaPlantilla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setPlantillas', response.data.docs);
        await actualizarEnLinea(state.nuevaPlantilla, false);
        await actualizarEnEstilo(state.nuevaPlantilla, false);
      } else {
        console.log('errorUPDATE');
      }
      return res.data.ok
    },

    async savePlantilla({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevaPlantilla, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        const response = await getAll();
        commit('setPlantillas', response.data.docs);
      } else {
        console.log('errorSAVE');
      }
      return res.data.ok

    },

    async deletePlantilla({
      commit,
      state
    }) {
      let res = await axios.delete(`${url}${state.nuevaPlantilla._id}`, {
        params: {
          "rev": state.nuevaPlantilla._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      if (res.data.ok) {
        const response = await getAll();
        commit('setPlantillas', response.data.docs);
      } else {
        console.log('errorDelete');
      }
      return res.data.ok
    }
  },
  getters: {
    plantillas: state => state.plantillas,


    nuevaPlantilla: state => state.nuevaPlantilla
  }
}