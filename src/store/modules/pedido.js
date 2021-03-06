import axios from 'axios'

import credentials from "./credentials.js";

Date.prototype.getWeekNumber = function () {
  var d = new Date(+this); //Creamos un nuevo Date con la fecha de "this".
  d.setHours(0, 0, 0, 0); //Nos aseguramos de limpiar la hora.
  d.setDate(d.getDate() + 0 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
  //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

const urlSemana = "http://localhost:5984/zapp-semanas/";


async function findSemanaByWeek(pedido, semana) {
  return await axios.post(`http://localhost:5984/zapp-semanas/_find`, {
    "selector": {
      "semana": pedido.semana,
      "ano": pedido.ano,
      "color": semana.color
    }, "limit": 500
  }, credentials.authentication);
}

async function updateSemana(oldVal, newVal) {

  return await axios.put(`http://localhost:5984/zapp-semanas/${oldVal._id}/`, newVal, {
    params: {
      "rev": oldVal._rev
    },
    "auth": credentials.authentication.auth,
    "headers": credentials.authentication.headers,
  }, credentials.authentication);
}

//recalcula lista de compras y devuelve la misma semana
function generateSemana(semana) {

  let lista = {
    adornos: [],
    avillos: [],
    suelas: [],
    materiales: [],
    forros: []
  };

  semana.pedidos.forEach(pedido => {
    pedido.total = 0;
    pedido.detalle.forEach((detalle) => {
      detalle.cloned = false;


      let rendimientoForro = (detalle.subtotal) * Number(detalle.estilo.rendimientoForro);
      let rendimientoMaterial = (detalle.subtotal) * Number(detalle.estilo.rendimientoMaterial);
      let enLista;
      let nuevo = {
        forro: {
          _id: detalle.detalleForro.forro._id,
          nombre: "forro " + detalle.detalleForro.forro.nombre,
          color: detalle.detalleForro.color,
          cantidad: Number(rendimientoForro.toFixed(5))
        },
        material: {
          _id: detalle.detalleMaterial.material._id + detalle.detalleMaterial.color,
          nombre: detalle.detalleMaterial.material.nombre,
          color: detalle.detalleMaterial.color,
          cantidad: Number(rendimientoMaterial.toFixed(5))
        },
        suela: {
          _id: detalle.detalleSuela.suela._id + detalle.detalleSuela.color,
          nombre: detalle.detalleSuela.suela.nombre,
          color: detalle.detalleSuela.color,
          detalle: detalle.detalleTallas.filter(s => s.cantidad > 0),
          total: 0
        }
      };
      nuevo.suela.detalle = nuevo.suela.detalle.map(s => {
        nuevo.suela.total += s.cantidad;
        return {
          nombre: s.talla.nombre,
          cantidad: s.cantidad
        }
      });

      enLista = lista.suelas.find(sue => sue.nombre === nuevo.suela.nombre && nuevo.suela.color === sue.color);
      if (enLista) {

        enLista.total = 0;
        detalle.detalleTallas.forEach(t => {

          let tallaEnLista = enLista.detalle.find(l => l.nombre == t.talla.nombre);
          if (tallaEnLista) {
            tallaEnLista.cantidad += t.cantidad;
            enLista.total += tallaEnLista.cantidad;
          } else {
            enLista.detalle.push({
              nombre: t.talla.nombre,
              cantidad: t.cantidad
            });
            enLista.total += t.cantidad;
          }

        });

      } else {
        lista.suelas.push(nuevo.suela);
      }


      enLista = lista.forros.find(forr => forr._id === nuevo.forro._id && nuevo.forro.color === forr.color);
      if (enLista) {
        enLista.cantidad = Number(enLista.cantidad) + rendimientoForro;
        enLista.cantidad = Number(enLista.cantidad.toFixed(5));
      } else {
        lista.forros.push(nuevo.forro);
      }

      enLista = lista.materiales.find(mat => mat._id === nuevo.material._id && nuevo.material.color === mat.color);
      if (enLista) {
        enLista.cantidad = Number(enLista.cantidad) + rendimientoMaterial;
        enLista.cantidad = Number(enLista.cantidad.toFixed(5));
      } else {
        lista.materiales.push(nuevo.material);
      }



      detalle.estilo.adornos.forEach((adorno) => {
        if (adorno.cantidad > 0) {

          let existe = false;
          lista.adornos.forEach((adornoEnLista) => {
            if (adornoEnLista.nombre == adorno.nombre || (adornoEnLista._id == adorno._id && adornoEnLista.nombre.includes(detalle.detalleMaterial.color) && adornoEnLista.nombre.includes(detalle.detalleMaterial.material.nombre))) {
              adornoEnLista.cantidad = Number(adornoEnLista.cantidad) + (Number(adorno.cantidad) * Number(detalle.subtotal));
              adornoEnLista.cantidad = Number(adornoEnLista.cantidad.toFixed(5));
              existe = true;
              //xcepcion2
              if (adornoEnLista.nombre.includes("puntera")) {

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

                let resumen = adornoEnLista.punteras.map(m => {

                  return " " + " " + m.cantidad + "/" + m.categoria;
                }).join();

                adornoEnLista.nombre = adorno.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color + " " + resumen;
              }
            }
          });
          if (!existe) {
            let nuevoAdorno = { ...adorno };

            nuevoAdorno.cantidad = Number(nuevoAdorno.cantidad) * Number(detalle.subtotal);
            nuevoAdorno.cantidad = Number(nuevoAdorno.cantidad.toFixed(5));

            if (adorno.colorSegunMaterial) {
              nuevoAdorno.nombre = adorno.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
              //excepcion1
              if (nuevoAdorno.nombre.includes("puntera")) {
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
                //let total = 0;
                let resumen = nuevoAdorno.punteras.map(m => {
                  //total += m.cantidad;
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
        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity" && avillo.cantidad != undefined) {

          let existe = false;
          lista.avillos.forEach((avilloEnLista) => {
            if (avilloEnLista.nombre == avillo.nombre ||
              (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color) ||
              (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre + " " + detalle.detalleSuela.color)
            ) {
              avilloEnLista.colorSegunMaterial = avillo.colorSegunMaterial;
              avilloEnLista.colorSegunSuela = avilloEnLista.colorSegunSuela;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(5));

              existe = true;
            }

          });

          if (!existe) {

            let nuevoAvillo = {
              _id: avillo._id,
              nombre: avillo.nombre,
              cantidad: Number(avillo.cantidad * detalle.subtotal).toFixed(5),
              unidad: {
                nombre: avillo.unidad.nombre
              }
            };

            if (avillo.colorSegunMaterial) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
            }
            if (avillo.colorSegunSuela) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleSuela.color;
            }

            lista.avillos.push(nuevoAvillo);
          }




        }
      });
      detalle.estilo.linea.plantilla.avillos.forEach(avillo => {
        let existePlantilla = false;

        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity") {

          lista.avillos.forEach(avilloEnLista => {
            if (avilloEnLista.nombre == avillo.nombre || (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color)) {

              avilloEnLista.colorSegunMaterial = avillo.colorSegunMaterial;
              avilloEnLista.colorSegunSuela = avillo.colorSegunSuela;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(5));
              existePlantilla = true;
            }
          });



          if (!existePlantilla) {
            let nuevoAvillo = Object.assign({}, avillo);
            nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
            nuevoAvillo.cantidad = Number(nuevoAvillo.cantidad.toFixed(5));

            if (avillo.colorSegunMaterial) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleMaterial.material.nombre + " " + detalle.detalleMaterial.color;
            }
            if (avillo.colorSegunSuela) {
              nuevoAvillo.nombre = avillo.nombre + " " + detalle.detalleSuela.color;
            }

            lista.avillos.push(nuevoAvillo);

          }
        }
        existePlantilla = false;
      });

      pedido.total += detalle.subtotal;

    });

  });

  lista.suelas.forEach(sue => {
    sue.detalle = sue.detalle.sort((a, b) => {
      if (Number(a.nombre) > Number(b.nombre))
        return 1;
      if (Number(a.nombre) < Number(b.nombre))
        return -1;
      return 0;
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

  semana.listaDeCompras = { ...lista };

  return semana
}

async function createSemana(pedido, color) {
  let nuevaSemana = {
    "semana": pedido.semana,
    "color": color,
    "siguienteSemana": pedido.siguienteSemana,
    "anteriorSemana": pedido.anteriorSemana,
    "ano": pedido.ano,
    "fecha": pedido.fecha,
    "pedidos": [pedido],
    "listaDeCompras": null

  };
  nuevaSemana = generateSemana(nuevaSemana);
  return await axios.post(`${urlSemana}`, nuevaSemana, {
    "auth": credentials.authentication.auth,
    "headers": credentials.authentication.headers,
  }, credentials.authentication);
}


export default {
  namespaced: true,
  state: {
    pedido: {
      _id: "pedido-" + Math.floor(Math.random() * 999999),
      cliente: null,
      ano: null,
      fecha: null,
      semana: null,
      siguienteSemana: null,
      anteriorSemana: null,
      detalle: [],
      isEditing: false,
      isMoving: false,
      total: 0
    },


    semanaSeleccionada: null,

    //database
    estilos: [],
    materiales: [],
    tallas: [],
    forros: [],
    suelas: [],
    clientes: [],
    hormas: [],



    //var
    isValid: false
  },
  mutations: {

    setFechaPedido(state, fecha) {
      state.pedido.fecha = fecha;
    },
    setSiguienteSemana(state, semana) {
      state.pedido.siguienteSemana = semana;
    },
    setAnteriorSemana(state, semana) {
      state.pedido.anteriorSemana = semana;
    },
    clearStates(state) {
      state.isEditing = false;
      state.isMoving = false;
      state.pedido.ano = state.semanaSeleccionada.ano;
      state.pedido.fecha = state.semanaSeleccionada.fecha;
      state.pedido.semana = state.semanaSeleccionada.semana;
      state.pedido.siguienteSemana = state.semanaSeleccionada.siguienteSemana;
      state.pedido.anteriorSemana = state.semanaSeleccionada.anteriorSemana;
    },
    setPedido(state, pedido) {
      state.pedido = pedido;
    },
    setRevSemana(state, rev) {
      state.semanaSeleccionada._rev = rev;
    },

    setAnoPedido(state, year) {
      state.pedido.ano = year;
    },
    setSemanaPedido(state, semana) {
      state.pedido.semana = semana;
    },
    setCliente(state, cliente) {
      state.pedido.cliente = cliente;
    },
    pushDetalle(state, detalle) {
      state.pedido.detalle.push(detalle);
    },
    validarPedido(state) {
      state.isValid = false;
      if (state.pedido.cliente == null) {
        console.log("cliente vacio");
      } else if (state.pedido.detalle == null) {
        console.log("detalle vacio");
      } else {

        let errores = 0;
        state.pedido.detalle.forEach(deta => {

          if (deta.estilo == null ||
            deta.detalleMaterial.material == null ||
            deta.detalleForro.forro == null ||
            deta.detalleSuela.suela == null ||
            deta.horma == null ||
            deta.subtotal <= 0
          ) {
            errores++;
            console.log("elemento vacio");
          } else if (deta.estilo != null) {
            if (deta.estilo.linea.tacon) {
              if (deta.detalleTacon.material == null) {
                errores++;
                console.log("material tacon vacio");
              }
            } else {
              deta.detalleTacon.material = null;
              deta.detalleTacon.color = null;
            }
          }

        });

        if (errores == 0) {
          state.isValid = true;
          console.log("pedido valido");
        }

      }

    },
    addDetalle(state) {
      let detalleDefault = {
        estilo: null,
        detalleMaterial: {
          material: null,
          color: null,
        },
        detalleTacon: {
          material: null,
          color: null,
        },
        detalleTallas: null,
        horma: null,
        detalleForro: {
          forro: null,
          color: null,
        },
        detalleSuela: {
          suela: null,
          color: null,
        },
        subtotal: 0,

        clonedFrom: null
      };
      detalleDefault.detalleTallas = state.tallas.map((t) => {
        return {
          talla: t,
          cantidad: 0,
        };
      });
      detalleDefault.estilo = state.estilos[0];
      detalleDefault.detalleMaterial.material = state.materiales[0];
      detalleDefault.detalleTacon.material = state.materiales[0];
      detalleDefault.detalleMaterial.color = state.materiales[0].defaultColor;
      detalleDefault.detalleTacon.color = state.materiales[0].defaultColor;
      detalleDefault.detalleForro.forro = state.forros[0];
      detalleDefault.detalleForro.color = state.forros[0].defaultColor;
      detalleDefault.detalleSuela.suela = state.suelas[0];
      detalleDefault.detalleSuela.color = state.suelas[0].defaultColor;
      detalleDefault.horma = state.hormas.filter(h => state.estilos[0].linea.tacon == h.paraTacon)[0];


      state.pedido.detalle.push(detalleDefault);

    },
    setSemanaSeleccionada(state, semana) {
      state.semanaSeleccionada = semana;
    },
    setData(state, data) {
      state.estilos = data[0].data.docs;
      state.materiales = data[1].data.docs;
      state.tallas = data[2].data.docs.sort(function (a, b) {
        if (Number(a.nombre) > Number(b.nombre)) {
          return 1;
        }
        if (Number(a.nombre) < Number(b.nombre)) {
          return -1;
        }
        return 0;
      });
      state.forros = data[3].data.docs;
      state.suelas = data[4].data.docs;
      state.clientes = data[5].data.docs.map(item => { return { nombre: item.nombre } });
      state.hormas = data[6].data.docs;

    },
    clearPedido(state) {
      console.log("CLEANING");
      state.pedido = {
        _id: "pedido-" + Math.floor(Math.random() * 999999),
        cliente: null,
        ano: state.pedido.ano,
        fecha: state.pedido.fecha,
        semana: state.pedido.semana,
        siguienteSemana: state.pedido.siguienteSemana,
        anteriorSemana: state.pedido.anteriorSemana,
        detalle: [],
        isEditing: false,
        isMoving: false,
        total: 0
      };

    },
    removeDetalle(state, detalle) {
      let index = state.pedido.detalle.indexOf(detalle);
      state.pedido.detalle.splice(index, 1);
    },
    duplicateDetalle(state, item) {
      let detalle = Object.assign({}, item);
      detalle.cloned = true;
      detalle.clonedFrom = { ...item };

      detalle.detalleMaterial = {
        ...item.detalleMaterial
      };
      detalle.detalleTacon = {
        ...item.detalleTacon
      };

      detalle.detalleForro = {
        ...item.detalleForro
      };
      detalle.detalleSuela = {
        ...item.detalleSuela
      };


      detalle.detalleTallas = item.detalleTallas.map(item => {
        return {
          ...item
        }
      });

      let index = state.pedido.detalle.indexOf(item);
      index++;
      state.pedido.detalle.splice(index, 0, detalle);
      return item
    }

  },
  actions: {

    async getSemana({
      commit,
      state
    }, color) {
      console.log(color);
      const res = await axios.post(`${urlSemana}_find`, {
        "selector": {
          "semana": state.pedido.semana,
          "ano": state.pedido.ano,
          "color": color
        }, "limit": 500
      }, credentials.authentication);
      if (res.statusText == "OK") {
        if (res.data.docs.length > 0) {
          console.log("hay");

          commit('setSemanaSeleccionada', res.data.docs[0]);
        } else {
          console.log("no hay");

          commit('setSemanaSeleccionada', {
            semana: state.pedido.semana,
            ano: state.pedido.ano,
            color: color
          });

        }
        return true
      } else {
        return false
      }

    },

    async savePedido({
      commit,
      state
    }) {

      const resSemana = await findSemanaByWeek(state.pedido, state.semanaSeleccionada);
      let semana = resSemana.data.docs[0];
      let res;

      if (semana == undefined || semana == null) {
        res = await createSemana(state.pedido, state.semanaSeleccionada.color);
      } else {
        semana.pedidos.push(state.pedido);
        semana = generateSemana(semana);
        res = await updateSemana(semana, semana);
      }
      if (res.status == 200 || res.status == 201) {
        commit('clearPedido');
        commit('addDetalle');
        commit('clearStates');
      }
      return res;

    },

    async iniciarDetalle({
      commit
    }) {
      const data = await axios.all([
        axios.post(`http://localhost:5984/zapp-estilos/_find`, {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-materiales/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-tallas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-forros/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-suelas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-clientes/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-hormas/_find', {
          "selector": {}, "limit": 500
        }, credentials.authentication)
      ]);

      let valido = true;
      data.forEach(d => {
        if (d.statusText != 'OK') {
          valido = false
        }

      });
      if (valido) {
        commit('setData', data);
        return true
      } else {
        return false
      }

    },

    async actualizarSemana({
      state, commit
    }) {
      let semana = Object.assign({}, state.semanaSeleccionada);
      const semanaGenerada = generateSemana(semana);

      const res = await updateSemana(semana, semanaGenerada);

      if (res.data.ok) {
        console.log("actualizada");
        commit('clearPedido');
        commit('addDetalle');
        commit('setRevSemana', res.data.rev);
      }
      return res

    },

    async actualizarOrden({
      state, commit
    }) {
      let semana = state.semanaSeleccionada;
      const res = await updateSemana(semana, semana);
      if (res.data.ok) {
        commit('setRevSemana', res.data.rev);
      }
      return res
    },

    async moverPedido({
      state, commit
    }) {
      let semana = state.semanaSeleccionada;
      let pedido = Object.assign({}, semana.pedidos.find(x => x._id == state.pedido._id));


      let fecha = new Date(state.pedido.fecha);


      if (state.pedido.moveForward) {
        fecha.setDate(fecha.getDate() + 7);
      } else {
        fecha.setDate(fecha.getDate() - 7);
      }


      pedido.fecha = fecha + "";
      state.pedido.fecha = pedido.fecha;
      pedido.semana = fecha.getWeekNumber();
      state.pedido.semana = fecha.getWeekNumber();
      pedido.ano = fecha.getFullYear();
      state.pedido.ano = fecha.getFullYear();

      fecha.setDate(fecha.getDate() + 7);
      pedido.siguienteSemana = fecha.getWeekNumber();
      state.pedido.siguienteSemana = fecha.getWeekNumber();

      fecha.setDate(fecha.getDate() - 14);
      pedido.anteriorSemana = fecha.getWeekNumber();
      state.pedido.anteriorSemana = fecha.getWeekNumber();



      const resSemana = await findSemanaByWeek(pedido, semana);
      let nuevaSemana = resSemana.data.docs[0];
      let res;

      if (nuevaSemana == undefined || nuevaSemana == null) {
        res = await createSemana(state.pedido, state.semanaSeleccionada.color);
      } else {
        nuevaSemana.pedidos.push(pedido);
        nuevaSemana = generateSemana(nuevaSemana);
        res = await updateSemana(nuevaSemana, nuevaSemana);
      }

      if (res.status == 200 || res.status == 201) {
        let index = semana.pedidos.findIndex(x => x._id == state.pedido._id);
        semana.pedidos.splice(index, 1);
        semana = generateSemana(semana);
        const response = await updateSemana(semana, semana);
        commit('setRevSemana', response.data.rev);
        commit('clearPedido');
        commit('clearStates');
        commit('addDetalle');
        return response
      }
      return res;

    },

    async actualizarHormas({ }, paraTacon) {
      const res = await axios.post('http://localhost:5984/zapp-hormas/_find', {
        "selector": {
          "paraTacon": paraTacon
        }, "limit": 500
      }, credentials.authentication);

      if (res.statusText == 'OK') {
        return res.data.docs;

      } else {
        return []
      }

    },

    async deletePedido({
      state, commit
    }) {
      let semana = state.semanaSeleccionada;


      let index = semana.pedidos.findIndex(x => x._id == state.pedido._id);
      semana.pedidos.splice(index, 1);
      semana = generateSemana(semana);
      const response = await updateSemana(semana, semana);
      commit('setRevSemana', response.data.rev);
      commit('clearPedido');
      commit('clearStates');
      commit('addDetalle');
      return response


    },
  },
  getters: {
    detalles: state => state.pedido.detalle,
    cliente: state => state.pedido.cliente,
    isEditing: state => state.pedido.isEditing,
    isMoving: state => state.pedido.isMoving,
    isEmpty: state => state.pedido.cliente == null || state.semanaSeleccionada == null,


    estilos: state => state.estilos,
    materiales: state => state.materiales,
    tallas: state => state.tallas.sort((a, b) => {
      if (Number(a.nombre) > Number(b.nombre))
        return 1;

      if (Number(a.nombre) < Number(b.nombre))
        return -1;

      return 0;
    }),
    forros: state => state.forros,
    suelas: state => state.suelas,
    clientes: state => state.clientes,
    hormas: state => state.hormas,

    isPedidoValid: state => state.isValid,
    semana: state => state.pedido.semana,
    ano: state => state.pedido.ano,

    semanaSeleccionada: state => state.semanaSeleccionada || {
      semana: null,
      siguienteSemana: null,
      anteriorSemana: null,
      ano: null,
      color: "gray"
    },


  }

}