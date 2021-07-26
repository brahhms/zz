<template>
  <vista
    :viewName="'Avillos'"
    :title="'avillo'"
    :headers="headers"
    :initialize="initialize"
    :items="avillos"
    :saveItem="saveAvillo"
    :updateItem="updateAvillo"
    :deleteItem="deleteAvillo"
    :iniciar="iniciarAvillo"
    :setNuevoItem="setNuevoAvillo"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nuevo.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="nuevo.unidad"
            :items="unidades"
            label="Unidades"
            item-text="nombre"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            label="Predeterminado"
            v-model="nuevo.predeterminado"
          ></v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            label="Para Tacon?"
            v-model="nuevo.paraTacon"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            label="Color segun Material?"
            v-model="nuevo.colorSegunMaterial"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            label="Color segun Suela?"
            v-model="nuevo.colorSegunSuela"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>


<script>
import Vista from "../../components/Vista.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("avillo");

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
        text: "Unidad de Compra",
        align: "start",
        sortable: false,
        value: "unidad",
      },
      {
        text: "Predeterminado",
        align: "start",
        sortable: false,
        value: "predeterminado",
      },
      {
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "paraTacon",
      },
      {
        text: "Color segun Material",
        align: "start",
        sortable: false,
        value: "colorSegunMaterial",
      },
      {
        text: "Color segun Suela",
        align: "start",
        sortable: false,
        value: "colorSegunSuela",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters(["avillos", "unidades", "nuevoAvillo","isValid"]),
    nuevo: {
      set(avillo) {
        this.setNuevoAvillo(avillo);
        return avillo;
      },
      get() {
        return this.nuevoAvillo;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getAvillos", "updateAvillo", "saveAvillo", "deleteAvillo"]),
    ...mapMutations(["iniciarAvillo", "setNuevoAvillo"]),

    async initialize() {
      await this.getAvillos();
    },
  },
};
</script>