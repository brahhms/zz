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

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <draggable
              v-model="semanaSeleccionada.pedidos"
              ghost-class="ghost"
              @end="onEnd"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  class="pedido sorteable"
                  v-for="pedido in semanaSeleccionada.pedidos"
                  :key="pedido._id"
                >
                  <v-row>
                    <v-col style="font-size: 14px; font-weight: bold">
                      {{ pedido.cliente.nombre }}
                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row>
                    <v-col>
                      <table style="width: 650px">
                        <tr>
                          <th colspan="9"></th>
                          <th style="font-weight: bold">subtotal</th>
                        </tr>

                        <tr
                          class="fila"
                          v-for="(detalle, index) in pedido.detalle"
                          :key="index"
                        >
                          <td>
                            {{ detalle.estilo.linea.nombre
                            }}{{ detalle.estilo.correlativo }}
                          </td>
                          <td>
                            {{ detalle.detalleMaterial.material.nombre }}
                          </td>
                          <td>{{ detalle.detalleMaterial.color }}</td>
                          <td>
                            <table>
                              <tr>
                                <td
                                  cols="1"
                                  v-for="detalleTallas in detalle.detalleTallas"
                                  :key="detalleTallas.talla._id"
                                >
                                  <span v-show="detalleTallas.cantidad > 0"
                                    >{{ detalleTallas.cantidad }}/{{
                                      detalleTallas.talla.nombre
                                    }}
                                  </span>
                                  <span v-if="detalleTallas.cantidad > 0"
                                    >,
                                  </span>
                                </td>
                              </tr>
                            </table>
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
                      </table>
                    </v-col>
                  </v-row>
                  <br />
                </div>
              </transition-group>
            </draggable>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text v-if="semanaSeleccionada.listaDeCompras != null">
            <v-data-table
              :headers="headers"
              :items="semanaSeleccionada.listaDeCompras.adornos"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Adornos</v-toolbar-title>
                  
                </v-toolbar>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
            <hr />
            <v-data-table
              :headers="headers"
              :items="semanaSeleccionada.listaDeCompras.avillos"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Avillos</v-toolbar-title>
                </v-toolbar>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
              </template>
            </v-data-table>
            <hr />
            <v-data-table
              :headers="materialesHeaders"
              :items="semanaSeleccionada.listaDeCompras.materiales"
              class="elevation-1"
              disable-pagination
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Materiales</v-toolbar-title>
                </v-toolbar>
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
    headers:[{
          text: 'Cantidad',
          align: 'end',
          sortable: false,
          value: 'cantidad',
          width:1
        },{
          text: '',
          align: 'start',
          sortable: false,
          value: 'unidad',
          width:2
        },
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'nombre',
        }],
        materialesHeaders:[{
          text: 'Cantidad',
          align: 'end',
          sortable: false,
          value: 'cantidad',
          width:1
        },{
          text: '',
          align: 'Nombre',
          sortable: false,
          value: 'nombre',
          width:3
        },
        {
          text: 'Color',
          align: 'start',
          sortable: false,
          value: 'color',
        }]
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
  padding-left: 5px;
  border-left: 15px solid rgba(0, 183, 255, 0.2);
  box-shadow: 10px 10px 5px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;
}
</style>