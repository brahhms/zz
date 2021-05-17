import axios from 'axios'
import credentials from "./credentials.js";

const url = "http://localhost:5984/zapp-estilos/";

async function getAll() {
  const response = await axios.post(`${url}_find`, {
    "selector": {}
  }, credentials.authentication);
  return response;
}

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


async function createAttachment(att, id, rev) {
  await axios.put(`${url}${id}/img?rev=${rev}`, att, {
    "auth": credentials.authentication.auth,
    "headers": {
      "Content-Type": att.type
    }
  }, credentials.authentication);
}

async function actualizarEnPedidos(estilo) {
  const response = await axios.post(`http://localhost:5984/zapp-semanas/_find`, {
    "selector": {
      "pedidos": {
        "$elemMatch": {
          "detalle": {
            "$elemMatch": {
              "estilo._id": estilo._id
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

        if (detalle.estilo._id == estilo._id) {
          detalle.estilo = { ...estilo };
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


async function iniciarEstilo() {
  const data = await axios.all([
    axios.post(`http://localhost:5984/zapp-lineas/_find`, {
      "selector": {}
    }, credentials.authentication),
    axios.post('http://localhost:5984/zapp-adornos/_find', {
      "selector": {}
    }, credentials.authentication),
  ]);
  return data
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
        "selector": {}
      }, credentials.authentication);
      commit('setEstilos', res.data.docs);
    },

    async updateEstilo({
      commit,
      state
    }) {
      commit('setCorrelativo', state.nuevoEstilo.correlativo);
      let rendimientoForro = 1 / Number(state.nuevoEstilo.rendimientoForro);
      let rendimientoMaterial = 1 / Number(state.nuevoEstilo.rendimientoMaterial);
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      state.nuevoEstilo.adornos = state.nuevoEstilo.adornos.filter(a => a.cantidad > 0);
      state.nuevoEstilo.avillos = state.nuevoEstilo.avillos.filter(a => a.cantidad > 0);

      let att = state.nuevoEstilo.img;
      state.nuevoEstilo.img = undefined;
      const res = await axios.put(`${url}${state.nuevoEstilo._id}/`, state.nuevoEstilo, {
        params: {
          "rev": state.nuevoEstilo._rev
        },
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers,
      }, credentials.authentication);



      if (res.data.ok && att != null && att != undefined) {
        console.log("createAtt");
        await createAttachment(att, res.data.id, res.data.rev);
      }

      const response = await getAll();
      commit('setEstilos', response.data.docs);
      await actualizarEnPedidos(state.nuevoEstilo);
    },

    async saveEstilo({
      commit,
      state
    }) {
      commit('setCorrelativo', state.nuevoEstilo.correlativo);
      let rendimientoForro = 1 / Number(state.nuevoEstilo.rendimientoForro);
      let rendimientoMaterial = 1 / Number(state.nuevoEstilo.rendimientoMaterial);
      state.nuevoEstilo.rendimientoForro = rendimientoForro.toFixed(4);
      state.nuevoEstilo.rendimientoMaterial = rendimientoMaterial.toFixed(4);
      const res = await axios.post(`${url}`, state.nuevoEstilo, {
        "auth": credentials.authentication.auth,
        "headers": credentials.authentication.headers
      }, credentials.authentication);

      let att = state.nuevoEstilo._attachments;
      if (res.data.ok && att != null && att != undefined) {
        await createAttachment(att, res.data.id, res.data.rev);
      }


      const response = await getAll();
      commit('setEstilos', response.data.docs);
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

      let condiciones = [
        {
          "nombre": {
            "$in":
              state.nuevoEstilo.linea.avillos.map(x => { return x.nombre }),
          }
        },
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
        }
      }, credentials.authentication);

      const res2 = await axios.post('http://localhost:5984/zapp-avillos/_find', {
        "selector": {
          "nombre": {
            "$in": state.nuevoEstilo.avillos.map(x => { return x.nombre })
          }
        }
      }, credentials.authentication);



      if (res2.statusText == 'OK') {

        res2.data.docs.forEach(item => {

          state.nuevoEstilo.avillos.forEach(a => {

            if (a.nombre == item.nombre) {
              a.predeterminado = item.predeterminado;
              a.paraTacon = item.paraTacon;
              a.colorSegunMaterial = item.colorSegunMaterial;
              if (item.unidad.nombre != a.unidad.nombre || item.unidadConversion.nombre != a.unidadConversion.nombre) {
                console.log(a.unidad.nombre);
                console.log(a.unidadConversion);
                a.cantidad = 0;
                a.cantidadInicial = 0;
                a.unidad = item.unidad;
                a.unidadConversion = item.unidadConversion;
              }
            }

          });

        });

        commit('setAvillosDeLinea', res.data.docs);
      }

    },

    async actualizarAdornos({
      commit, state
    }) {
      const res = await axios.post('http://localhost:5984/zapp-adornos/_find', {
        "selector": {
          "nombre": {
            "$nor": state.nuevoEstilo.adornos.map(x => { return x.nombre })
          }
        }
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
