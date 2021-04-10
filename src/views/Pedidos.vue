<template>
  <v-container>
    <div class="contenedor">
      <div class="columna">
        <div class="pedido" v-for="pedido in pedidos" :key="pedido._id">
          <v-row>
            <v-col style="font-size: 14px; font-weight: bold">
              {{ pedido.cliente.nombre }}
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-col>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <td colspan="9"></td>
                    <td style="font-weight: bold">subtotal</td>
                  </thead>
                  <tbody>
                    <tr
                      class="fila"
                      v-for="(detalle, index) in pedido.detalle"
                      :key="index"
                    >
                      <td>{{ detalle.estilo.codigo }}</td>
                      <td>{{ detalle.detalleMaterial.material.nombre }}</td>
                      <td>{{ detalle.detalleMaterial.color }}</td>
                      <td>
                        <v-row
                          ><v-col
                            cols="1"
                            v-for="detalleTallas in detalle.detalleTallas"
                            :key="detalleTallas.talla._id"
                          >
                            <span
                              >{{ detalleTallas.cantidad }}/{{
                                detalleTallas.talla.nombre
                              }},
                            </span>
                          </v-col></v-row
                        >
                      </td>
                      <td>{{ detalle.horma.nombre }}</td>
                      <td>{{ detalle.detalleForro.forro.nombre }}</td>
                      <td>{{ detalle.detalleForro.color }}</td>
                      <td>{{ detalle.detalleSuela.suela.nombre }}</td>
                      <td>{{ detalle.detalleSuela.color }}</td>
                      <td>
                        {{ detalle.subtotal }}
                      </td>
                    </tr>
                    <tr class="fila">
                      <td colspan="8"></td>
                      <td style="font-weight: bold">total:</td>
                      <td>{{ total(pedido.detalle) }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <br />
        </div>
      </div>
    </div>

    <v-fab-transition>
      <v-btn
        color="primary"
        @click="imprimir()"
        large
        depressed
        dark
        fixed
        bottom
        right
        fab
      >
        <v-icon large>mdi-printer</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>



<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const {
  mapActions: mapActionsPedido,
  mapGetters: mapGettersPedido,
} = createNamespacedHelpers("pedido");
export default {
  data() {
    return {
      items: [],
      headers: [
        {
          text: "",
          align: "center",
          sortable: false,
          value: "codigo",
        },
        { text: "", align: "center", value: "material" },
        { text: "", align: "center", value: "colorMaterial" },
        { text: "", align: "center", value: "tallas" },
        { text: "", align: "center", value: "horma" },
        { text: "", align: "center", value: "forro" },
        { text: "", align: "center", value: "colorForro" },
        { text: "", align: "center", value: "suela" },
        { text: "", align: "center", value: "colorSuela" },
        { text: "subtotal", value: "subtotal" },
      ],
    };
  },
  methods: {
    ...mapMutations(["ocultarBarra"]),
    ...mapActionsPedido(["getPedidos"]),
    imprimir() {
      window.print();
    },
    async cargarDatos() {
      await this.getPedidos();
    },
    total(detalle) {
      let sum = 0;

      detalle.forEach((item) => {
        sum += item.subtotal;
      });
      return sum;
    },
  },

  computed: {
    ...mapGettersPedido(["pedidos"]),
  },

  created() {
    this.cargarDatos();
  },
  mounted() {
    this.ocultarBarra();
  },
};
</script>

<style scoped>
@media print {
  @page {
    margin: 0;
    size: 8.46in 12.49in landscape;
  }

  button {
    display: none;
  }
}

td {
  font-size: 11px !important;
  padding: 2px !important;
}

.contenedor {
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
  column-count: 2;
  column-gap: 4rem;

  margin: 0 auto;
  width: 100%;
}

.columna {
  column-fill: auto;
}

.pedido {
  -webkit-column-break-inside: avoid; /* Chrome, Safari, Opera */
  page-break-inside: avoid; /* Firefox */
  break-inside: avoid; /* IE 10+ */
  padding: 0;
}
</style>