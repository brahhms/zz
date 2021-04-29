<template>
  <div>
    <v-tabs vertical>
      <v-tab>
        <v-icon left> mdi-format-columns </v-icon>
        Pedidos
      </v-tab>
      <v-tab>
        <v-icon left>mdi-clipboard-check </v-icon>
        Lista de Compras
      </v-tab>
      <v-tab> Suelas </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-container>
            <v-row>
              <v-btn @click="generarPedidosPDF" color="primary">
                Descargar
              </v-btn>
            </v-row>
          </v-container>
          <v-card-text>
            <draggable
              v-model="semanaSeleccionada.pedidos"
              ghost-class="ghost"
              @end="onEnd"
            >
              <transition-group type="transition" name="flip-list">
                <v-data-table
                  disable-pagination
                  hide-default-footer
                  dense
                  class="pedido sorteable"
                  v-for="pedido in semanaSeleccionada.pedidos"
                  :key="pedido._id"
                >
                  <template v-slot:top>
                    <v-toolbar dense color="primary" dark flat>
                      <v-toolbar-title>{{
                        pedido.cliente.nombre
                      }}</v-toolbar-title>
                    </v-toolbar>
                  </template>

                  <template v-slot:body>
                    <tbody>
                      <th colspan="6"></th>
                      <th style="text-align: left">subtotal</th>
                      <tr
                        v-for="detalle in pedido.detalle"
                        :key="detalle.index"
                      >
                        <td
                          v-for="resumen in detalle.resumen"
                          :key="resumen.index"
                        >
                          {{ resumen }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="5"></td>
                        <td><b>Total:</b></td>
                        <td>
                          <b>{{ pedido.total }}</b>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </transition-group>
            </draggable>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-container>
            <v-row>
              <v-btn @click="generarListaPDF" color="primary">
                Descargar
              </v-btn>
            </v-row>
          </v-container>
          <v-card-text v-if="semanaSeleccionada.listaDeCompras != null">
            <v-data-table
              dense
              :headers="headers"
              :items="semanaSeleccionada.listaDeCompras.adornos"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense color="primary" dark flat>
                  <v-toolbar-title>Adornos</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:item.unidad="{ item }">
                {{ item.unidad.nombre }} 
              </template>


              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
            <br />
            <v-data-table
              :headers="headers"
              :items="semanaSeleccionada.listaDeCompras.avillos"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense color="primary" dark flat>
                  <v-toolbar-title>Avillos</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
            <br />
            <v-data-table
              :headers="materialesHeaders"
              :items="semanaSeleccionada.listaDeCompras.materiales"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense color="primary" dark flat>
                  <v-toolbar-title>Materiales</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:item.cantidad="{ item }">
                {{ item.cantidad }} yardas
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
            <br />
            <v-data-table
              :headers="materialesHeaders"
              :items="semanaSeleccionada.listaDeCompras.forros"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense color="primary" dark flat>
                  <v-toolbar-title>Forros</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:item.cantidad="{ item }">
                {{ item.cantidad }} yardas
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-container>
            <v-row>
              <v-btn @click="generarSuelasPDF" color="primary">
                Descargar
              </v-btn>
            </v-row>
          </v-container>
          <v-card-text v-if="semanaSeleccionada.listaDeCompras != null">
            <v-data-table
              v-for="suela in semanaSeleccionada.listaDeCompras.suelas"
              :key="suela.index"
              class="elevation-1 mb-4"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense color="primary" dark flat>
                  <v-toolbar-title
                    >{{ suela.nombre }} {{ suela.color }}</v-toolbar-title
                  >
                </v-toolbar>
              </template>

              <template v-slot:body>
                <tbody>
                  <tr>
                    <td>
                      <span
                        v-for="detalle in positivos(suela.detalle)"
                        :key="detalle.nombre"
                        ><v-chip
                          >{{ detalle.cantidad }}/{{ detalle.nombre }}</v-chip
                        >
                      </span>
                    </td>
                  </tr>
                </tbody>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>


<script>
import draggable from "vuedraggable";
import { jsPDF } from "jspdf";
require("jspdf-autotable");

import { createNamespacedHelpers } from "vuex";

const {
  mapActions: mapActionsPedido,
  mapGetters: mapGettersPedido,
} = createNamespacedHelpers("pedido");

export default {
  components: {
    draggable,
  },
  data: () => ({
    oldIndex: "",
    newIndex: "",
    headers: [
      {
        text: "Cantidad",
        align: "start",
        sortable: false,
        value: "cantidad",
        width:'10%'
      },
      {
        text: "Unidad",
        align: "start",
        sortable: false,
        value: "unidad",
        width:'20%'
      },
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },
    ],
    materialesHeaders: [
      {
        text: "Cantidad",
        align: "start",
        sortable: false,
        value: "cantidad",
        width:'10%'
      },
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
        width:'20%'
      },
      {
        text: "Color",
        align: "start",
        sortable: false,
        value: "color",
      },
    ],
  }),
  mounted() {},
  methods: {
    ...mapActionsPedido(["actualizarSemana"]),
    onEnd() {
      this.actualizarSemana();
    },
    total(detalle) {
      let sum = 0;

      detalle.forEach((item) => {
        sum += item.subtotal;
      });
      return sum;
    },
    generarPedidosPDF() {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "legal",
      });

      doc
        .setFontSize(12)
        .text(
          "Semana " +
            this.semanaSeleccionada.semana +
            " " +
            this.semanaSeleccionada.ano,
          0.5,
          0.8
        );

      this.semanaSeleccionada.pedidos.forEach((pedido) => {
        let items = pedido.detalle.map((detalle) => {
          return detalle.resumen;
        });
        items.push(["", "", "", "", "", "Total:", pedido.total]);

        let head = [
          [
            {
              content: pedido.cliente.nombre,
              colSpan: 7,
              styles: { halign: "left" },
            },
          ],
          [
            { title: "Codigo", dataKey: "codigo" },
            { title: "Material", dataKey: "material" },
            { title: "Tallas", dataKey: "tallas" },
            { title: "Horma", dataKey: "horma" },
            { title: "Forro", dataKey: "forro" },
            { title: "Suela", dataKey: "suela" },
            { title: "Subtotal", dataKey: "subtotal" },
          ],
        ];

        doc.autoTable({
          head,
          body: items,
          margin: { top: 1 },
        });
      });

      // Creating footer and saving file
      doc.save(
        `pedidos S${this.semanaSeleccionada.semana}A${this.semanaSeleccionada.ano}.pdf`
      );
    },
    generarListaPDF() {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "legal",
      });

      doc
        .setFontSize(12)
        .text(
          "Semana " +
            this.semanaSeleccionada.semana +
            " " +
            this.semanaSeleccionada.ano,
          0.5,
          0.8
        );

      //ADORNOS
      let head = [
        [
          {
            content: "Adornos",
            colSpan: 3,
            styles: { halign: "left" },
          },
        ],
        [
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Unidad", dataKey: "material" },
          { title: "Nombre", dataKey: "nombre" },
        ],
      ];
      let items = this.semanaSeleccionada.listaDeCompras.adornos.map((item) => {
        return [item.cantidad, item.unidad, item.nombre];
      });

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //adornos
      //AVILLOS
      head = [
        [
          {
            content: "Avillos",
            colSpan: 3,
            styles: { halign: "left" },
          },
        ],
        [
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Unidad", dataKey: "material" },
          { title: "Nombre", dataKey: "nombre" },
        ],
      ];
      items = this.semanaSeleccionada.listaDeCompras.avillos.map((item) => {
        return [item.cantidad, item.unidad, item.nombre];
      });

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //avillos
      //MATERIALES
      head = [
        [
          {
            content: "Materiales",
            colSpan: 3,
            styles: { halign: "left" },
          },
        ],
        [
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Nombre", dataKey: "nombre" },
          { title: "Color", dataKey: "color" },
        ],
      ];
      items = this.semanaSeleccionada.listaDeCompras.materiales.map((item) => {
        return [item.cantidad, item.nombre, item.color];
      });

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //materiales

      //saving file
      doc.save(
        `lista S${this.semanaSeleccionada.semana}A${this.semanaSeleccionada.ano}.pdf`
      );
    },
    generarSuelasPDF() {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "legal",
      });

      doc
        .setFontSize(12)
        .text(
          "Semana " +
            this.semanaSeleccionada.semana +
            " " +
            this.semanaSeleccionada.ano,
          0.5,
          0.8
        );

      this.semanaSeleccionada.listaDeCompras.suelas.forEach((suela) => {
        let talls = "";
        suela.detalle.forEach((detalle) => {
          talls = talls + detalle.cantidad + "/" + detalle.nombre + ", ";
        });
        talls = talls.substring(0, talls.length - 2);
        let items = [[talls, suela.total]];

        let head = [[suela.nombre + " " + suela.color, "Total"]];
        doc.autoTable({
          head,
          body: items,
          margin: { top: 1 },
        });
      });

      // Creating footer and saving file
      doc.save(
        `suelas S${this.semanaSeleccionada.semana}A${this.semanaSeleccionada.ano}.pdf`
      );
    },
    positivos(lista) {
      return lista.filter((item) => item.cantidad > 0);
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
  },
};
</script>

<style scoped>
.sortable {
  cursor: move;
}
.sortable-drag {
  opacity: 0;
}

.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  border-radius: 4px;

  padding: 0;
  border-left: 15px solid rgba(0, 183, 255, 0);
  box-shadow: 15px 15px 10px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;
}
</style>