import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-adornos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


export default {
  namespaced: true,
  state: {
    nuevoAdorno: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      cantidad: 0,
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
        nombre: "pares",
        constante: Number(1)
      }
    },
    adornos: [],
    unidades: [
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
            constante: Number(1/91.44)
          },
          {
            nombre: "pulgadas",
            constante: Number(1/36)
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
            constante: Number(1/91.44)
          },
          {
            nombre: "pulgadas",
            constante: Number( 2.54)
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
            constante: Number(1/2.54)
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
            constante: Number(1/1.094)
          },
          {
            nombre: "metros",
            constante: Number(1)
          },
          {
            nombre: "centimetros",
            constante: Number(1/100)
          },
          {
            nombre: "pulgadas",
            constante: Number(1/39.37)
          },
        ]
      },
    ]
  },
  mutations: {
    setAdornos(state, data) {
      state.adornos = data;
      console.log("setAdornos");
    },

    setNuevoAdorno(state, adorno) {
      state.nuevoAdorno = adorno;
    },

    iniciarAdorno(state) {
      state.nuevoAdorno = {
        _id: undefined,
        _rev: undefined,
        nombre: null,
        cantidad: 0,
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
          nombre: "pares",
          constante: Number(1)
        }
      };
    }

  },
  actions: {
    async getAdornos({
      commit
    }) {
      const res = await axios.post(`${url}_find`, {
        "selector": {}
      }, credentials.authentication);
      commit('setAdornos', res.data.docs);
    },

    async updateAdorno({
      commit,
      state
    }) {
      await axios.put(`${url}${state.nuevoAdorno._id}/`, state.nuevoAdorno, {
        params: {
          "rev": state.nuevoAdorno._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setAdornos', response.data.docs);
    },

    async saveAdorno({
      commit,
      state
    }) {
      let res = await axios.post(`${url}`, state.nuevoAdorno, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      if (res.data.ok) {
        console.log("ok");
        const response = await getAll();
        commit('setAdornos', response.data.docs);
      }


    },

    async deleteAdorno({
      commit,
      state
    }) {
      await axios.delete(`${url}${state.nuevoAdorno._id}`, {
        params: {
          "rev": state.nuevoAdorno._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAdornos', response.data.docs);
    }
  },
  getters: {
    adornos: state => state.adornos,
    unidades: state => state.unidades,

    nuevoAdorno: state => state.nuevoAdorno
  }
}