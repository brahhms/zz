import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Pedidos from '../views/Pedidos.vue'
import NuevoPedido from '../views/NuevoPedido.vue'
import Forro from '../views/mantenimiento/Forro.vue'
import Material from '../views/mantenimiento/Material.vue'
import Suela from '../views/mantenimiento/Suela.vue'
import Estilo from '../views/mantenimiento/Estilo.vue'
import Cliente from '../views/mantenimiento/Cliente.vue'
import Horma from "../views/mantenimiento/Horma.vue";
import Adorno from "../views/mantenimiento/Adorno.vue";
import Avillo from "../views/mantenimiento/Avillo.vue";
import Talla from "../views/mantenimiento/Talla.vue";

import VistaPrevia from '../components/VistaPrevia.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: Pedidos
  },
  {
    path: '/nuevoPedido',
    name: 'NuevoPedido',
    component: NuevoPedido
  },
  {
    path: '/Forro',
    name: 'Forro',
    component: Forro
  },
  {
    path: '/Material',
    name: 'Material',
    component: Material
  },
  {
    path: '/Suela',
    name: 'Suela',
    component: Suela
  },
  {
    path: '/Estilo',
    name: 'Estilo',
    component: Estilo
  },
  {
    path: '/Cliente',
    name: 'Cliente',
    component: Cliente
  },
  {
    path: '/Adorno',
    name: 'Adorno',
    component: Adorno
  },
  {
    path: '/Avillo',
    name: 'Avillo',
    component: Avillo
  },
  {
    path: '/Horma',
    name: 'Horma',
    component: Horma
  },
  {
    path: '/Talla',
    name: 'Talla',
    component: Talla
  },
  {
    path: '/vistaPrevia',
    name: 'VistaPrevia',
    component: VistaPrevia
  }

]

const router = new VueRouter({
  routes
})

export default router
