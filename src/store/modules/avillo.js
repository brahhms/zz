import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-avillos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}

async function actualizarEnEstilo(avillo) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "avillos": {
        "$elemMatch": {
          "_id": avillo._id
        }
      }
    }
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    let index = estilo.avillos.findIndex(x => x._id == avillo._id);
    estilo.avillos[index].nombre = avillo.nombre;
    estilo.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
    if (estilo.avillos[index].unidad.nombre != avillo.unidad.nombre) {
      estilo.avillos[index].unidad = avillo.unidad;
      estilo.avillos[index].unidadConversion = avillo.unidadConversion;
      estilo.avillos[index].cantidadInicial = 0;
      estilo.avillos[index].cantidad = 0;
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
    nuevoAvillo: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      cantidad: 0,
      cantidadInicial:0,
      unidad: {
        nombre: "pares",
        conversiones: [
          {
            nombre: "pares",
            constante: Number(1)
          }
        ]
      },
      colorSegunMaterial:false,
      unidadConversion: {
        nombre: "pares en pliego",
        constante: null
      },
      predeterminado: false,
      paraTacon: false
    },
    avillos: [],
    unidades: [
      {
        nombre: "galones",
        conversiones: [
          {
            nombre: "pares en galon",
            constante: null
          }
        ]
      },
      {
        nombre: "pares",
        conversiones: [
          {
            nombre: "pares",
            constante: Number(1)
          }
        ]
      },
      {
        nombre: "pliegos",
        conversiones: [
          {
            nombre: "pares en pliego",
            constante: null
          }
        ]
      },
      {
        nombre: "yardas",
        conversiones: [
          {
            nombre: "pares en yardas",
            constante: null
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 91.44)
          },
          {
            nombre: "pulgadas",
            constante: Number(1 / 36)
          },
        ]
      },

      {
        nombre: "metros",
        conversiones: [
          {
            nombre: "pares en metros",
            constante: null
          },
          {
            nombre: "yardas",
            constante: Number(1 / 1.094)
          },
          {
            nombre: "metros",
            constante: Number(1)
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 100)
          },
          {
            nombre: "pulgadas",
            constante: Number(1 / 39.37)
          },
        ]
      },
    ]
  },
  mutations: {
    setAvillos(state, data) {
      state.avillos = data;
      console.log("setAvillos");
    },

    setNuevoAvillo(state, avillo) {
      state.nuevoAvillo = avillo;
    },

    iniciarAvillo(state) {
      state.nuevoAvillo = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        cantidad: 0,
        cantidadInicial:0,
        unidad: {
          nombre: "pares",
          conversiones: [
            {
              nombre: "pares",
              constante: Number(1)
            }
          ]
        },
        colorSegunMaterial:false,
        unidadConversion: {
          nombre: "pares en pliego",
          constante: null
        },
        predeterminado: false,
        paraTacon: false
      };
    }

  },
  actions: {
    async getAvillos({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setAvillos', res.data.docs);
    },

    async updateAvillo({
      commit,
      state
    }) {
      let update = state.nuevoAvillo;
      update.unidadConversion = update.unidad.conversiones[0];
      await axios.put(`${url}${update._id}/`, update, {
        params: {
          "rev": update._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setAvillos', response.data.docs);
      await actualizarEnEstilo(update);
    },

    async saveAvillo({
      commit,
      state
    }) {
      let nuevo = state.nuevoAvillo;
      nuevo.unidadConversion = nuevo.unidad.conversiones[0];
      let res = await axios.post(`${url}`, nuevo, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setAvillos', response.data.docs);
      }


    },

    async deleteAvillo({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoAvillo._id}`, {
        params: {
          "rev": state.nuevoAvillo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAvillos', response.data.docs);
    }
  },
  getters: {
    avillos: state => state.avillos,
    unidades: state => state.unidades,

    nuevoAvillo: state => state.nuevoAvillo
  }
}