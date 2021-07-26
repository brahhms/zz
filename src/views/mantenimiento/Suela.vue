<template>
  <vista
    :viewName="'Suelas'"
    :title="'suela'"
    :headers="headers"
    :initialize="initialize"
    :items="suelas"
    :saveItem="saveSuela"
    :updateItem="updateSuela"
    :deleteItem="deleteSuela"
    :iniciar="iniciarSuela"
    :setNuevoItem="setNuevaSuela"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nueva.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-combobox
            v-model="nueva.colores"
            :items="colores"
            label="Colores"
            multiple
            chips
          ></v-combobox>
        </v-col>

        <v-col cols="12">
          <v-select
            v-if="nueva.colores"
            :items="nueva.colores"
            v-model="nueva.defaultColor"
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
  createNamespacedHelpers("suela");

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
    colores: ["negro", "gun", "crema"],
  }),

  computed: {
    ...mapGetters(["suelas", "nuevaSuela","isValid"]),

    nueva: {
      set(suela) {
        this.setNuevaSuela(suela);
        return suela;
      },
      get() {
        return this.nuevaSuela;
      },
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getSuelas", "updateSuela", "saveSuela", "deleteSuela"]),
    ...mapMutations(["iniciarSuela", "setNuevaSuela"]),

    async initialize() {
      await this.getSuelas();
    },
  },
};
</script>