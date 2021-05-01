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

async function findSemanaByWeek(item) {
  return await axios.post(`http://localhost:5984/zapp-semanas/_find`, {
    "selector": {
      "semana": item.semana,
      "ano": item.ano
    }
  }, credentials.authentication);
}

async function createPedido(data) {
  return await axios.post(`http://localhost:5984/zapp-semanas/_design/manejadorSemanas/_update/agregarPedido/`, data, {
    "auth": credentials.authentication.auth,
    "headers": credentials.authentication.headers,
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

export default {
  namespaced: true,
  state: {
    pedido: {
      _id: "pedido-" + Math.floor(Math.random() * 999999),
      cliente: null,
      ano: new Date().getFullYear(),
      semana: new Date().getWeekNumber(),
      detalle: [],
      isEditing: false,
      isMoving: false,
      total: 0
    },

    semanaSeleccionada: null,

    //database
    estilos: null,
    materiales: null,
    tallas: null,
    forros: null,
    suelas: null,
    clientes: null,
    hormas: [],

    //var
    isValid: false
  },
  mutations: {

    clearStates(state){
      state.isEditing=false;
      state.isMoving=false;
    },

    calcularTotal(state) {
      let total = 0;
      state.pedido.detalle.forEach(deta => {
        total += deta.subtotal;
      });
      state.pedido.total = total;
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
      state.tallas = data[2].data.docs;
      state.forros = data[3].data.docs;
      state.suelas = data[4].data.docs;
      state.clientes = data[5].data.docs;
      state.hormas = data[6].data.docs;

    },
    clearPedido(state) {

      state.pedido = {
        _id: "pedido-" + Math.floor(Math.random() * 999999),
        cliente: null,
        ano: state.pedido.ano,
        semana: state.pedido.semana,
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

      //detalle.horma=state.hormas.filter(h=>detalle.estilo.linea.tacon == h.paraTacon)[0];


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
    }) {
      const res = await axios.post(`${urlSemana}_find`, {
        "selector": {
          "semana": state.pedido.semana,
          "ano": state.pedido.ano
        }
      }, credentials.authentication);
      if (res.statusText == "OK") {
        if (res.data.docs.length > 0) {
          commit('setSemanaSeleccionada', res.data.docs[0]);
        } else {
          commit('setSemanaSeleccionada', {
            semana: state.pedido.semana,
            ano: state.pedido.ano
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

      const resSemana = await findSemanaByWeek(state.pedido);
      let semana = resSemana.data.docs[0];

      let data = {
        nuevoPedido: state.pedido,
        semana: semana || undefined
      };
      const resAgregarPedido = await createPedido(data);

      console.log(resAgregarPedido);
      if (resSemana.data.docs.length > 0) {
        const res = await updateSemana(semana, resAgregarPedido.data);

        if (res.statusText == "OK") {
          commit('clearPedido');
          commit('addDetalle');
          commit('clearStates');
        }
        return res

      }



      return resSemana;

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
      let semana = state.semanaSeleccionada;
      commit('calcularTotal');


      //aqui deberia recalcular la lista de comprars
      const res = await updateSemana(semana, semana);

      if (res.data.ok) {
        console.log("actualizada");
        commit('clearPedido');
        commit('addDetalle');
        commit('setRevSemana', res.data.rev);
      }
      return res

    },

    async moverPedido({
      state, commit
    }) {
      commit('calcularTotal');
      let semana = state.semanaSeleccionada;

      const res = await updateSemana(semana, semana);


      if (res.statusText == "OK") {
        commit('setRevSemana', res.data.rev);
        let index = semana.pedidos.findIndex(x => x.id == state.pedido.id);
        let pedido = semana.pedidos.splice(index, 1);
        let nuevaSemana = state.semanaSeleccionada;
        nuevaSemana.ano = pedido.ano;
        nuevaSemana.semana = pedido.semana;

        let data = {
          nuevoPedido: pedido,
          semana: nuevaSemana || undefined
        };
        const resAgregarPedido = await createPedido(data);
        const res2 = await updateSemana(semana, resAgregarPedido.data);
        if (res2.statusText == 'OK') {
          commit('clearPedido');
          commit('addDetalle');
          commit('setRevSemana', res.data.rev);
          return res2
        }
      }
      return res

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

    }
  },
  getters: {
    detalles: state => state.pedido.detalle,
    cliente: state => state.pedido.cliente,
    isEditing: state => state.pedido.isEditing,
    isMoving: state => state.pedido.isMoving,
    isEmpty:state=> state.pedido.cliente == null && state.semanaSeleccionada!=null,


    estilos: state => state.estilos,
    materiales: state => state.materiales,
    tallas: state => state.tallas,
    forros: state => state.forros,
    suelas: state => state.suelas,
    clientes: state => state.clientes,
    hormas: state => state.hormas,

    isPedidoValid: state => state.isValid,
    semana: state => state.pedido.semana,
    ano: state => state.pedido.ano,

    semanaSeleccionada: state => state.semanaSeleccionada || {
      semana: null,
      ano: null
    },


  }

}



