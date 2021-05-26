<template>
  <div>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Estilos</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-dialog fullscreen hide-overlay scrollable v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              depressed
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo Estilo
            </v-btn>
            <v-btn
              color="primary"
              :to="{ name: 'Imagenes' }"
              depressed
              dark
              class="mb-2"
            >
              Imgs
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ formTitle }} Estilo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="save"> Guardar </v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="2">
                    <!--solo mayuscula-->
                    <v-autocomplete
                      item-text="nombre"
                      :items="lineas"
                      return-object
                      label="linea de estilo"
                      v-model="nuevo.linea"
                      @change="changeLinea(nuevo.linea)"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="10">
                    <v-text-field
                      label="correlativo"
                      v-model="nuevo.correlativo"
                      hide-details
                      min="1"
                      step="1"
                      type="number"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      label="Pares en yarda de Material"
                      v-model="nuevo.rendimientoMaterial"
                      hide-details
                      min="1"
                      step="1"
                      type="number"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="Pares en yarda de Forro"
                      v-model="nuevo.rendimientoForro"
                      hide-details
                      min="1"
                      step="1"
                      type="number"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-file-input
                      label="Imagen"
                      show-size
                      small-chips
                      truncate-length="9"
                      v-model="nuevo.img"
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-row v-if="nuevo.avillos.length > 0">
                  <v-col>
                    <v-data-table
                      :headers="adornoHeaders"
                      :items="nuevo.avillos"
                      class="elevation-1"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:top>
                        <v-toolbar dense color="primary" dark flat>
                          <v-toolbar-title>Avillos</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                        </v-toolbar>
                      </template>

                      <template v-slot:item.cantidad="{ item }">
                        <v-row>
                          <v-col cols="3">
                            <v-text-field
                              v-model="item.cantidadInicial"
                              hide-details
                              min="0"
                              max="99"
                              step="1"
                              type="number"
                              oninput="this.value=this.value.replace(/[^0-9]/g,'');"
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
                        <v-btn color="primary" @click="iniciarEstilo">
                          Reset
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-data-table
                      :headers="adornoHeaders"
                      :items="nuevo.adornos"
                      class="elevation-1"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:top>
                        <v-toolbar dense color="primary" dark flat>
                          <v-toolbar-title>Adornos</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                        </v-toolbar>
                      </template>

                      <template v-slot:item.cantidad="{ item }">
                        <v-row>
                          <v-col cols="3">
                            <v-text-field
                              v-model="item.cantidadInicial"
                              hide-details
                              min="0"
                              max="99"
                              step="1"
                              type="number"
                              oninput="this.value=this.value.replace(/[^0-9]/g,'');"
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
                        <v-btn color="primary" @click="iniciarEstilo">
                          Reset
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Desea eliminar este estilo?</v-card-title
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

        <template v-slot:extension>
          <v-tabs v-model="tab" grow>
            <v-tab v-for="linea in lineas" :key="linea.nombre">
              {{ linea.nombre }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="linea in lineas" :key="linea._id">
          <v-data-table
            :headers="estiloHeaders"
            :items="allEstilos"
            class="elevation-1"
            disable-pagination
            hide-default-footer
            v-if="linea._id != 2021"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>

            <template v-slot:item.correlativo="{ item }">
              {{ item.codigo }}
            </template>

            <template v-slot:item.tacon="{ item }">
              <v-simple-checkbox
                v-model="item.linea.tacon"
                disabled
              ></v-simple-checkbox>
            </template>
            <template v-slot:item.img="{ item }">
              <v-chip v-if="item._attachments"> imagen</v-chip>
              <span v-else>sin imagen</span>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>




<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const { mapActions, mapGetters, mapMutations: mapMutationsEstilo } = createNamespacedHelpers(
  "estilo"
);
export default {
  data() {
    return {
      tab: 0,
      dialog: false,
      dialogDelete: false,
      adornoHeaders: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
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
      estiloHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: true,
          value: "correlativo",
        },
        {
          text: "Tacon",
          align: "start",
          sortable: false,
          value: "tacon",
        },
        {
          text: "Imagen",
          align: "start",
          sortable: false,
          value: "img",
        },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
    };
  },

  methods: {
    ...mapActions([
      "iniciarEstilo",
      "saveEstilo",
      "updateEstilo",
      "getEstilos",
      "deleteEstilo",
      "generarCorrelativo",
      "actualizarAvillos",
      "actualizarAdornos",
    ]),
    ...mapMutationsEstilo(["setNuevoEstilo", "resetAvillos"]),
    ...mapMutations(["mostrarMsj"]),
    changeLinea() {
      this.resetAvillos();
      this.generarCorrelativo();
      this.actualizarAvillos();
    },
    async save() {
      let msj = "";
      if (this.editedIndex > -1) {
        //editar
        msj = await this.updateEstilo();
      } else {
        //guardar
        msj = await this.saveEstilo();
      }
      this.mostrarMsj(msj);
      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarEstilo();
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarEstilo();
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      this.editedIndex = this.estilos.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteEstilo();

      this.closeDelete();
    },
    editItem(item) {
      this.editedIndex = this.estilos.indexOf(item);
      item.rendimientoForro = Math.round(Number(1 / item.rendimientoForro));
      item.rendimientoMaterial = Math.round(
        Number(1 / item.rendimientoMaterial)
      );
      this.nuevo = item;
      this.dialog = true;
    },
    async initialize() {
      await this.getEstilos();

      this.iniciarEstilo();
    },
  },
  computed: {
    ...mapGetters(["nuevoEstilo", "lineas", "estilos"]),
    nuevo: {
      set(estilo) {
        estilo.linea = this.lineas.find((l) => l._id == estilo.linea._id);
        this.setNuevoEstilo(estilo);
        this.actualizarAdornos();
        this.actualizarAvillos();
        return estilo;
      },
      get() {
        return this.nuevoEstilo;
      },
    },
    allEstilos: {
      set(estilos) {
        return estilos;
      },
      get() {
        let styles = [];
        this.estilos.forEach((estilo) => {
          if (estilo.linea != undefined) {
            if (estilo.linea.nombre == this.lineas[this.tab].nombre) {
              styles.push(estilo);
            }
          }
        });
        return styles;
      },
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
  },

  watch: {
    "nuevo.adornos": {
      handler(newVal) {
        newVal.forEach((e) => {
          if (
            e.cantidadInicial != null &&
            e.cantidadInicial != "" &&
            e.cantidadInicial != 0
          ) {
            let numero =
              Number(e.cantidadInicial) * Number(e.unidadConversion.constante);
            e.cantidad = numero.toFixed(4);
          } else {
            e.cantidadInicial = 0;
            e.cantidad = 0;
          }
        });
      },
      deep: true,
    },
    "nuevo.avillos": {
      handler(newVal) {
        newVal.forEach((e) => {
          if (
            e.cantidadInicial != null &&
            e.cantidadInicial != "" &&
            e.cantidadInicial != 0
          ) {
            let numero = 0;
            if (e.unidadConversion.constante == null) {
              if (Number(e.cantidadInicial) > 0) {
                numero = Number(1 / e.cantidadInicial);
              } else {
                numero = 0;
              }
            } else {
              numero =
                Number(e.cantidadInicial) *
                Number(e.unidadConversion.constante);
            }

            e.cantidad = numero.toFixed(4);
          } else {
            e.cantidadInicial = 0;
            e.cantidad = 0;
          }
        });
      },
      deep: true,
    },
  },
  created() {
    this.initialize();
  },
};
</script>
