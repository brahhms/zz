<template>
  <v-container>
      Semana {{ semana }}, {{ ano }}
    <div class="contenedor">
      <div class="columna">
      
        <div class="pedido" v-for="pedido in resumenPedidos" :key="pedido._id">
          <v-row>
            <v-col>
              <table>
               
                  <thead>
                    <tr>
                      <th>{{ pedido.cliente }}</th>
                      <th>Tacon</th>
                      <th style="width:20px" v-for="talla in tallas">
                        {{ talla.nombre }}
                      </th>

                      <th>Horma</th>
                      <th>Forro</th>
                      <th>Suela</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="fila"
                      v-for="detalle in pedido.detalle"
                      :key="detalle.index"
                    >
                      <td v-bind:style="{ color: semanaSeleccionada.color}" v-for="item in detalle" :key="item.index">
                        {{ item }}
                      </td>
                    </tr>
                    <tr class="fila" style="font-weight: bold">
                      <td colspan="12"></td>
                      <td style="font-weight: bold; color: black">Total:</td>
                      <td v-bind:style="{ color: semanaSeleccionada.color}">{{ pedido.total }}</td>
                    </tr>
                  </tbody>
                </table>
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
      color:"orange"
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
                lineaDeta.detalleTallas.map((talla) => {
                  if (talla.cantidad > 0) {
                    return talla.cantidad;
                  } else {
                    return "";
                  }
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
      } else return [];
    },
    async loadData() {
      this.ano = Number(this.$route.query.ano);
      this.semana = Number(this.$route.query.semana);
      this.color = this.$route.query.color;
      this.setAnoPedido(this.ano);
      this.setSemanaPedido(this.semana);

      await this.getSemana(this.color);
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
    size: 8.5in 14in landscape !important;
  }
  button {
    display: none;
  }
}


table, td, th {
  border: 1px solid black;
}

table {
  border-collapse: collapse;
}

th,
td {
  padding: 0 4px !important;
}



th {
  color: black;
  font-weight: bold;
}

td,
th,
tr {
  text-align: center !important;
  font-size:12px !important;
}

tr {
  padding: 0 !important;
  margin: 0 !important;
}

.contenedor {
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
  column-count: 2;
  column-gap: 60px;
  margin: 0 auto;
  width: 100%;

}
.container{
  padding: 4px !important;
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