<template>
  <vista
    :viewName="'Adornos'"
    :title="'adorno'"
    :headers="headers"
    :initialize="initialize"
    :items="adornos"
    :saveItem="saveAdorno"
    :updateItem="updateAdorno"
    :deleteItem="deleteAdorno"
    :iniciar="iniciarAdorno"
    :setNuevoItem="setNuevoAdorno"
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
        <v-col>
          <v-checkbox
            label="Color segun Material?"
            v-model="nuevo.colorSegunMaterial"
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
  createNamespacedHelpers("adorno");

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
        text: "Color segun Material",
        align: "start",
        sortable: false,
        value: "colorSegunMaterial",
      },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters(["adornos", "nuevoAdorno", "unidades","isValid"]),

    nuevo: {
      set(adorno) {
        this.setNuevoAdorno(adorno);
        return adorno;
      },
      get() {
        return this.nuevoAdorno;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getAdornos", "updateAdorno", "saveAdorno", "deleteAdorno"]),
    ...mapMutations(["setNuevoAdorno", "iniciarAdorno"]),

    async initialize() {
      await this.getAdornos();
    },
  },
};
</script>