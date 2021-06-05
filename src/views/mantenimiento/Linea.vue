<template>
  <div class="linea">
    <v-data-table
      :headers="headers"
      :items="allLineas"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>LINEAS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog persistent scrollable v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="actualizarAvillos()"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Nueva Linea
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="nueva.nombre"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        v-model="nueva.plantilla"
                        label="Plantilla"
                        return-object
                        item-text="nombre"
                        :items="plantillas"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        v-model="nueva.horma"
                        label="Horma"
                        return-object
                        item-text="nombre"
                        :items="hormas"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        v-model="nueva.suela"
                        label="Suela"
                        return-object
                        item-text="nombre"
                        :items="suelas"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        v-model="nueva.forro"
                        label="Forro"
                        return-object
                        item-text="nombre"
                        :items="forros"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox
                        label="Tacon?"
                        v-model="nueva.tacon"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-data-table
                        :headers="avillosHeaders"
                        :items="nueva.avillos"
                        class="elevation-1"
                        disable-pagination
                        hide-default-footer
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title>Avillos</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                        </template>

                        <template v-slot:item.cantidad="{ item }">
                          <v-row>
                            <v-col cols="3">
                              <v-text-field
                                type="number"
                                v-model="item.cantidadInicial"
                                value="0"
                             
                                :append-outer-icon="item.icon"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-autocomplete
                                item-text="nombre"
                                :items="item.unidad.conversiones"
                                return-object
                                label="unidad de entrada"
                                v-model="item.unidadConversion"
                              ></v-autocomplete>
                            </v-col>
                            <v-col cols="3">
                              <v-text-field
                                disabled
                                v-model="item.cantidad"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </template>

                        <template v-slot:item.unidad="{ item }">
                          {{ item.unidad.nombre }}
                        </template>

                        <template v-slot:no-data>
                          <v-btn color="primary" @click="actualizarAvillos()">
                            Reset
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Desea eliminar esta linea?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >SI</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
      <template v-slot:item.tacon="{ item }">
        <v-simple-checkbox v-model="item.tacon" disabled></v-simple-checkbox>
      </template>
      <template v-slot:item.plantilla="{ item }">
        <div v-if="item.plantilla != null && item.plantilla != undefined">
          {{ item.plantilla.nombre }}
        </div>
      </template>
      <template v-slot:item.horma="{ item }">
        <div v-if="item.horma != null && item.horma != undefined">
          {{ item.horma.nombre }}
        </div>
      </template>
      <template v-slot:item.suela="{ item }">
        <div v-if="item.suela != null && item.suela != undefined">
          {{ item.suela.nombre }}
        </div>
      </template>
      <template v-slot:item.forro="{ item }">
        <div v-if="item.forro != null && item.forro != undefined">
          {{ item.forro.nombre }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>



<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const {
  mapGetters,
  mapActions,
  mapMutations: mapMutationsLinea,
} = createNamespacedHelpers("linea");
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "nombre",
      },
      {
        text: "Plantilla",
        align: "start",
        sortable: false,
        value: "plantilla",
      },
      {
        text: "Horma",
        align: "start",
        sortable: false,
        value: "horma",
      },
      {
        text: "Suela",
        align: "start",
        sortable: false,
        value: "suela",
      },
      {
        text: "Forro",
        align: "start",
        sortable: false,
        value: "forro",
      },
      {
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "tacon",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    avillosHeaders: [
      {
        text: "Nombre",
        align: "start",
        sortable: true,
        value: "nombre",
      },
      {
        text: "Cantidad",
        align: "start",
        sortable: false,
        value: "cantidad",
        width: "50%",
      },
      {
        text: "Unidad de Compra",
        align: "start",
        sortable: false,
        value: "unidad",
      },
    ],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Linea" : "Editar Linea";
    },
    ...mapGetters([
      "lineas",
      "nuevaLinea",
      "plantillas",
      "hormas",
      "suelas",
      "forros",
    ]),
    allLineas: {
      set(lineas) {
        return lineas;
      },
      get() {
        return this.lineas;
      },
    },

    nueva: {
      set(linea) {
        this.setNuevaLinea(linea);
        return linea;
      },
      get() {
        return this.nuevaLinea;
      },
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    "nueva.avillos": {
      handler(newVal) {
        newVal.forEach((e) => {
          if (e.cantidadInicial != null) {
            let numero = 0;
            if (e.unidadConversion.constante == null) {
              if (e.cantidadInicial != 0) {
                numero = Number(1 / e.cantidadInicial);
              } else {
                numero = 0;
              }
            } else {
              numero =
                Number(e.cantidadInicial) *
                Number(e.unidadConversion.constante);
            }

            e.cantidad = Number(numero.toFixed(4));
          }
        });
      },
      deep: true,
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions([
      "getLineas",
      "updateLinea",
      "saveLinea",
      "deleteLinea",
      "iniciarLinea",
      "actualizarAvillos",
    ]),
    ...mapMutationsLinea(["setNuevaLinea"]),
    ...mapMutations(["mostrarMsj"]),
    async initialize() {
      await this.getLineas();
      await this.iniciarLinea();
      await this.actualizarAvillos();
    },

    editItem(item) {
      this.editedIndex = this.lineas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.actualizarAvillos();
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.lineas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deleteLinea();
      if (res) {
        this.mostrarMsj("Linea eliminada!");
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarLinea();
        this.editedIndex = -1;
      });
      this.actualizarAvillos();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarLinea();
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        //editar
        let res = await this.updateLinea();
        if (res) {
          this.mostrarMsj("Linea modificada!");
        }
      } else {
        //guardar
        let res = await this.saveLinea();
        if (res) {
          this.mostrarMsj("Linea guardada!");
        }
      }
      this.close();
    },
  },
};
</script>