<template>
  <vista
    :viewName="'Materiales'"
    :title="'material'"
    :headers="headers"
    :initialize="initialize"
    :items="materiales"
    :saveItem="saveMaterial"
    :updateItem="updateMaterial"
    :deleteItem="deleteMaterial"
    :iniciar="iniciarMaterial"
    :setNuevoItem="setNuevoMaterial"
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
  createNamespacedHelpers("material");

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
    colores: [
      "negro",
      "gena",
      "corinto",
      "rosa vieja",
      "azul",
      "rojo",
      "beige",
      "mostaza",
      "uva",
      "naranja",
      "rosado",
    ],
  }),

  computed: {
    ...mapGetters(["materiales", "nuevoMaterial","isValid"]),
    nuevo: {
      set(material) {
        this.setNuevoMaterial(material);
        return material;
      },
      get() {
        return this.nuevoMaterial;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "getMateriales",
      "updateMaterial",
      "saveMaterial",
      "deleteMaterial",
    ]),
    ...mapMutations(["iniciarMaterial", "setNuevoMaterial"]),

    async initialize() {
      await this.getMateriales();
    },
  },
};
</script>