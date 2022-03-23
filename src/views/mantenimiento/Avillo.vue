<template>
  <vista
    viewName="Avillos"
    title="avillo"
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
          <v-autocomplete
            v-model="model.unidad"
            :items="unidades"
            label="Unidades"
            item-text="nombre"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            label="Predeterminado"
            v-model="model.predeterminado"
          ></v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            label="Para Tacon?"
            v-model="model.paraTacon"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            label="Color segun Material?"
            v-model="model.colorSegunMaterial"
          ></v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            label="Color segun Suela?"
            v-model="model.colorSegunSuela"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>

<script>
import Vista from "../../components/Vista.vue";
import { createNamespacedHelpers } from "vuex";
const {
  mapGetters,
  mapActions,
  mapMutations,
  mapState,
} = createNamespacedHelpers("avillo");

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
    ...mapGetters(["unidades", "avillo", "isValid"]),
    ...mapState(["items"]),
    model: {
      set(value) {
        this.setModel(value);
        return value;
      },
      get() {
        return this.avillo;
      },
    },
  },

  async created() {
    await this.findAll();
  },

  methods: {
    ...mapActions(["findAll", "updateOne", "save", "deleteOne"]),
    ...mapMutations(["setModel", "resetModel"]),
  },
};
</script>
