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
    axios.post('http://localhost:5984/zapp-avillos/_find', {
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
      codigo:null,
      rendimientoPorYarda: null,
      capeyada: null,
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
        codigo:null,
        rendimientoPorYarda: null,
        capeyada: null,
        avillos: [],
        adornos: [],
        _attachments: undefined
      };
    },

    setCorrelativo(state, correlativo) {
      state.nuevoEstilo.correlativo = Number(correlativo);
      state.nuevoEstilo.codigo = state.nuevoEstilo.linea.nombre+correlativo;
    },


    setEstilos(state, data) {
      state.estilos = data;
      console.log("setEstilos");
    },

    setData(state, data) {
      state.lineas = data[0].data.docs;
      state.nuevoEstilo.avillos = data[1].data.docs;
      state.nuevoEstilo.adornos = data[2].data.docs;

    },

    setNuevoEstilo(state, estilo) {
      state.nuevoEstilo = estilo;
    }

  },
  actions: {

    async generarCorrelativo({ commit }, linea) {

      if (linea != undefined && linea != null) {
        const res = await axios.post(`${url}_design/correlativosExistentes/_view/correlativosExistentes?reduce=true&key=%22${linea}%22`, {}, credentials.authentication);

        console.log();
        let correlativos = [];


        if (res.data.rows.length > 0) {
          res.data.rows[0].value.forEach(element => {
            correlativos = correlativos.concat(element);
          });
        }
        console.log(correlativos);

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
    }

  },
  getters: {
    estilos: state => state.estilos,


    lineas: state => state.lineas,
    nuevoEstilo: state => state.nuevoEstilo
  }
}
