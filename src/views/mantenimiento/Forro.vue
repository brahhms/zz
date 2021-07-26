<template>
  <vista
    :viewName="'Forros'"
    :title="'forro'"
    :headers="headers"
    :initialize="initialize"
    :items="forros"
    :saveItem="saveForro"
    :updateItem="updateForro"
    :deleteItem="deleteForro"
    :iniciar="iniciarForro"
    :setNuevoItem="setNuevoForro"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nuevo.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="nuevo.colores"
            :items="colores"
            label="Colores"
            multiple
            chips
          ></v-combobox>
        </v-col>

        <v-col cols="12">
          <v-select
            v-if="nuevo.colores"
            :items="nuevo.colores"
            v-model="nuevo.defaultColor"
            label="Color default"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>


<script>
import Vista from "../../components/Vista.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("forro");

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
        text: "Colores",
        align: "start",
        sortable: false,
        value: "colores",
      },
      {
        text: "Default color",
        align: "start",
        sortable: false,
        value: "defaultColor",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    colores: ["negro", "gris", "perla", "beige"],
  }),

  computed: {
    ...mapGetters(["forros", "nuevoForro","isValid"]),
    nuevo: {
      set(forro) {
        this.setNuevoForro(forro);
        return forro;
      },
      get() {
        return this.nuevoForro;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getForros", "updateForro", "saveForro", "deleteForro"]),
    ...mapMutations(["iniciarForro", "setNuevoForro"]),

    async initialize() {
      await this.getForros();
    },
  },
};
</script>