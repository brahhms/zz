import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-avillos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
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
            nombre: "galones",
            constante: Number(1)
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
          },
          {
            nombre: "pliegos",
            constante: Number(1)
          }
        ]
      },
      {
        nombre: "yardas",
        conversiones: [
          {
            nombre: "yardas",
            constante: Number(1)
          },
          {
            nombre: "metros",
            constante: Number(1.094)
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
        nombre: "centimetros",
        conversiones: [
          {
            nombre: "yardas",
            constante: Number(91.44)
          },
          {
            nombre: "metros",
            constante: Number(100)
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 91.44)
          },
          {
            nombre: "pulgadas",
            constante: Number(2.54)
          },
        ]
      },
      {
        nombre: "pulgadas",
        conversiones: [
          {
            nombre: "yardas",
            constante: Number(36)
          },
          {
            nombre: "metros",
            constante: Number(39.37)
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 2.54)
          },
          {
            nombre: "pulgadas",
            constante: Number(1)
          },
        ]
      },
      {
        nombre: "metros",
        conversiones: [
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