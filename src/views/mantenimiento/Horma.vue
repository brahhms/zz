<template>
  <vista
    :viewName="'Hormas'"
    :title="'horma'"
    :headers="headers"
    :initialize="initialize"
    :items="hormas"
    :saveItem="saveHorma"
    :updateItem="updateHorma"
    :deleteItem="deleteHorma"
    :iniciar="iniciarHorma"
    :setNuevoItem="setNuevaHorma"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="nueva.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col>
          <v-checkbox
            label="Horma para tacon?"
            v-model="nueva.paraTacon"
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
  createNamespacedHelpers("horma");

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
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "paraTacon",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters(["hormas", "nuevaHorma","isValid"]),

    nueva: {
      set(horma) {
        this.setNuevaHorma(horma);
        return horma;
      },
      get() {
        return this.nuevaHorma;
      },
    },
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions(["getHormas", "updateHorma", "saveHorma", "deleteHorma"]),
    ...mapMutations(["iniciarHorma", "setNuevaHorma"]),

    async initialize() {
      await this.getHormas();
    },
  },
};
</script>