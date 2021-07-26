<template>
  <vista
    :viewName="'Clientes'"
    :title="'cliente'"
    :headers="headers"
    :initialize="initialize"
    :items="clientes"
    :saveItem="saveCliente"
    :updateItem="updateCliente"
    :deleteItem="deleteCliente"
    :iniciar="iniciarCliente"
    :setNuevoItem="setNuevoCliente"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nuevo.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="nuevo.documento"
            label="Documento"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="nuevo.codigoPais"
            :items="codigos"
            label="Codigo"
            return-object
            item-text="codigo"
          ></v-autocomplete>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="nuevo.telefono"
            label="Telefono"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="nuevo.direccion"
            label="Direccion"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>


<script>
import Vista from "../../components/Vista.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("cliente");

export default {
  components: {
    Vista,
  },
  data: () => ({
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "nombre",
      },
      {
        text: "Documento",
        align: "start",
        sortable: false,
        value: "documento",
      },
      {
        text: "Telefono",
        align: "start",
        sortable: false,
        value: "telefono",
      },
      {
        text: "Direccion",
        align: "start",
        sortable: false,
        value: "direccion",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],

  }),

  computed: {
    ...mapGetters(["clientes", "nuevoCliente", "codigos","isValid"]),
    nuevo: {
      set(cliente) {
        this.setNuevoCliente(cliente);
        return cliente;
      },
      get() {
        return this.nuevoCliente;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "getClientes",
      "updateCliente",
      "saveCliente",
      "deleteCliente",
    ]),
    ...mapMutations(["iniciarCliente", "setNuevoCliente"]),

    async initialize() {
      await this.getClientes();
    },
  },
};
</script>