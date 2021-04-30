<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab dark small color="primary" @click="prev">
            <v-icon x-large> mdi-chevron-left </v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-btn fab dark small color="primary darken-1" @click="next">
            <v-icon x-large> mdi-chevron-right </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          show-week
          ref="calendar"
          v-model="focus"
          type="month"
          @change="updateRange"
          :weekdays="weekdays"
          locale="es"
        >
          <template v-slot:day="{ weekday, day, month, year }">
            <v-btn
              @click="openDialog(semanaDelAno(year, month, day), year)"
              v-if="weekday == 1"
              block
              color="primary"
              outlined
              tile
              >Semana {{ semanaDelAno(year, month, day) }}</v-btn
            >
          </template>
        </v-calendar>
      </v-sheet>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card :loading="loading1">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >Semana {{ semanaSeleccionada.semana }}
              {{ semanaSeleccionada.ano }}</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="crearPedido">
                Nuevo Pedido
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-divider></v-divider>
          <v-progress-linear
            v-if="loading1"
            indeterminate
            color="cyan"
          ></v-progress-linear>
          <lista-pedidos v-else></lista-pedidos>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>


<script>
import ListaPedidos from "../components/ListaPedidos";
import { createNamespacedHelpers } from "vuex";

const {
  mapMutations: mapMutationsPedido,
  mapGetters: mapGettersPedido,
  mapActions: mapActionsPedido,
} = createNamespacedHelpers("pedido");
Date.prototype.getWeekNumber = function () {
  var d = new Date(+this); //Creamos un nuevo Date con la fecha de "this".
  d.setHours(0, 0, 0, 0); //Nos aseguramos de limpiar la hora.
  d.setDate(d.getDate() + 0 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
  //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

export default {
  components: {
    ListaPedidos,
  },
  data: () => ({
    dialog: false,
    focus: "",
    type: "month",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    loading1: true,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    ...mapMutationsPedido([
      "setSemanaPedido",
      "setAnoPedido",
      "actualizarPedidos",
      "clearPedido"
    ]),
    ...mapActionsPedido(["getSemana"]),
    updateRange({ start, end }) {
      console.log("//" + start.date + "--" + end.date);
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async openDialog(semana, ano) {
      this.dialog = true;
      this.setSemanaPedido(semana);
      this.setAnoPedido(ano);
      const existeSemana = await this.getSemana();
      if (existeSemana) {
        this.loading1 = false;
      } else {
        this.loading1 = true;
      }
    },

    semanaDelAno(year, mes, dia) {
      mes--;
      //console.log("DelAno: " + year + "-" + mes + "-" + dia);
      let fech = new Date(year, mes, dia);
      //console.log(fech);
      return fech.getWeekNumber();
    },
    crearPedido() {
      this.clearPedido();
      this.$router.push({ name: "NuevoPedido" });
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
  },
};
</script>


<style scoped>
.btn {
  z-index: 300 !important;
}
</style>