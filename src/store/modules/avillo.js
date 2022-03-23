import axios from "axios";
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-avillos/";

// async function actualizarEnEstilo(avillo, del) {
//   const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
//     "selector": {
//       "avillos": {
//         "$elemMatch": {
//           "$or": [{ "_id": avillo._id },
//           { "nombre": avillo.nombre }]
//         }
//       }
//     }
//     ,"limit":500
//   }, credentials.authentication);

//   let estilos = response.data.docs;

//   estilos.forEach(estilo => {
//     let index = estilo.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);
//     if (index != undefined && index != null) {
//       estilo.avillos[index].nombre = avillo.nombre;
//       estilo.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
//       if (estilo.avillos[index].unidad.nombre != avillo.unidad.nombre) {
//         estilo.avillos[index].unidad = avillo.unidad;
//         estilo.avillos[index].unidadConversion = avillo.unidadConversion;
//         estilo.avillos[index].cantidadInicial = 0;
//         estilo.avillos[index].cantidad = 0;
//       }
//       if (del) {
//         estilo.avillos.splice(index, 1);
//       }
//     }

//   });

//   const res = await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, {
//     "docs": estilos
//   }, credentials.authentication);

//   return res;
// }
/*
async function actualizarEnPlantilla(avillo, del) {
  const response = await axios.post(`http://localhost:5984/zapp-plantillas/_find`, {
    "selector": {
      "avillos": {
        "$elemMatch": {
          "$or": [{ "_id": avillo._id },
          { "nombre": avillo.nombre }]
        }
      }
    }
    ,"limit":500
  }, credentials.authentication);

  let plantillas = response.data.docs;

  plantillas.forEach(plantilla => {
    let index = plantilla.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);
    if (index != undefined && index != null) {
      plantilla.avillos[index].nombre = avillo.nombre;
      plantilla.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
      if (plantilla.avillos[index].unidad.nombre != avillo.unidad.nombre) {
        plantilla.avillos[index].unidad = avillo.unidad;
        plantilla.avillos[index].unidadConversion = avillo.unidadConversion;
        plantilla.avillos[index].cantidadInicial = 0;
        plantilla.avillos[index].cantidad = 0;
      }
      if (del) {
        plantilla.avillos.splice(index, 1);
      }
    }
  });

  await axios.post(`http://localhost:5984/zapp-plantillas/_bulk_docs`, {
    "docs": plantillas
  }, credentials.authentication);

  const resLineas = await axios.post(`http://localhost:5984/zapp-lineas/_find`, {
    "selector": {
      "plantilla._id": { "$in": plantillas.map(m => { return m._id }) }
    }
    ,"limit":500
  }, credentials.authentication);

  let lineas = resLineas.data.docs;
  lineas.forEach(linea => {
    plantillas.forEach(p => {
      if (linea.plantilla._id == p._id) {
        linea.plantilla = p;

      }
    });
  });

  await axios.post(`http://localhost:5984/zapp-lineas/_bulk_docs`, {
    "docs": lineas
  }, credentials.authentication);

  const resEstilos = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "linea._id": { "$in": lineas.map(m => { return m._id }) }
    },"limit":500
  }, credentials.authentication);

  let estilos = resEstilos.data.docs;
  estilos.forEach(estilo => {
    lineas.forEach(l => {
      if (estilo.linea._id == l._id) {
        estilo.linea = l;
      }
    });
  });

  const res = await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, {
    "docs": estilos
  }, credentials.authentication);


  return res;
}*/

/*

async function actualizarEnLinea(avillo, del) {
  const response = await axios.post(`http://localhost:5984/zapp-lineas/_find`, {
    "selector": {
      "avillos": {
        "$elemMatch": {
          "$or": [{ "_id": avillo._id },
          { "nombre": avillo.nombre }]
        }
      }
    },"limit":500
  }, credentials.authentication);

  let lineas = response.data.docs;

  lineas.forEach(linea => {
    let index = linea.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);
    if (index != undefined && index != null) {
      linea.avillos[index].nombre = avillo.nombre;
      linea.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
      if (linea.avillos[index].unidad.nombre != avillo.unidad.nombre) {
        linea.avillos[index].unidad = avillo.unidad;
        linea.avillos[index].unidadConversion = avillo.unidadConversion;
        linea.avillos[index].cantidadInicial = 0;
        linea.avillos[index].cantidad = 0;
      }
      if (del) {
        linea.avillos.splice(index, 1);
      }
    }

  });

  await axios.post(`http://localhost:5984/zapp-lineas/_bulk_docs`, {
    "docs": lineas
  }, credentials.authentication);

  const resEstilos = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "linea._id": { "$in": lineas.map(m => { return m._id }) }
    },"limit":500
  }, credentials.authentication);

  let estilos = resEstilos.data.docs;
  estilos.forEach(estilo => {
    lineas.forEach(l => {
      if (estilo.linea._id == l._id) {
        estilo.linea = l;
      }
    });
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
  colorSegunMaterial: false,
  colorSegunSuela: false,
  unidadConversion: {
    nombre: "pares en pliego",
    constante: null,
  },
  predeterminado: false,
  paraTacon: false,
};

export default {
  namespaced: true,
  state: {
    model: { ...defaultModel },
    items: [],
    unidades: [
      {
        nombre: "galones",
        conversiones: [
          {
            nombre: "pares en galon",
            constante: null,
          },
        ],
      },
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
        nombre: "pliegos",
        conversiones: [
          {
            nombre: "pares en pliego",
            constante: null,
          },
        ],
      },
      {
        nombre: "yardas",
        conversiones: [
          {
            nombre: "pares en yardas",
            constante: null,
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
            nombre: "pares en metros",
            constante: null,
          },
          {
            nombre: "yardas",
            constante: Number(1 / 1.094),
          },
          {
            nombre: "metros",
            constante: Number(1),
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
      const res = await axios.post(
        `${url}_find`,
        {
          selector: {},
          limit: 500,
        },
        credentials.authentication
      );
      if (res.statusText === "OK") commit("setItems", res.data.docs);
    },

    async updateOne({ dispatch, state }) {
      let update = state.model;
      update.unidadConversion = update.unidad.conversiones[0];
      const res = await axios.put(
        `${url}${update._id}/`,
        update,
        {
          params: {
            rev: update._rev,
          },
          auth: credentials.authentication.auth,
          headers: credentials.authentication.headers,
        },
        credentials.authentication
      );
      if (res.data.ok) await dispatch("findAll");
      //await actualizarEnPlantilla(update, false);
      //await actualizarEnLinea(update, false);
      //await actualizarEnEstilo(update, false);
      //await actualizarEnPedidos(update);
    },

    async save({ dispatch, state }) {
      let nuevo = state.model;
      nuevo.unidadConversion = nuevo.unidad.conversiones[0];
      const res = await axios.post(
        `${url}`,
        nuevo,
        {
          auth: credentials.authentication.auth,
          headers: credentials.authentication.headers,
        },
        credentials.authentication
      );
      if (res.data.ok) await dispatch("findAll");
    },

    async deleteOne({ dispatch, state }) {
      let del = state.model;
      const res = await axios.delete(
        `${url}${del._id}`,
        {
          params: {
            rev: del._rev,
          },
          auth: credentials.authentication.auth,
          headers: credentials.authentication.headers,
        },
        credentials.authentication
      );

      if (res.data.ok) await dispatch("findAll");
      //await actualizarEnPlantilla(del, true);
      //await actualizarEnLinea(del, true);
      //await actualizarEnEstilo(del, true);
      // await actualizarEnPedidos(del);
    },
  },
  getters: {
    avillos: (state) => state.items,
    unidades: (state) => state.unidades,
    avillo: (state) => state.model,
    isValid: (state) => {
      if (
        state.model.nombre != null &&
        state.model.nombre != "" &&
        state.model.nombre != " " &&
        state.model.unidad != null
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
