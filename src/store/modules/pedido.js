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


async function findSemanaByWeek(pedido,semana) {
  return await axios.post(`http://localhost:5984/zapp-semanas/_find`, {
    "selector": {
      "semana": pedido.semana,
      "ano": pedido.ano,
      "color":semana.color
    }
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
        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity" && avillo.cantidad!= undefined) {

          let existe = false;
          lista.avillos.forEach((avilloEnLista) => {
            if (avilloEnLista.nombre == avillo.nombre || 
              (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre+" "+detalle.detalleMaterial.material.nombre+" "+detalle.detalleMaterial.color) ||
              (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre+" "+detalle.detalleSuela.color)
              ) {
              avilloEnLista.colorSegunMaterial = avillo.colorSegunMaterial;
              avilloEnLista.colorSegunSuela = avilloEnLista.colorSegunSuela;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(3));
             
              existe = true;
            }

          });

          if (!existe) {
           
            let nuevoAvillo = Object.assign({}, avillo);
            nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
            nuevoAvillo.cantidad = Number(nuevoAvillo.cantidad.toFixed(3));

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


      

      detalle.estilo.linea.plantilla.avillos.forEach(avillo => {
        let existePlantilla = false;
        
        if (avillo.cantidad > 0 && avillo.cantidad != null && avillo.cantidad != "Infinity") {
         
          lista.avillos.forEach(avilloEnLista => {
            if (avilloEnLista.nombre == avillo.nombre || (avilloEnLista._id == avillo._id && avilloEnLista.nombre == avillo.nombre+" "+detalle.detalleMaterial.material.nombre+" "+detalle.detalleMaterial.color)) {
            
              avilloEnLista.colorSegunMaterial = avillo.colorSegunMaterial;
              avilloEnLista.colorSegunSuela = avillo.colorSegunSuela;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad) + Number(avillo.cantidad) * detalle.subtotal;
              avilloEnLista.cantidad = Number(avilloEnLista.cantidad.toFixed(3));
              existePlantilla = true;
            }
          });
          


          if (!existePlantilla) {
            let nuevoAvillo = Object.assign({}, avillo);
            nuevoAvillo.cantidad = nuevoAvillo.cantidad * detalle.subtotal;
            nuevoAvillo.cantidad = Number(nuevoAvillo.cantidad.toFixed(3));

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


async function createSemana(pedido,color) {
  let nuevaSemana = {
    "semana": pedido.semana,
    "color":color,
    "siguienteSemana": pedido.siguienteSemana,
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
    clearStates(state) {
      state.isEditing = false;
      state.isMoving = false;
      state.pedido.ano = state.semanaSeleccionada.ano;
      state.pedido.fecha = state.semanaSeleccionada.fecha;
      state.pedido.semana = state.semanaSeleccionada.semana;
      state.pedido.siguienteSemana = state.semanaSeleccionada.siguienteSemana;
    },
    setPedido(state, pedido) {
      state.pedido = pedido;
    },
    setRevSemana(state, rev) {
      state.semanaSeleccionada._rev = rev;
    },
    actualizarPedidos(state, pedidos) {
      //borrame?
      state.semanaSeleccionada.pedidos = pedidos;
      console.log("actualizando");
    },
    setAnoPedido(state, year) {
      state.pedido.ano = year;
    },
    setSemanaPedido(state, semana) {
      state.pedido.semana = semana;
    },
    setCliente(state, cliente) {
      state.pedido.cliente = cliente;
      if (cliente != null) {
        console.log("cliente seleccionado en pedido:" + state.pedido.cliente.nombre);
      } else {
        console.log("no ha seleccionado ningun cliente");
      }

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
        // a must be equal to b
        return 0;
      });
      state.forros = data[3].data.docs;
      state.suelas = data[4].data.docs;
      state.clientes = data[5].data.docs;
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

      let index = state.pedido.detalle.indexOf(detalle);
      state.pedido.detalle.splice(index, 0, detalle);
      return item
    }

  },
  actions: {

    async getSemana({
      commit,
      state
    },color) {
      console.log(color);
      const res = await axios.post(`${urlSemana}_find`, {
        "selector": {
          "semana": state.pedido.semana,
          "ano": state.pedido.ano,
          "color":color
        }
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
            color:color
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

      const resSemana = await findSemanaByWeek(state.pedido,state.semanaSeleccionada);
      let semana = resSemana.data.docs[0];
      let res;

      if (semana == undefined || semana == null) {
        res = await createSemana(state.pedido,state.semanaSeleccionada.color);
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
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-materiales/_find', {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-tallas/_find', {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-forros/_find', {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-suelas/_find', {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-clientes/_find', {
          "selector": {}
        }, credentials.authentication),
        axios.post('http://localhost:5984/zapp-hormas/_find', {
          "selector": {}
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
      pedido.semana = state.pedido.semana;
      pedido.ano = state.pedido.ano;

      let fecha = new Date(state.pedido.fecha);
      fecha.setDate(fecha.getDate() + 7);
      pedido.fecha = fecha + "";
      fecha.setDate(fecha.getDate() + 7);
      pedido.siguienteSemana = fecha.getWeekNumber();


      const resSemana = await findSemanaByWeek(pedido,semana);
      let nuevaSemana = resSemana.data.docs[0];
      let res;

      if (nuevaSemana == undefined || nuevaSemana == null) {
        res = await createSemana(state.pedido,state.semanaSeleccionada.color);
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
        }
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
      ano: null,
      color:"gray"
    },


  }

}



