export default {
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
