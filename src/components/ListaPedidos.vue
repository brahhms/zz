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
              <v-col cols="2"
                ><v-btn @click="generarPedidosPDF" color="primary">
                  Descargar pdf
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn @click="imprimirPedidos()" color="primary">
                  Imprimir
                </v-btn>
              </v-col>

              <iframe
                id="pedidosIframe"
                width="0"
                height="0"
                :src="srcPedidos"
              ></iframe>
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
                  class="pedido sorteable"
                  v-for="pedido in semanaSeleccionada.pedidos"
                  :key="pedido._id"
                >
                  <template v-slot:top>
                    <v-toolbar dense color="primary" dark flat>
                      <v-toolbar-title>{{
                        pedido.cliente.nombre
                      }}</v-toolbar-title>

                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark text @click="editar(pedido)">
                          <v-icon dark> mdi-file-edit </v-icon>Editar
                        </v-btn>
                       

                         <!--ELIMINAR  -->
                        <v-dialog
                          v-model="eliminarDialog"
                          persistent
                          max-width="370"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              dark
                              text
                              @click="setEliminar(pedido)"
                              v-bind="attrs"
                              v-on="on"
                            >
                               <v-icon dark> mdi-delete </v-icon>Eliminar
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="headline">
                              Desea Eliminar el pedido?
                            </v-card-title>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn text @click="eliminarDialog = false">
                                Cancelar
                              </v-btn>
                              <v-btn
                                color="red"
                                outlined
                                @click="
                                  eliminar(pedido);
                                  eliminarDialog = false;
                                "
                              >
                                Aceptar
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <!--/ELIMINAR -->

                        <!--MOVER  -->
                        <v-dialog
                          v-model="moverDialog"
                          persistent
                          max-width="320"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              dark
                              text
                              @click="setPedidoAMover(pedido)"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon dark>mdi-file-move </v-icon>Mover a
                              siguiente semana
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="headline">
                              Desea mover el pedido?
                            </v-card-title>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn text @click="moverDialog = false">
                                Cancelar
                              </v-btn>
                              <v-btn
                                color="primary"
                                text
                                @click="
                                  mover(pedido);
                                  moverDialog = false;
                                "
                              >
                                Aceptar
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <!--/MOVER -->
                      </v-toolbar-items>
                    </v-toolbar>
                  </template>

                  <template v-slot:body>
                    <tbody>
                      <th colspan="7"></th>
                      <th style="text-align: left">subtotal</th>
                      <tr
                        v-for="detalle in pedido.detalle"
                        :key="detalle.index"
                      >
                        <td>
                          {{ detalle.estilo.codigo }}
                        </td>
                        <td>
                          {{ detalle.detalleMaterial.material.nombre }}
                          {{ detalle.detalleMaterial.color }}
                        </td>
                        <td>
                          <div v-if="detalle.detalleTacon.material != null">
                            {{ detalle.detalleTacon.material.nombre }}
                            {{ detalle.detalleTacon.color }}
                          </div>
                        </td>
                        <td>
                          <v-row>
                            <div
                              v-for="t in detalle.detalleTallas.filter(
                                (x) => x.cantidad > 0
                              )"
                              :key="t.index"
                            >
                              <v-chip dense
                                >{{ t.cantidad }}/{{ t.talla.nombre }}</v-chip
                              >
                            </div>
                          </v-row>
                        </td>
                        <td>
                          {{ detalle.horma.nombre }}
                        </td>
                        <td>
                          {{ detalle.detalleForro.forro.nombre }}
                          {{ detalle.detalleForro.color }}
                        </td>
                        <td>
                          {{ detalle.detalleSuela.suela.nombre }}
                          {{ detalle.detalleSuela.color }}
                        </td>
                        <td>
                          {{ detalle.subtotal }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6"></td>
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

              <template v-slot:item.unidad="{ item }">
                {{ item.unidad.nombre }}
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
                    <td>Total: {{ suela.total }}</td>
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

import { createNamespacedHelpers, mapMutations } from "vuex";

const {
  mapActions: mapActionsPedido,
  mapGetters: mapGettersPedido,
  mapMutations: mapMutationsPedido,
} = createNamespacedHelpers("pedido");

export default {
  components: {
    draggable,
  },
  data: () => ({
    srcPedidos: `http://localhost:8080/#/Imprimir`,
    moverDialog: false,
    eliminarDialog: false,
    headers: [
      {
        text: "Cantidad",
        align: "start",
        sortable: false,
        value: "cantidad",
        width: "10%",
      },
      {
        text: "Unidad",
        align: "start",
        sortable: false,
        value: "unidad",
        width: "20%",
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
        width: "10%",
      },
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
        width: "20%",
      },
      {
        text: "Color",
        align: "start",
        sortable: false,
        value: "color",
      },
    ],
  }),

  methods: {
    ...mapActionsPedido(["actualizarOrden", "moverPedido","deletePedido"]),
    ...mapMutationsPedido(["setPedido"]),
    ...mapMutations(["mostrarMsj"]),

    editar(pedido) {
      let p = Object.assign({}, pedido);
      p.isEditing = true;
      p.isMoving = false;
      this.setPedido(p);
      this.$router.push({ name: "NuevoPedido" });
    },

    setEliminar(pedido) {
      let p = Object.assign({}, pedido);
      p.isEditing = false;
      p.isMoving = false;
      this.setPedido(p);
    },

    setPedidoAMover(pedido) {
      let p = Object.assign({}, pedido);
      p.isEditing = false;
      p.isMoving = true;
      p.semana = this.semanaSeleccionada.siguienteSemana;
      this.setPedido(p);
    },
    async mover() {
      let res = await this.moverPedido();
      if (res.status == 201 || res.status == 200) {
        this.mostrarMsj("Se ha movido el pedido a la siguiente semana ");
      }
    },
    async eliminar() {
      let res = await this.deletePedido();
      if (res.status == 201 || res.status == 200) {
        this.mostrarMsj("Pedido eliminado");
      }
    },
    onEnd() {
      this.actualizarOrden();
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
        .setFontSize(11)
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
          let cadena = detalle.detalleTallas
            .filter((t) => t.cantidad > 0)
            .map((talla) => {
              return " " + talla.cantidad + "/" + talla.talla.nombre;
            })
            .join();

          if (detalle.detalleTacon.material == null) {
            detalle.detalleTacon.material = { nombre: "" };
            detalle.detalleTacon.color = "";
          }

          return [
            detalle.estilo.codigo,
            detalle.detalleMaterial.material.nombre +
              " " +
              detalle.detalleMaterial.color,
            detalle.detalleTacon.material.nombre +
              " " +
              detalle.detalleTacon.color,
            cadena,
            detalle.horma.nombre,
            detalle.detalleForro.forro.nombre +
              " " +
              detalle.detalleForro.color,
            detalle.detalleSuela.suela.nombre +
              " " +
              detalle.detalleSuela.color,
            detalle.subtotal,
          ];
        });
        items.push(["", "", "", "", "", "", "Total:", pedido.total]);

        let head = [
          [
            {
              content: pedido.cliente.nombre,
              colSpan: 8,
              styles: { halign: "left" },
            },
          ],
          [
            { title: "Codigo", dataKey: "codigo" },
            { title: "Material", dataKey: "material" },
            { title: "Tacon", dataKey: "tacon" },
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
        .setFontSize(11)
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
        return [item.cantidad, item.unidad.nombre, item.nombre];
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
        return [item.cantidad, item.unidad.nombre, item.nombre];
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
        return [item.cantidad + " yardas", item.nombre, item.color];
      });

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //materiales
      //FORROS
      head = [
        [
          {
            content: "Forros",
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
      items = this.semanaSeleccionada.listaDeCompras.forros.map((item) => {
        return [item.cantidad + " yardas", item.nombre, item.color];
      });

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //forros

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
        let talls = suela.detalle
          .filter((s) => s.cantidad > 0)
          .map((suela) => {
            return " " + suela.cantidad + "/" + suela.nombre;
          })
          .join();

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
    imprimirPedidos() {
      //window.frames['pedidosIframe'].imprimir();
      document.getElementById("pedidosIframe").contentWindow.print();
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
  },
  created() {
    this.srcPedidos = `http://localhost:8080/#/Imprimir?ano=${this.semanaSeleccionada.ano}&semana=${this.semanaSeleccionada.semana}`;
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