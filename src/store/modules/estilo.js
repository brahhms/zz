import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-estilos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}

async function createAttachment(att, id, rev) {
  await axios.put(`${url}${id}/img?rev=${rev}`, att, {
    "auth": credentials.authentication.auth,
    "headers": {
      "Content-Type": att.type
    }
  }, credentials.authentication);
}

async function iniciarEstilo() {
  const data = await axios.all([
    axios.post(`http://localhost:5984/zapp-lineas/_find`, {
      "selector": {}
    }, credentials.authentication),
    axios.post('http://localhost:5984/zapp-adornos/_find', {
      "selector": {}
    }, credentials.authentication),
  ]);
  return data
}


export default {
  namespaced: true,
  state: {
    nuevoEstilo: {
      _id: undefined,
      _rev: undefined,
      linea: null,
      correlativo: null,
      codigo: null,
      rendimientoMaterial: null,
      rendimientoForro: null,
      avillos: [],
      adornos: [],
      _attachments: undefined
    },

    estilos: [],
    lineas: [],

  },
  mutations: {
    initialize(state) {
      state.nuevoEstilo = {
        _id: undefined,
        _rev: undefined,
        linea: null,
        correlativo: null,
        codigo: null,
        rendimientoMaterial: null,
        rendimientoForro: null,
        avillos: [],
        adornos: [],
        _attachments: undefined
      };
    },

    resetAvillos(state){
      state.nuevoEstilo.avillos=[];
    },

    addAdornos(state, adornos) {
      state.nuevoEstilo.adornos = state.nuevoEstilo.adornos.concat(adornos);
    },

    setAvillosDeLinea(state, avillos) {
      state.nuevoEstilo.avillos = state.nuevoEstilo.avillos.concat(avillos);
    },

    setCorrelativo(state, correlativo) {
      state.nuevoEstilo.correlativo = Number(correlativo);
      state.nuevoEstilo.codigo = state.nuevoEstilo.linea.nombre + correlativo;
    },

    setEstilos(state, data) {
      state.estilos = data;
      console.log("setEstilos");
    },

    setData(state, data) {
      state.lineas = data[0].data.docs;
      state.nuevoEstilo.adornos = data[1].data.docs;
    },

    setNuevoEstilo(state, estilo) {
      state.nuevoEstilo = estilo;
    }

  },
  actions: {

    async generarCorrelativo({ commit, state }) {

      if (state.nuevoEstilo.linea != undefined && state.nuevoEstilo.linea != null) {
        const res = await axios.post(`${url}_design/correlativosExistentes/_view/correlativosExistentes?reduce=true&key=%22${state.nuevoEstilo.linea.nombre}%22`, {}, credentials.authentication);

        let correlativos = [];

        if (res.data.rows.length > 0) {
          res.data.rows[0].value.forEach(element => {
            correlativos = correlativos.concat(element);
          });
        }
        

        let n = 1;
        correlativos.sort();
        correlativos.forEach(i => {
          if (i == n) {
            n++;
          }
        });

        commit('setCorrelativo', n);
      }

    },

    async getEstilos({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setEstilos', res.data.docs);
    },

    async updateEstilo({
      commit,
      state
    }) {
      let rendimientoForro = 1/Number(state.nuevoEstilo.rendimientoForro );
      let rendimientoMaterial = 1/Number(state.nuevoEstilo.rendimientoMaterial );
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      state.nuevoEstilo.adornos = state.nuevoEstilo.adornos.filter(a => a.cantidad > 0);
      state.nuevoEstilo.avillos = state.nuevoEstilo.avillos.filter(a => a.cantidad > 0);
      const res = await axios.put(`${url}${state.nuevoEstilo._id}/`, state.nuevoEstilo, {
        params: {
          "rev": state.nuevoEstilo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      let att = state.nuevoEstilo._attachments;
      if (res.data.ok && att != null && att != undefined) {
        await createAttachment(att, res.data.id, res.data.rev);
      }



      const response = await getAll();
      commit('setEstilos', response.data.docs);
    },

    async saveEstilo({
      commit,
      state
    }) {
      let rendimientoForro = 1/Number(state.nuevoEstilo.rendimientoForro );
      let rendimientoMaterial = 1/Number(state.nuevoEstilo.rendimientoMaterial );
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      const res = await axios.post(`${url}`, state.nuevoEstilo, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers
      }, credentials.authentication);

      let att = state.nuevoEstilo._attachments;
      if (res.data.ok && att != null && att != undefined) {
        await createAttachment(att, res.data.id, res.data.rev);
      }


      const response = await getAll();
      commit('setEstilos', response.data.docs);
    },

    async deleteEstilo({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoEstilo._id}`, {
        params: {
          "rev": state.nuevoEstilo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setEstilos', response.data.docs);
    },

    async iniciarEstilo({
      commit
    }) {
      commit('initialize');
      const data = await iniciarEstilo();
      commit('setData', data);
    },


    async actualizarAvillos({
      commit, state
    }) {

      let condiciones = [
        {
          "nombre": {
            "$in":
              state.nuevoEstilo.linea.avillos.map(x => { return x.nombre }),
          }
        },
        {
          "predeterminado": true
        }
      ];
      if (state.nuevoEstilo.linea.tacon) {
        condiciones.push({ "paraTacon": true });
      }
      const res = await axios.post('http://localhost:5984/zapp-avillos/_find', {
        "selector": {
          "$or": condiciones,
          "nombre": {
            "$nin": state.nuevoEstilo.avillos.map(x => { return x.nombre })
          }
        }
      }, credentials.authentication);

      if (res.statusText == 'OK') {
     
        commit('setAvillosDeLinea', res.data.docs);
      }

    },

    async actualizarAdornos({
      commit, state
    }) {
      const res = await axios.post('http://localhost:5984/zapp-adornos/_find', {
        "selector": {
          "nombre": {
            "$nor": state.nuevoEstilo.adornos.map(x => { return x.nombre })
          }
        }
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        commit('addAdornos', res.data.docs);
      }

    },

  },
  getters: {
    estilos: state => state.estilos,

    lineas: state => state.lineas,
    nuevoEstilo: state => state.nuevoEstilo
  }
}
