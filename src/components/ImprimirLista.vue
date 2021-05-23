<template>
  <v-container>
      Semana {{ semana }}, {{ ano }}
    <div class="contenedor">
      <div
        class="columna"
        v-if="semanaSeleccionada.listaDeCompras != undefined"
      >
      

        <v-simple-table dense class="pedido">
          <template v-slot:default>
            <thead>
              <tr><th style="font-weight: bold">Adornos</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Cantidad</b></td>
                <td><b>Nombre</b></td>
              </tr>
              <tr
                class="fila"
                v-for="adorno in semanaSeleccionada.listaDeCompras.adornos"
                :key="adorno.index"
              >
                <td>{{ adorno.cantidad }} {{ adorno.unidad.nombre }}</td>
                <td>{{ adorno.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <br />

        <v-simple-table dense class="pedido">
          <template v-slot:default>
            <thead>
              <tr>
                <th style="font-weight: bold">Avillos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Cantidad</b></td>
                <td><b>Nombre</b></td>
              </tr>
              <tr
                class="fila"
                v-for="avillo in semanaSeleccionada.listaDeCompras.avillos"
                :key="avillo.index"
              >
                <td>{{ avillo.cantidad }} {{ avillo.unidad.nombre }}</td>
                <td>{{ avillo.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <br />

        <v-simple-table dense class="pedido">
          <template v-slot:default>
            <thead>
              <tr>
                <th style="font-weight: bold">Materiales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Cantidad</b></td>
                <td><b>Nombre</b></td>
              </tr>
              <tr
                class="fila"
                v-for="material in semanaSeleccionada.listaDeCompras.materiales.concat(
                  semanaSeleccionada.listaDeCompras.forros
                )"
                :key="material._id"
              >
                <td>{{ material.cantidad }} yardas</td>
                <td>{{ material.nombre }} {{ material.color }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <br />

       <v-simple-table dense class="pedido">>
          <template v-slot:default>
            <thead>
             <tr>
                <th style="font-weight: bold">Suelas</th>
             </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Nombre</b></td>
                <td><b>Cantidades</b></td>
                <td><b>Total</b></td>
              </tr>
              <tr
                class="fila"
                v-for="suela in semanaSeleccionada.listaDeCompras.suelas"
                :key="suela._rev"
              >
                <td>{{ suela.nombre }} {{ suela.color }}</td>
                <td>
                  <span
                    v-for="detalle in suela.detalle.filter(
                      (x) => x.cantidad > 0
                    )"
                    :key="detalle.index"
                    >{{ detalle.cantidad }}/{{ detalle.nombre }},
                  </span>
                </td>
                <td>{{ suela.total }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <br />
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
      ano: 0,
      semana: 0,
    };
  },
  methods: {
    ...mapMutations(["ocultarBarra"]),
    ...mapMutationsPedido(["setSemanaPedido", "setAnoPedido"]),
    ...mapActionsPedido(["getSemana"]),

    async loadData() {
      this.ano = Number(this.$route.query.ano);
      this.semana = Number(this.$route.query.semana);
      this.color = this.$route.query.color;
      this.setAnoPedido(this.ano);
      this.setSemanaPedido(this.semana);

      await this.getSemana(this.color);

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
  font-size: 12px !important;
  padding: 0px 3px !important;
}
.contenedor {
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
  column-count: 2;
  column-gap: 40px;
  margin: 0 auto;
  width: 100%;
}
.container{
  padding: 3px;
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
table,
td{
  border: 2px solid black;
}
</style>