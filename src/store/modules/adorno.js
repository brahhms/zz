import { axios_client } from "../../plugins/axios.js";
const uri = "zapp-adornos/";

/*
async function actualizarEnEstilo(adorno, del) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "items": {
        "$elemMatch": {
          "_id": adorno._id
        }
      }
    }
    , "limit": 500
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    let index = estilo.items.findIndex(x => x._id == adorno._id);
    if (index != undefined && index != null) {
      estilo.items[index].nombre = adorno.nombre;
      estilo.items[index].colorSegunMaterial = adorno.colorSegunMaterial;
      if (estilo.items[index].unidad.nombre != adorno.unidad.nombre) {
        estilo.items[index].unidad = adorno.unidad;
        estilo.items[index].unidadConversion = adorno.unidadConversion;
        estilo.items[index].cantidadInicial = 0;
        estilo.items[index].cantidad = 0;
      }
      if (del) {
        estilo.items.splice(index, 1);
      }
    }

  });

  const res = await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, {
    "docs": estilos
  }, credentials.authentication);


  return res;
}
*/
const defaultModel = {
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
        constante: Number(1),
      },
    ],
  },
  unidadConversion: {
    nombre: "pares",
    constante: Number(1),
  },
};

export default {
  namespaced: true,
  state: {
    model: { ...defaultModel },
    items: [],
    unidades: [
      {
        nombre: "pares",
        conversiones: [
          {
            nombre: "pares",
            constante: Number(1),
          },
        ],
      },
      {
        nombre: "yardas",
        conversiones: [
          {
            nombre: "yardas",
            constante: Number(1),
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 91.44),
          },
          {
            nombre: "pulgadas",
            constante: Number(1 / 36),
          },
        ],
      },

      {
        nombre: "metros",
        conversiones: [
          {
            nombre: "yardas",
            constante: Number(1 / 1.094),
          },
          {
            nombre: "centimetros",
            constante: Number(1 / 100),
          },
          {
            nombre: "pulgadas",
            constante: Number(1 / 39.37),
          },
        ],
      },
    ],
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },

    setModel(state, model) {
      state.model = model;
    },

    resetModel(state) {
      state.model = { ...defaultModel };
    },
  },
  actions: {
    async findAll({ commit }) {
      const res = await axios_client(`${uri}_find`);
      if (res.statusText === "OK") commit("setItems", res.data.docs);
    },

    async updateOne({ dispatch, state }) {
      let update = state.model;
      update.unidadConversion = update.unidad.conversiones[0];
      const res = await axios_client.put(`${uri}${update._id}/`, update);

      if (res.data.ok) await dispatch("findAll");
      //await actualizarEnEstilo(update, false);
    },

    async save({ dispatch, state }) {
      let nuevo = state.model;
      nuevo.unidadConversion = nuevo.unidad.conversiones[0];
      const res = await axios_client.post(`${uri}`, nuevo);
      if (res.data.ok) await dispatch("findAll");
    },

    async deleteOne({ state, dispatch }) {
      let del = state.model;
      const res = await axios_client.delete(`${uri}${del._id}`, {
        params: {
          rev: del._rev,
        },
      });

      if (res.data.ok) await dispatch("findAll");
      //await actualizarEnEstilo(del, true);
    },
  },
  getters: {
    adornos: (state) => state.items,
    unidades: (state) => state.unidades,
    adorno: (state) => state.model,
    isValid: (state) => {
      if (
        state.model.nombre != null &&
        state.model.nombre != "" &&
        state.model.nombre != " " &&
        state.model.unidad != null
      ) {
        return true;
      }
      return false;
    },
  },
};
