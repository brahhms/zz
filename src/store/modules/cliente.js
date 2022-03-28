import { axios_client } from "../../plugins/axios.js";
const uri = "zapp-items/";

async function getAll() {
  const response = await axios.post(
    `${url}_find`,
    {
      selector: {},
      limit: 500,
    },
    credentials.authentication
  );
  return response;
}

const defaultModel = {
  _id: undefined,
  _rev: undefined,
  nombre: null,
  codigoPais: null,
  telefono: null,
  direccion: null,
  documento: null,
};

export default {
  namespaced: true,
  state: {
    model: { ...defaultModel },
    items: [],
    codigos: [
      {
        codigo: "+501",
        pais: "Belice",
      },
      {
        codigo: "+502",
        pais: "Guatemala",
      },
      {
        codigo: "+503",
        pais: "El Salvador",
      },
      {
        codigo: "+504",
        pais: "Honduras",
      },
      {
        codigo: "+505",
        pais: "Nicaragua",
      },
      {
        codigo: "+506",
        pais: "Costa Rica",
      },
      {
        codigo: "+507",
        pais: "Panama",
      },
    ],
  },
  mutations: {
    setItems(state, data) {
      state.items = data;
    },

    setModel(state, val) {
      state.model = val;
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
    },

    async save({ dispatch, state }) {
      let nuevo = state.model;
      const res = await axios_client.post(`${uri}`, nuevo);
      if (res.data.ok) await dispatch("findAll");
    },

    async deleteOne({ dispatch, state }) {
      let del = state.model;
      const res = await axios_client.delete(`${uri}${del._id}`, {
        params: {
          rev: del._rev,
        },
      });

      if (res.data.ok) await dispatch("findAll");
    },
  },
  getters: {
    clientes: (state) => state.items,
    codigos: (state) => state.codigos,

    cliente: (state) => state.model,
    isValid: (state) => {
      if (
        state.model.nombre != null &&
        state.model.nombre != "" &&
        state.model.nombre != " "
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
