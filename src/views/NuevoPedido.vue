<template>
  <div class="nuevoPedido">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" >
          Agregar Cliente
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2" >
          Agregar Detalle de Pedido
        </v-stepper-step>

        <v-divider></v-divider>

      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12 paso-contenido" flat :loading="loading1">
            <detalle-cliente v-if="clientes != null"></detalle-cliente>
          </v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="clienteSeleccionado == null"
              depressed
              x-large
              @click="e1 = 2"
            >
              Continuar
            </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12" color="grey lighten-1">
            <div v-if="clienteSeleccionado != null">
              <v-app-bar flat color="white">
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn>
                <v-toolbar-title>{{
                  clienteSeleccionado.nombre
                }}</v-toolbar-title>
                <v-spacer></v-spacer>
                
                Semana {{semana}}
                <v-spacer></v-spacer>
                <v-btn icon @click="addDetalle()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-app-bar>
              <v-form ref="form" lazy-validation>
                <v-data-table
                  :headers="headers"
                  :items="detalles"
                  hide-default-footer
                >
                  <template v-slot:item="{ item }">
                    <detalle-pedido
                      :detalle="item"
                      :estilos="estilos"
                      :materiales="materiales"
                      :tallas="tallas"
                      :forros="forros"
                      :suelas="suelas"
                      :hormas="hormas"
                    ></detalle-pedido>
                  </template>
                </v-data-table>
              </v-form>
            </div>
          </v-card>
          <v-card-actions>
            <v-btn color="primary" depressed x-large @click="e1--">
              Regresar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              depressed
              x-large
              @click="guardarPedido();"
              :disabled="!isPedidoValid"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-stepper-content>


      </v-stepper-items>
    </v-stepper>

    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
      {{ snackbar.msj }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import DetallePedido from "../components/DetallePedido.vue";
import DetalleCliente from "../components/DetalleCliente.vue";
import { createNamespacedHelpers, mapState } from "vuex";
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers(
  "pedido"
);

export default {
  components: {
    DetallePedido,
    DetalleCliente,
  },
  data() {
    return {
      e1: 1,
      loading1: true,
      headers: [
        {
          text: "Estilo",
          align: "center",
          sortable: false,
          value: "estilo",
         
        },
        {
          text: "Material",
          align: "center",
          sortable: false,
          value: "material",
        },
        {
          text: "MaterialTacon",
          align: "center",
          sortable: false,
          value: "materialTacon",
        },
        {
          text: "Tallas",
          align: "center",
          sortable: false,
          value: "tallas",
        },
        {
          text: "Horma",
          align: "center",
          sortable: false,
          value: "horma",
         
        },
        {
          text: "Forro",
          align: "center",
          sortable: false,
          value: "forro",
        },
        {
          text: "Suela",
          align: "center",
          sortable: false,
          value: "suela",
        },
        {
          text: "Subtotal",
          align: "center",
          sortable: false,
          value: "subtotal",
          width: 2,
        },
        {
          text: "Acciones",
          align: "center",
          sortable: false,
          value: "actions",
          width: 3,
        },
      ],
     
    };
  },
  methods: {
    ...mapActions(["savePedido", "iniciarDetalle"]),
    ...mapMutations(["addDetalle", "validarPedido"]),
    async loadData() {
      await this.iniciarDetalle();
      this.loading1 = false;
    },


    async guardarPedido() {
      this.validarPedido();

      if (!this.isPedidoValid) return;

      const res = await this.savePedido();
      if (res.status == 201 || res.status == 200) {
        this.mostrarMsj("Pedido guardado!");
        this.e1=1;
      }
    },
    mostrarMsj(msj) {
      this.snackbar.msj = msj;
      this.snackbar.show = true;
      
    },
  },

  computed: {
    ...mapState(["snackbar"]),
    ...mapGetters([
      "cliente",
      "detalles",
      "estilos",
      "materiales",
      "tallas",
      "forros",
      "suelas",
      "hormas",
      "clientes",
      "isPedidoValid",
      "semana"
    ]),

    clienteSeleccionado:{
      get(){
        return this.cliente;
      },
      set(newCliente){
        return newCliente;
      }
    }
  },

  mounted() {
    this.loadData();
  },
};
</script>


<style scoped>
.paso-contenido {
  height: 320px;
}

.embed-container {
  left: 12.5%;
  position: relative;
  padding-bottom: 320px;
  height: 0;
  overflow: hidden;
}
.embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 135%;
}

.embed-container iframe {
  -ms-zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.75);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.75);
  -webkit-transform-origin: 0 0;
}
</style>