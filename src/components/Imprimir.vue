<template>
  <v-container>
    <div class="contenedor">
      <div class="columna">
        Semana {{semana}}, {{ano}}
        <div class="pedido" v-for="pedido in resumenPedidos" :key="pedido._id">
          <v-row>
            <v-col cols="12" style="font-size: 10px; font-weight: bold">
              {{ pedido.cliente }}
            </v-col>
            <v-col>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <td style="font-weight: bold">Codigo</td>
                    <td style="font-weight: bold">Material</td>
                    <td style="font-weight: bold">Tacon</td>
                    <td style="font-weight: bold">Tallas</td>
                    <td style="font-weight: bold">Horma</td>
                    <td style="font-weight: bold">Forro</td>
                    <td style="font-weight: bold">Suela</td>
                    <td style="font-weight: bold">Subtotal</td>
                  </thead>
                  <tbody>
                    <tr
                      class="fila"
                      v-for="detalle in pedido.detalle"
                      :key="detalle.index"
                    >
                      <td>{{ detalle.estilo }}</td>
                      <td>{{ detalle.detalleMaterial }}</td>

                      <td>{{ detalle.detalleTacon }}</td>

                      <td>{{ detalle.detalleTallas }}</td>
                      <td>{{ detalle.horma }}</td>
                      <td>{{ detalle.detalleForro }}</td>

                      <td>{{ detalle.detalleSuela }}</td>

                      <td style="font-size: 14px; font-weight: bold">
                        {{ detalle.subtotal }}
                      </td>
                    </tr>
                    <tr class="fila" style="font-size: 14px; font-weight: bold">
                      <td colspan="6"></td>
                      <td style="font-weight: bold">Total:</td>
                      <td>{{ pedido.total }}</td>
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
  </v-container>
</template>



<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const {
  mapGetters: mapGettersPedido,
  mapActions: mapActionsPedido,
  mapMutations: mapMutationsPedido,
} = createNamespacedHelpers("pedido");
export default {
  data() {
    return {
      resumenPedidos: [],
      ano: 0,
      semana: 0,
    };
  },
  methods: {
    ...mapMutations(["ocultarBarra"]),
    ...mapMutationsPedido(["setSemanaPedido", "setAnoPedido"]),
    ...mapActionsPedido(["getSemana"]),
    resumirPedidos() {
      this.resumenPedidos = this.semanaSeleccionada.pedidos.map((pedido) => {
        return {
          _id: pedido._id,
          semana: pedido.semana,
          ano: pedido.ano,
          total: pedido.total,
          cliente: pedido.cliente.nombre,
          detalle: pedido.detalle.map((lineaDeta) => {
            lineaDeta.detalleTacon.material=lineaDeta.detalleTacon.material || {nombre:""};
            return {
              estilo: lineaDeta.estilo.codigo,
              detalleMaterial:
                lineaDeta.detalleMaterial.material.nombre +
                " " +
                lineaDeta.detalleMaterial.color,
              detalleTacon:
                lineaDeta.detalleTacon.material.nombre +
                " " +
                lineaDeta.detalleTacon.color,
              detalleTallas: lineaDeta.detalleTallas
                .filter((t) => t.cantidad > 0)
                .map((talla) => {
                  return "  " + talla.cantidad + "/" + talla.talla.nombre;
                })
                .join(),
              horma: lineaDeta.horma.nombre,
              detalleForro:
                lineaDeta.detalleForro.forro.nombre +
                " " +
                lineaDeta.detalleForro.color,
              detalleSuela:
                lineaDeta.detalleSuela.suela.nombre +
                " " +
                lineaDeta.detalleSuela.color,
              subtotal: lineaDeta.subtotal,
            };
          }),
        };
      });
    },
    async loadData() {
      this.ano = Number(this.$route.query.ano);
      this.semana = Number(this.$route.query.semana);
      this.setAnoPedido(this.ano);
      this.setSemanaPedido(this.semana);

      await this.getSemana();
      this.resumirPedidos();
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
  },

  created() {},
  mounted() {
    this.loadData();
    this.ocultarBarra();
  },
};
</script>

<style scoped>
@media print {
  @page {
    margin: 0 !important;
    size: 8.46in 12.49in landscape !important;
  }
  button {
    display: none;
  }
}
td {
  font-size: 9px !important;
  padding: 1px !important;
}
.contenedor {
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
  column-count: 2;
  column-gap: 3rem;
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