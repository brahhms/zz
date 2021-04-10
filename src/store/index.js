import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import pedidoStore from './modules/pedido'
import clienteStore from './modules/cliente'
import estiloStore from './modules/estilo'
import materialStore from './modules/material'
import tallaStore from './modules/talla'
import forroStore from './modules/forro'
import suelaStore from './modules/suela'
import hormaStore from './modules/horma'
import adornoStore from './modules/adorno'
import avilloStore from './modules/avillo'


import credentials from "./modules/credentials";

Vue.use(Vuex)
axios.defaults.baseURL = "http://localhost:5984"

export default new Vuex.Store({
  state: {
    pedidos: null,
    showBar: true,
    snackbar: {
      show: false,
      timeout: 2000,
      snackbar: false,
      msj: "",
    }
  },
  mutations: {
    ocultarBarra(state) {
      state.showBar = false;
    }
  },
  actions: {

    async auth(){
      const res = await axios.post(`http://localhost:5984/_session`, {
        "name":"admin",
        "password":"admin"
      }, credentials.authentication);
      
      res.ok
    
    }
    

  },
  modules: {
    cliente: clienteStore,
    pedido: pedidoStore,
    estilo: estiloStore,
    material: materialStore,
    talla: tallaStore,
    forro: forroStore,
    suela: suelaStore,
    horma: hormaStore,
    adorno: adornoStore,
    avillo: avilloStore
  }
})