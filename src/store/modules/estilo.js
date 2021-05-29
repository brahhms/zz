import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-estilos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}, "limit": 500
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
      "selector": {}, "limit": 500
    }, credentials.authentication),
    axios.post('http://localhost:5984/zapp-adornos/_find', {
      "selector": {}, "limit": 500
    }, credentials.authentication),
  ]);
  return data
}

async function existeCodigo(codigo) {

  try {
    const existe = await axios.post(`${url}_find`, {
      "selector": {
        "codigo": codigo
      }, "limit": 500
    }, credentials.authentication);
    if (existe.data.docs.length > 0) {
      return true
    }
  } catch (error) {
  }
  return false;
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
      img: null,
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
        img: null,
        _attachments: undefined
      };
    },

    resetAvillos(state) {
      state.nuevoEstilo.avillos = [];
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

    async setNuevoEstilo(state, estilo) {
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
        "selector": {}, "limit": 500
      }, credentials.authentication);
      commit('setEstilos', res.data.docs);
    },

    async updateEstilo({
      commit,
      state
    }) {

      commit('setCorrelativo', state.nuevoEstilo.correlativo);

      if (Number(state.nuevoEstilo.rendimientoForro) < 1) {
        state.nuevoEstilo.rendimientoForro = 1;
      }
      if (Number(state.nuevoEstilo.rendimientoMaterial) < 1) {
        state.nuevoEstilo.rendimientoForro = 1;
      }
      let rendimientoForro = 1 / Number(state.nuevoEstilo.rendimientoForro);
      let rendimientoMaterial = 1 / Number(state.nuevoEstilo.rendimientoMaterial);
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      state.nuevoEstilo.adornos = state.nuevoEstilo.adornos.filter(a => Number(a.cantidad) > 0);
      state.nuevoEstilo.avillos = state.nuevoEstilo.avillos.filter(a => Number(a.cantidad) > 0);


      let att = state.nuevoEstilo.img;
      state.nuevoEstilo.img = undefined;
      let res;

      try {
        res = await axios.put(`${url}${state.nuevoEstilo._id}/`, state.nuevoEstilo, {
          params: {
            "rev": state.nuevoEstilo._rev
          },
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers,
        }, credentials.authentication);

      } catch (error) {
        return "Error";
      }

      if (res.data.ok) {

        if (att != null && att != undefined) {
          console.log("createAtt");
          await createAttachment(att, res.data.id, res.data.rev);
        }
        let response = await getAll();
        commit('setEstilos', response.data.docs);
        return "Estilo " + state.nuevoEstilo.codigo + " se ha editado!";
      }

    },

    async saveEstilo({
      commit,
      state
    }) {


      commit('setCorrelativo', state.nuevoEstilo.correlativo);
      let existe = await existeCodigo(state.nuevoEstilo.codigo);
      if (existe) {
        return "ya existe el codigo " + state.nuevoEstilo.codigo;
      }
      if (Number(state.nuevoEstilo.rendimientoForro) < 1) {
        state.nuevoEstilo.rendimientoForro = 1;
      }
      if (Number(state.nuevoEstilo.rendimientoMaterial) < 1) {
        state.nuevoEstilo.rendimientoForro = 1;
      }

      let rendimientoForro = 1 / Number(state.nuevoEstilo.rendimientoForro);
      let rendimientoMaterial = 1 / Number(state.nuevoEstilo.rendimientoMaterial);
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      state.nuevoEstilo._id = state.nuevoEstilo.codigo;
      state.nuevoEstilo.adornos = state.nuevoEstilo.adornos.filter(a => Number(a.cantidad) > 0);
      state.nuevoEstilo.avillos = state.nuevoEstilo.avillos.filter(a => Number(a.cantidad) > 0);


      let res;
      try {
        res = await axios.post(`${url}`, state.nuevoEstilo, {
          "auth": credentials.authentication.auth,
          "headers": credentials.authentication.headers
        }, credentials.authentication);

      } catch (error) {

        let response = await getAll();
        commit('setEstilos', response.data.docs);
        return "Error!";
      }

      if (res.data.ok) {
        let att = state.nuevoEstilo._attachments;
        if (att != null && att != undefined) {
          return await createAttachment(att, res.data.id, res.data.rev);
        }

        let response = await getAll();
        commit('setEstilos', response.data.docs);

        return "Estilo " + state.nuevoEstilo.codigo + " se ha guardado!";
      }


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

      state.nuevoEstilo.linea.avillos.forEach(avilloDeLinea => {
        let existe = false;
        state.nuevoEstilo.avillos.forEach(avillo => {
          if (avillo.nombre == avilloDeLinea.nombre) {
            existe = true;
          }
        });
        if (!existe) {
          state.nuevoEstilo.avillos.push(avilloDeLinea);
        }
      });


      let condiciones = [

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
        }, "limit": 500
      }, credentials.authentication);

      const res2 = await axios.post('http://localhost:5984/zapp-avillos/_find', {
        "selector": {
          "nombre": {
            "$in": state.nuevoEstilo.avillos.map(x => { return x.nombre })
          }
        }, "limit": 500
      }, credentials.authentication);

      if (res2.statusText == 'OK') {

        res2.data.docs.forEach(item => {

          state.nuevoEstilo.avillos.forEach(a => {

            if (a.nombre == item.nombre) {
              a.predeterminado = item.predeterminado;
              a.paraTacon = item.paraTacon;
              a.colorSegunMaterial = item.colorSegunMaterial;
              a.colorSegunSuela = item.colorSegunSuela;
              if (item.unidad.nombre != a.unidad.nombre || item.unidadConversion.nombre != a.unidadConversion.nombre) {
                a.cantidad = 0;
                a.cantidadInicial = 0;
                a.unidad = item.unidad;
                a.unidadConversion = item.unidadConversion;
              }
            }

          });

        });


      }



      commit('setAvillosDeLinea', res.data.docs);


    },

    async actualizarAdornos({
      commit, state
    }) {
      const res = await axios.post('http://localhost:5984/zapp-adornos/_find', {
        "selector": {
          "nombre": {
            "$nor": state.nuevoEstilo.adornos.map(x => { return x.nombre })
          }
        }, "limit": 500
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
