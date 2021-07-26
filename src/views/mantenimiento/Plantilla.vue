<template>
  <vista
    :viewName="'Plantillas'"
    :title="'plantilla'"
    :headers="headers"
    :initialize="initialize"
    :items="plantillas"
    :saveItem="savePlantilla"
    :updateItem="updatePlantilla"
    :deleteItem="deletePlantilla"
    :iniciar="iniciarPlantilla"
    :setNuevoItem="setNuevaPlantilla"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nueva.nombre" label="Nombre"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col> </v-col>
      </v-row>
    </v-container>
    <conversor :title="'Avillos'" :items="nueva.avillos" :update="iniciarPlantilla">
    </conversor>
  </vista>
</template>


<script>
import Vista from "../../components/Vista.vue";
import Conversor from "../../components/Conversor.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("plantilla");

export default {
  components: {
    Vista,
    Conversor,
  },
  data: () => ({
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters(["plantillas", "nuevaPlantilla", "avillos","isValid"]),

    nueva: {
      set(plantilla) {
        this.setNuevaPlantilla(plantilla);
        return plantilla;
      },
      get() {
        return this.nuevaPlantilla;
      },
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "getPlantillas",
      "updatePlantilla",
      "savePlantilla",
      "deletePlantilla",
      "iniciarPlantilla",
    ]),
    ...mapMutations(["setNuevaPlantilla"]),

    async initialize() {
      await this.getPlantillas();
      await this.iniciarPlantilla();
    },
  },
};
</script>