<template>
  <v-container>
    <div class="contenedor">
      <div class="columna">
        Semana {{ semana }}, {{ ano }}
        <div class="pedido" v-for="pedido in resumenPedidos" :key="pedido._id">
          <v-row>
         
            <v-col>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <td style="font-weight: bold">{{ pedido.cliente }}</td>
                    <td style="font-weight: bold">Tacon</td>
                    <td v-for="talla in tallas" style="font-weight: bold">
                      {{ talla.nombre }}
                    </td>

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
                      <td v-for="item in detalle" :key="item.index">
                        {{ item }}
                      </td>
                    </tr>
                    <tr class="fila" style="font-weight: bold">
                      <td colspan="12"></td>
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
const {
  mapActions: mapActionsTalla,
  mapGetters: mapGettersTalla,
} = createNamespacedHelpers("talla");
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
    ...mapActionsTalla(["getTallas"]),
    resumirPedidos() {
      if (this.semanaSeleccionada.pedidos != undefined) {
        this.resumenPedidos = this.semanaSeleccionada.pedidos.map((pedido) => {
          return {
            _id: pedido._id,
            semana: pedido.semana,
            ano: pedido.ano,
            total: pedido.total,
            cliente: pedido.cliente.nombre,
            detalle: pedido.detalle.map((lineaDeta) => {
              lineaDeta.detalleTacon.material = lineaDeta.detalleTacon
                .material || { nombre: "" };
              lineaDeta.detalleTacon.color = lineaDeta.detalleTacon.color || "";
              let d = [];
              d.push(
                lineaDeta.estilo.codigo +
                  " " +
                  lineaDeta.detalleMaterial.material.nombre +
                  " " +
                  lineaDeta.detalleMaterial.color
              );

              d.push(
                lineaDeta.detalleTacon.material.nombre +
                  " " +
                  lineaDeta.detalleTacon.color
              );

              d = d.concat(
                lineaDeta.detalleTallas
                  
                  .map((talla) => {
                    return talla.cantidad;
                  })
              );
              d.push(lineaDeta.horma.nombre);
              d.push(
                lineaDeta.detalleForro.forro.nombre +
                  " " +
                  lineaDeta.detalleForro.color
              );

              d.push(
                lineaDeta.detalleSuela.suela.nombre +
                  " " +
                  lineaDeta.detalleSuela.color
              );
              d.push(lineaDeta.subtotal);

              return d;
            }),
          };
        });
      }else return []
    },
    async loadData() {
      this.ano = Number(this.$route.query.ano);
      this.semana = Number(this.$route.query.semana);
      this.setAnoPedido(this.ano);
      this.setSemanaPedido(this.semana);

      await this.getSemana();
      await this.getTallas();
      this.resumirPedidos();
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
    ...mapGettersTalla(["tallas"]),
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

table,
th,
td {
  border: 1px solid black;
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