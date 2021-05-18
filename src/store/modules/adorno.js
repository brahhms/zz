import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-adornos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}

async function actualizarEnEstilo(adorno,del) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "adornos": {
        "$elemMatch": {
          "_id": adorno._id
        }
      }
    }
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    let index = estilo.adornos.findIndex(x => x._id == adorno._id);
    if (index != undefined && index != null) {
      estilo.adornos[index].nombre = adorno.nombre;
      estilo.adornos[index].colorSegunMaterial = adorno.colorSegunMaterial;
      if (estilo.adornos[index].unidad.nombre != adorno.unidad.nombre) {
        estilo.adornos[index].unidad = adorno.unidad;
        estilo.adornos[index].unidadConversion = adorno.unidadConversion;
        estilo.adornos[index].cantidadInicial = 0;
        estilo.adornos[index].cantidad = 0;
      }
      if (del) {
        estilo.adornos.splice(index, 1);
      }
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
    nuevoAdorno: {
      _id: undefined,
      _rev: undefined,
      nombre: null,
      colorSegunMaterial: false,
      cantidad: 0,
      cantidadInicial: 0,
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
            nombre: "yardas",
            constante: Number(1 / 1.094)
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
        cantidadInicial: 0,
        colorSegunMaterial: false,
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
      let update = state.nuevoAdorno;
      update.unidadConversion = update.unidad.conversiones[0];
      await axios.put(`${url}${update._id}/`, update, {
        params: {
          "rev": update._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);
      const response = await getAll();
      commit('setAdornos', response.data.docs);
      await actualizarEnEstilo(update,false);
    },

    async saveAdorno({
      commit,
      state
    }) {
      let nuevo = state.nuevoAdorno;
      nuevo.unidadConversion = nuevo.unidad.conversiones[0];
      let res = await axios.post(`${url}`, nuevo, {
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
      let del =state.nuevoAdorno;
      await axios.delete(`${url}${del._id}`, {
        params: {
          "rev": del._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAdornos', response.data.docs);
      await actualizarEnEstilo(del,true);
    }
  },
  getters: {
    adornos: state => state.adornos,
    unidades: state => state.unidades,

    nuevoAdorno: state => state.nuevoAdorno
  }
}