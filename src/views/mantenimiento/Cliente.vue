<template>
  <vista
    :viewName="'Clientes'"
    title='cliente'
    :headers="headers"
    :initialize="findAll"
    :items="items"
    :saveItem="save"
    :updateItem="updateOne"
    :deleteItem="deleteOne"
    :iniciar="resetModel"
    :setNuevoItem="setModel"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="model.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="model.documento"
            label="Documento"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            v-model="model.codigoPais"
            :items="codigos"
            label="Codigo"
            return-object
            item-text="codigo"
          ></v-autocomplete>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="model.telefono"
            label="Telefono"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="model.direccion"
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
const { mapGetters, mapActions, mapMutations, mapState } = createNamespacedHelpers(
  "cliente"
);

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
    ...mapGetters(["cliente", "codigos", "isValid"]),
    ...mapState(["items"]),
    model: {
      set(value) {
        this.setModel(value);
        return value;
      },
      get() {
        return this.cliente;
      },
    },
  },

  watch: {},

  async created() {
    await this.findAll();
  },

  methods: {
    ...mapActions(["findAll", "updateOne", "save", "deleteOne"]),
    ...mapMutations(["resetModel", "setModel"]),
  },
};
</script>
