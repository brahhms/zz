<template>
  <vista
    :viewName="'Lineas'"
    :title="'linea'"
    :headers="headers"
    :initialize="initialize"
    :items="lineas"
    :saveItem="saveLinea"
    :updateItem="updateLinea"
    :deleteItem="deleteLinea"
    :iniciar="iniciarLinea"
    :setNuevoItem="setNuevaLinea"
    :isValid="isValid"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field v-model="nueva.nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="nueva.plantilla"
            label="Plantilla"
            return-object
            item-text="nombre"
            :items="plantillas"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="nueva.horma"
            label="Horma"
            return-object
            item-text="nombre"
            :items="hormas"
          >
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="nueva.suela"
            label="Suela"
            return-object
            item-text="nombre"
            :items="suelas"
          >
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="nueva.forro"
            label="Forro"
            return-object
            item-text="nombre"
            :items="forros"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-checkbox label="Tacon?" v-model="nueva.tacon"></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <conversor :title="'Avillos'" :items="nueva.avillos" :update="actualizar">
          </conversor>
        </v-col>
      </v-row>
    </v-container>
  </vista>
</template>


<script>
import Vista from "../../components/Vista.vue";
import Conversor from "../../components/Conversor.vue";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("linea");

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
        sortable: true,
        value: "nombre",
      },
      {
        text: "Plantilla",
        align: "start",
        sortable: false,
        value: "plantilla",
      },
      {
        text: "Horma",
        align: "start",
        sortable: false,
        value: "horma",
      },
      {
        text: "Suela",
        align: "start",
        sortable: false,
        value: "suela",
      },
      {
        text: "Forro",
        align: "start",
        sortable: false,
        value: "forro",
      },
      {
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "tacon",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),

  computed: {
    ...mapGetters([
      "plantillas",
      "nuevaLinea",
      "lineas",
      "hormas",
      "suelas",
      "forros",
      "isValid",
    ]),
    nueva: {
      set(linea) {
        this.setNuevaLinea(linea);
        return linea;
      },
      get() {
        return this.nuevaLinea;
      },
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async actualizar() {
      await this.iniciarLinea();
      await this.actualizarAvillos();
    },
    ...mapActions([
      "getLineas",
      "updateLinea",
      "saveLinea",
      "deleteLinea",
      "iniciarLinea",
      "actualizarAvillos",
    ]),
    ...mapMutations(["setNuevaLinea"]),

    async initialize() {
      await this.getLineas();
      this.actualizar();
    },
  },
};
</script>