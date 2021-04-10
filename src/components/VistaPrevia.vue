<template>
  <div>
    <lista-pedidos></lista-pedidos>
    <hr />
    <br />
    <v-row v-for="item in txt.listaDeCompras.adornos" :key="item._id"
      ><v-col>{{ item.nombre }}</v-col>
      <v-col>{{ item.cantidad }}</v-col>
    </v-row>
    <br />
    <hr />

    <v-row v-for="item in txt.listaDeCompras.avillos" :key="item._id"
      ><v-col>{{ item.nombre }}</v-col>
      <v-col>{{ item.cantidad }}</v-col>
    </v-row>
  </div>
</template>


<script>
import ListaPedidos from "./ListaPedidos.vue";
//import { mapMutations } from "vuex";
export default {
  components: {
    ListaPedidos,
  },
  data() {
    return {};
  },
  methods: {
    //...mapMutations(["ocultarBarra"]),
    imprimir() {
      window.print();
    },
  },

  computed: {
    txt() {
      return "ssemana";
    },
  },
  created() {
    //this.ocultarBarra();
  },
};
</script>

