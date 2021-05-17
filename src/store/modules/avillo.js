import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-avillos/";

//recalcula lista de compras y devuelve la misma semana
function generateSemana(semana) {

  let lista = {
    adornos: [],
    avillos: [],
    suelas: [],
    tacones: [],
    estilos: [],
    materiales: [],
    forros: []
  };

  semana.pedidos.forEach(pedido => {
    pedido.total = 0;
    pedido.detalle.forEach((detalle) => {
      detalle.estilo.adornos.forEach((adorno) => {
        if (adorno.cantidad > 0) {

          let existe = false;
          lista.adornos.forEach((adornoEnLista) => {
            if (adornoEnLista.nombre == adorno.nombre || (adornoEnLista._id == adorno._id && adornoEnLista.nombre.includes(detalle.detalleMaterial.color) && adornoEnLista.nombre.includes(detalle.detalleMaterial.material.nombre))) {
              adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + (Number(adorno.cantidad) * Number(detalle.subtotal));
              adornoEnLista.cantidad = Number(adornoEnLista.cantidad.toFixed(3));
              existe = true;
              //xcepcion2
              if (adornoEnLista.nombre.includes("punteras")) {
                detalle.detalleTallas.filter(x => x.cantidad > 0).forEach(t => {
                  let h = t.talla.nombre;
                  if (h == '3') {
                    adornoEnLista.punteras[0].cantidad += t.cantidad;
                  } else if (h == '4' || h == '5') {
                    adornoEnLista.punteras[1].cantidad += t.cantidad;
                  } else if (h == '6' || h == '7') {
                    adornoEnLista.punteras[2].cantidad += t.cantidad;
                  } else {
                    adornoEnLista.punteras[3].cantidad += t.cantidad;
                  }
                });
                let total = 0;
                let resumen = adornoEnLista.punteras.map(m => {
                  total += m.cantidad;
                  return " " + " " + m.cantidad + "/" + m.categoria;
                }).join();

                adornoEnLista.nombre = adorno.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color + " " + resumen;
              }
            }
          });
          if (!existe) {
            let nuevoAdorno = { ...adorno };

            nuevoAdorno.cantidad = Number(nuevoAdorno.cantidad) * Number(detalle.subtotal);
            nuevoAdorno.cantidad = Number(nuevoAdorno.cantidad.toFixed(3));

            if (adorno.colorSegunMaterial) {
              nuevoAdorno.nombre = adorno.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
              //excepcion1
              if (nuevoAdorno.nombre.includes("punteras")) {
                nuevoAdorno.punteras = [{ cantidad: 0, categoria: "[3]" }, { cantidad: 0, categoria: "[4-5]" }, { cantidad: 0, categoria: "[6-7]" }, { cantidad: 0, categoria: "[8-9]" }];

                detalle.detalleTallas.filter(x => x.cantidad > 0).forEach(t => {
                  let h = t.talla.nombre;
                  if (h == '3') {
                    nuevoAdorno.punteras[0].cantidad += t.cantidad;
                  } else if (h == '4' || h == '5') {
                    nuevoAdorno.punteras[1].cantidad += t.cantidad;
                  } else if (h == '6' || h == '7') {
                    nuevoAdorno.punteras[2].cantidad += t.cantidad;
                  } else {
                    nuevoAdorno.punteras[3].cantidad += t.cantidad;
                  }
                });
                let total = 0;
                let resumen = nuevoAdorno.punteras.map(m => {
                  total += m.cantidad;
                  return " " + " " + m.cantidad + "/" + m.categoria;
                }).join();

                nuevoAdorno.nombre = nuevoAdorno.nombre + "  " + resumen;

              }
            }

            lista.adornos.push(nuevoAdorno);
          }
        }
      });

      detalle.estilo.avillos.forEach((avillo) => {
        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity") {

          let existe = false;
          lista.avillos.forEach((avilloEnLista) => {
            if (avilloEnLista.nombre == avillo.nombre || (avilloEnLista._id == avillo._id && avilloEnLista.nombre.includes(detalle.detalleMaterial.color) && avilloEnLista.nombre.includes(detalle.detalleMaterial.material.nombre))) {
              avilloEnLista.colorSegunMaterial = avillo.colorSegunMaterial;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(3));
              //excep
              if (avillo.nombre.includes("durasno") || avillo.nombre.includes("durazno")) {
                avilloEnLista.colorSegunMaterial = true;
                avilloEnLista.nombre = avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
              }
              existe = true;
            }

          });

          if (!existe) {
            if (avillo.nombre.includes("durasno") || avillo.nombre.includes("durazno")) {
              avillo.colorSegunMaterial = true;
            }
            let nuevoAvillo = Object.assign({}, avillo);
            nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
            nuevoAvillo.cantidad = Number(nuevoAvillo.cantidad.toFixed(3));

            if (avillo.colorSegunMaterial) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
            }
            lista.avillos.push(nuevoAvillo);
          }




        }
      });

      let existeMaterial = false;
      lista.materiales.forEach((materialEnLista) => {

        if (detalle.detalleMaterial.material.nombre == materialEnLista.nombre &&
          detalle.detalleMaterial.color == materialEnLista.color) {
          materialEnLista.cantidad = Number(materialEnLista.cantidad) + Number(detalle.subtotal) * Number(detalle.estilo.rendimientoMaterial);
          materialEnLista.cantidad = Number(materialEnLista.cantidad.toFixed(3));
          existeMaterial = true;
        }

      });

      if (!existeMaterial) {
        let rendimientoMaterial = Number((detalle.subtotal) * Number(detalle.estilo.rendimientoMaterial));
        let nuevoMaterial = {
          _id: detalle.detalleMaterial.material._id + detalle.detalleMaterial.color,
          nombre: detalle.detalleMaterial.material.nombre,
          color: detalle.detalleMaterial.color,
          cantidad: Number(rendimientoMaterial.toFixed(3))
        };

        lista.materiales.push(nuevoMaterial);
      }

      let existeForro = false;
      lista.forros.forEach((forroEnLista) => {

        if (detalle.detalleForro.forro._id == forroEnLista._id &&
          detalle.detalleForro.color == forroEnLista.color) {
          forroEnLista.cantidad = Number(forroEnLista.cantidad) + Number(detalle.subtotal) * Number(detalle.estilo.rendimientoForro);
          forroEnLista.cantidad = Number(forroEnLista.cantidad.toFixed(3));
          existeForro = true;
        }
      });

      if (!existeForro) {
        let rendimientoForro = (detalle.subtotal) * Number(detalle.estilo.rendimientoForro);
        let nuevoForro = {
          _id: detalle.detalleForro.forro._id,
          nombre: "forro " + detalle.detalleForro.forro.nombre,
          color: detalle.detalleForro.color,
          cantidad: Number(rendimientoForro.toFixed(3))
        };

        lista.forros.push(nuevoForro);
      }

      let existeSuela = false;
      lista.suelas.forEach((suelaEnLista) => {

        if (detalle.detalleSuela.suela.nombre == suelaEnLista.nombre &&
          detalle.detalleSuela.color == suelaEnLista.color) {
          suelaEnLista.total = 0;
          detalle.detalleTallas.forEach(t => {
            let e = false;
            suelaEnLista.detalle.forEach(l => {
              if (t.talla.nombre == l.nombre) {
                l.cantidad += t.cantidad;
                suelaEnLista.total += l.cantidad;
                e = true
              }
            });
            if (!e) {
              suelaEnLista.detalle.push({
                nombre: t.talla.nombre,
                cantidad: t.cantidad
              });
              suelaEnLista.total += t.cantidad;
            }
          });
          existeSuela = true;
        }
      });

      if (!existeSuela) {
        let nuevaSuela = {
          _id: detalle.detalleSuela.suela._id + detalle.detalleSuela.color,
          nombre: detalle.detalleSuela.suela.nombre,
          color: detalle.detalleSuela.color,
          detalle: detalle.detalleTallas.filter(s => s.cantidad > 0),
          total: 0
        };

        nuevaSuela.detalle = nuevaSuela.detalle.map(s => {
          nuevaSuela.total += s.cantidad;
          return {
            nombre: s.talla.nombre,
            cantidad: s.cantidad
          }
        });

        lista.suelas.push(nuevaSuela);
      }


      let existePlantilla = false;

      detalle.estilo.linea.plantilla.avillos.forEach(avillo => {
        let avilloEnLista = lista.avillos.find(x => x._id == avillo._id);
        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity") {
          if (avilloEnLista != undefined) {
            avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
            avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(3));
            existePlantilla = true;
          }

          if (!existePlantilla) {
            let nuevoAvillo = Object.assign({}, avillo);
            nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
            nuevoAvillo.cantidad = Number(nuevoAvillo.cantidad.toFixed(3));

            if (avillo.colorSegunMaterial) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
            }

            lista.avillos.push(nuevoAvillo);
          }
        }
        existePlantilla = false;
      });



      lista.estilos.push({
        codigo: detalle.estilo.linea.nombre + detalle.estilo.correlativo,
        rendimientoPorYarda: detalle.estilo.rendimientoPorYarda,
        capeyada: detalle.estilo.capeyada,
      });

      if (detalle.detalleTacon.material != null) {
        detalle.detalleTacon.cantidad = 0.1;
        lista.tacones.push(detalle.detalleTacon);
      }


      pedido.total += detalle.subtotal;

    });

  });

  lista.adornos = lista.adornos.sort((a, b) => {
    if (a.nombre > b.nombre)
      return 1;

    if (a.nombre < b.nombre)
      return -1;

    return 0;
  });
  lista.avillos = lista.avillos.sort((a, b) => {
    if (a.nombre > b.nombre)
      return 1;

    if (a.nombre < b.nombre)
      return -1;

    return 0;
  });
  lista.materiales = lista.materiales.sort((a, b) => {
    if (a.nombre > b.nombre)
      return 1;

    if (a.nombre < b.nombre)
      return -1;

    return 0;
  });

  semana.listaDeCompras = lista;

  return semana
}


async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}


async function actualizarEnEstilo(avillo, del) {
  const response = await axios.post(`http://localhost:5984/zapp-estilos/_find`, {
    "selector": {
      "avillos": {
        "$elemMatch": {
          "$or": [{ "_id": avillo._id },
          { "nombre": avillo.nombre }]
        }
      }
    }
  }, credentials.authentication);

  let estilos = response.data.docs;

  estilos.forEach(estilo => {
    let index = estilo.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);
    if (index != undefined && index != null) {
      estilo.avillos[index].nombre = avillo.nombre;
      estilo.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
      if (estilo.avillos[index].unidad.nombre != avillo.unidad.nombre) {
        estilo.avillos[index].unidad = avillo.unidad;
        estilo.avillos[index].unidadConversion = avillo.unidadConversion;
        estilo.avillos[index].cantidadInicial = 0;
        estilo.avillos[index].cantidad = 0;
      }
      if (del) {
        estilo.avillos.splice(index, 1);
      }
    }

  });

  const res = await axios.post(`http://localhost:5984/zapp-estilos/_bulk_docs`, {
    "docs": estilos
  }, credentials.authentication);


  return res;
}

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

  const res = await axios.post(`http://localhost:5984/zapp-plantillas/_bulk_docs`, {
    "docs": plantillas
  }, credentials.authentication);


  return res;
}

async function actualizarEnLinea(avillo, del) {
  const response = await axios.post(`http://localhost:5984/zapp-lineas/_find`, {
    "selector": {
      "avillos": {
        "$elemMatch": {
          "$or": [{ "_id": avillo._id },
          { "nombre": avillo.nombre }]
        }
      }
    }
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

  const res = await axios.post(`http://localhost:5984/zapp-lineas/_bulk_docs`, {
    "docs": lineas
  }, credentials.authentication);


  return res;
}

async function actualizarEnPedidos(avillo) {
  const response = await axios.post(`http://localhost:5984/zapp-semanas/_find`, {
    "selector": {
      "pedidos": {
        "$elemMatch": {
          "detalle": {
            "$elemMatch": {
              "estilo.avillos": {
                "$elemMatch": {
                  "$or": [{
                    "nombre": avillo.nombre
                  }, {
                    "_id": avillo._id
                  }]
                }

              }
            }
          }
        }
      }
    }
  }, credentials.authentication);

  let semanas = response.data.docs;

  semanas.forEach(semana => {

    semana.pedidos.forEach(pedido => {
      pedido.detalle.forEach(detalle => {
        let index = detalle.estilo.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);


        if (index != undefined && index != null) {
          detalle.estilo.avillos[index].nombre = avillo.nombre;
          detalle.estilo.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
        }

        index = detalle.estilo.linea.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);

        if (index != undefined && index != null) {
          detalle.estilo.linea.avillos[index].nombre = avillo.nombre;
          detalle.estilo.linea.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;
        }

        index = detalle.estilo.linea.plantilla.avillos.findIndex(x => x._id == avillo._id || x.nombre == avillo.nombre);
        if (index != undefined && index != null) {
          if (detalle.estilo.linea.plantilla.avillos[index] != undefined) {
            detalle.estilo.linea.plantilla.avillos[index].nombre = avillo.nombre;
            detalle.estilo.linea.plantilla.avillos[index].colorSegunMaterial = avillo.colorSegunMaterial;

          }
        }

      });
    });

    semana = generateSemana(semana);

  });

  const res = await axios.post(`http://localhost:5984/zapp-semanas/_bulk_docs`, {
    "docs": semanas
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
      colorSegunMaterial: false,
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
        colorSegunMaterial: false,
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
      //excep

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
      await actualizarEnPlantilla(update, false);
      await actualizarEnLinea(update, false);
      await actualizarEnEstilo(update, false);
      await actualizarEnPedidos(update);
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
      let del = state.nuevoAvillo;
      await axios.delete(`${url}${del._id}`, {
        params: {
          "rev": del._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);

      const response = await getAll();
      commit('setAvillos', response.data.docs);
      await actualizarEnPlantilla(del, true);
      await actualizarEnLinea(del, true);
      await actualizarEnEstilo(del, true);
      // await actualizarEnPedidos(del);
    }
  },
  getters: {
    avillos: state => state.avillos,
    unidades: state => state.unidades,

    nuevoAvillo: state => state.nuevoAvillo
  }
}