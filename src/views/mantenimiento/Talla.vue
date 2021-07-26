<template>
  <vista
    :viewName="'Tallas'"
    :title="'talla'"
    :headers="headers"
    :initialize="initialize"
    :items="tallas"
    :saveItem="saveTalla"
    :updateItem="updateTalla"
    :deleteItem="deleteTalla"
    :iniciar="iniciarTalla"
    :setNuevoItem="setNuevaTalla"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nueva.nombre" label="Nombre"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>

<script>
import Vista from "../../components/Vista.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("talla");

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

      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters(["tallas", "nuevaTalla","isValid"]),

    nueva: {
      set(talla) {
        this.setNuevaTalla(talla);
        return talla;
      },
      get() {
        return this.nuevaTalla;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getTallas", "updateTalla", "saveTalla", "deleteTalla"]),
    ...mapMutations(["iniciarTalla", "setNuevaTalla"]),

    async initialize() {
      await this.getTallas();
    },
  },
};
</script>