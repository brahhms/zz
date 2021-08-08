<template>
  <div>
    <v-tabs :color="semanaSeleccionada.color" vertical>
      <v-tab>
        <v-icon left> mdi-format-columns </v-icon>
        Pedidos
      </v-tab>
      <v-tab>
        <v-icon left>mdi-clipboard-check </v-icon>
        Lista de Compras
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-container>
            <v-row>
              <v-col cols="2"
                ><v-btn
                  small
                  dark
                  @click="generarPedidosPDF"
                  :color="semanaSeleccionada.color"
                >
                  Descargar pdf
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  :disabled="!isPedidosReady"
                  small
                  @click="imprimirPedidos()"
                  :color="semanaSeleccionada.color"
                  dark
                >
                  Imprimir
                </v-btn>
              </v-col>

              <iframe
                id="pedidosIframe"
                width="0"
                height="0"
                :src="srcPedidos"
                v-on:load="onLoadPedidosIframe"
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
                    <v-toolbar
                      dense
                      :color="semanaSeleccionada.color"
                      dark
                      flat
                    >
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
                              @click="setPedidoAMover(pedido, true)"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon dark>mdi-arrow-right-bold-box</v-icon>Mover a
                              siguiente semana
                            </v-btn>
                            <v-btn
                              dark
                              text
                              @click="setPedidoAMover(pedido, false)"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon dark>mdi-arrow-left-bold-box</v-icon>Mover a semana
                              anterior
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
              <iframe
                id="listaIframe"
                width="0"
                height="0"
                :src="srcLista"
                v-on:load="onLoadListaIframe"
              ></iframe>
              <v-col cols="2"
                ><v-btn
                  small
                  @click="generarListaPDF"
                  :color="semanaSeleccionada.color"
                  dark
                >
                  Descargar pdf
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  small
                  :disabled="!isListaReady"
                  @click="imprimirLista()"
                  :color="semanaSeleccionada.color"
                  dark
                >
                  Imprimir
                </v-btn>
              </v-col>
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
                <v-toolbar dense :color="semanaSeleccionada.color" dark flat>
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
                <v-toolbar dense :color="semanaSeleccionada.color" dark flat>
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
              :items="
                semanaSeleccionada.listaDeCompras.materiales.concat(
                  semanaSeleccionada.listaDeCompras.forros
                )
              "
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense :color="semanaSeleccionada.color" dark flat>
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
              :items="semanaSeleccionada.listaDeCompras.suelas"
              :headers="suelasHeaders"
              class="elevation-1 mb-4"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar dense :color="semanaSeleccionada.color" dark flat>
                  <v-toolbar-title>Suelas</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:item.suela="{ item }">
                {{ item.nombre }} {{ item.color }}
              </template>
              <template v-slot:item.cantidades="{ item }">
                <span
                  v-for="detalle in positivos(item.detalle)"
                  :key="detalle.nombre"
                  ><v-chip>{{ detalle.cantidad }}/{{ detalle.nombre }}</v-chip>
                </span>
              </template>
              <template v-slot:item.total="{ item }">
                <b> {{ item.total }}</b>
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
    isListaReady: false,
    isPedidosReady: false,
    srcPedidos: `http://localhost:8080/#/Imprimir`,
    srcLista: `http://localhost:8080/#/ImprimirLista`,
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
        width: "20%",
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
    suelasHeaders: [
      {
        text: "Suela",
        align: "start",
        sortable: false,
        value: "suela",
        width: "15%",
      },
      {
        text: "Cantidades",
        align: "start",
        sortable: false,
        value: "cantidades",
      },
      {
        text: "Total",
        align: "start",
        sortable: false,
        value: "total",
        width: "15%",
      },
    ],
  }),

  methods: {
    ...mapActionsPedido(["actualizarOrden", "moverPedido", "deletePedido"]),
    ...mapMutationsPedido(["setPedido"]),
    ...mapMutations(["mostrarMsj"]),

    onLoadListaIframe() {
      this.isListaReady = true;
    },
    onLoadPedidosIframe() {
      this.isPedidosReady = true;
    },

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

    setPedidoAMover(pedido, moveForward) {
      let p = Object.assign({}, pedido);
      p.isEditing = false;
      p.isMoving = true;
      p.moveForward = moveForward;
      this.setPedido(p);
    },
    async mover() {
      let res = await this.moverPedido();
      if (res.status == 201 || res.status == 200) {
        this.mostrarMsj("Se ha movido el pedido");
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
        orientation: "landscape",
        unit: "in",
        format: "legal",
      });

      doc
        .setFontSize(11)
        .text(
          "Semana " +
            this.semanaSeleccionada.semana +
            " " +
            this.semanaSeleccionada.ano +
            " - " +
            this.semanaSeleccionada.color,
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
        orientation: "landscape",
        unit: "in",
        format: "legal",
      });

      doc
        .setFontSize(11)
        .text(
          "Semana " +
            this.semanaSeleccionada.semana +
            " " +
            this.semanaSeleccionada.ano +
            " - " +
            this.semanaSeleccionada.color,
          0.5,
          0.8
        );

      //ADORNOS AVILLOS
      let head = [
        [
          {
            content: "Adornos",
            colSpan: 2,
            styles: { halign: "left" },
          },
          {
            content: "Avillos",
            colSpan: 2,
            styles: { halign: "left" },
          },
        ],
        [
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Nombre", dataKey: "nombre" },
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Nombre", dataKey: "nombre" },
        ],
      ];

      let size = 0;
      let items = [];
      let adornos = [...this.semanaSeleccionada.listaDeCompras.adornos];
      let avillos = [...this.semanaSeleccionada.listaDeCompras.avillos];
      if (adornos.length > avillos.length) {
        size = adornos.length;
      } else {
        size = avillos.length;
      }

      for (let index = 0; index < size; index++) {
        let adorno = adornos.pop();
        if (adorno == undefined || adorno == null) {
          adorno = ["", ""];
        } else {
          adorno = [
            adorno.cantidad + " " + adorno.unidad.nombre,
            adorno.nombre,
          ];
        }

        let avillo = avillos.pop();
        if (avillo == undefined || avillo == null) {
          avillos = ["", ""];
        } else {
          avillo = [
            avillo.cantidad + " " + avillo.unidad.nombre,
            avillo.nombre,
          ];
        }

        items.push([adorno[0], adorno[1], avillo[0], avillo[1]]);
      }

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //adornos avillos

      //MATERIALES FORROS SUELAS
      head = [
        [
          {
            content: "Materiales",
            colSpan: 2,
            styles: { halign: "left" },
          },
          {
            content: "Suelas",
            colSpan: 3,
            styles: { halign: "left" },
          },
        ],
        [
          { title: "Cantidad", dataKey: "cantidad" },
          { title: "Nombre", dataKey: "nombre" },
          { title: "Suela", dataKey: "suela" },
          { title: "Cantidades", dataKey: "cantidades" },
          { title: "Total", dataKey: "total" },
        ],
      ];

      size = 0;
      items = [];
      let materiales = [...this.semanaSeleccionada.listaDeCompras.materiales];
      materiales = materiales.concat(
        this.semanaSeleccionada.listaDeCompras.forros
      );
      let suelas = [...this.semanaSeleccionada.listaDeCompras.suelas];
      if (materiales.length > suelas.length) {
        size = materiales.length;
      } else {
        size = suelas.length;
      }

      for (let index = 0; index < size; index++) {
        let material = materiales.pop();
        if (material == undefined || material == null) {
          material = ["", ""];
        } else {
          material = [
            material.cantidad + " yardas",
            material.nombre + " " + material.color,
          ];
        }

        let suela = suelas.pop();
        if (suela == undefined || suela == null) {
          suela = ["", "", ""];
        } else {
          suela = [
            suela.nombre + " " + suela.color,
            suela.detalle
              .filter((s) => s.cantidad > 0)
              .map((m) => {
                return " " + m.cantidad + "/" + m.nombre;
              })
              .join(),
            suela.total,
          ];
        }

        items.push([material[0], material[1], suela[0], suela[1], suela[2]]);
      }

      doc.autoTable({
        head,
        body: items,
        margin: { top: 1 },
      });
      //materiales forros

      //saving file
      doc.save(
        `lista S${this.semanaSeleccionada.semana}A${this.semanaSeleccionada.ano}.pdf`
      );
    },

    positivos(lista) {
      return lista.filter((item) => item.cantidad > 0);
    },
    imprimirPedidos() {
      document.getElementById("pedidosIframe").contentWindow.print();
    },

    imprimirLista() {
      document.getElementById("listaIframe").contentWindow.print();
    },
  },
  computed: {
    ...mapGettersPedido(["semanaSeleccionada"]),
  },
  created() {
    this.srcPedidos = `http://localhost:8080/#/Imprimir?ano=${this.semanaSeleccionada.ano}&semana=${this.semanaSeleccionada.semana}&color=${this.semanaSeleccionada.color}`;
    this.srcLista = `http://localhost:8080/#/ImprimirLista?ano=${this.semanaSeleccionada.ano}&semana=${this.semanaSeleccionada.semana}&color=${this.semanaSeleccionada.color}`;
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