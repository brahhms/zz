<template>
  <div class="plantilla">
    <v-data-table
      :headers="headers"
      :items="allPlantillas"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>PLANTILLAS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog scrollable persistent v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva Plantilla
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="nueva.nombre"
                        label="Nombre"
                      ></v-text-field>
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
                          <v-btn color="primary" @click="iniciarPlantilla()">
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
                >Desea eliminar esta plantilla?</v-card-title
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
    </v-data-table>
  </div>
</template>



<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const {
  mapGetters,
  mapActions,
  mapMutations: mapMutationsPlantilla,
} = createNamespacedHelpers("plantilla");
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "nombre",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    avillosHeaders: [
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
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Plantilla" : "Editar Plantilla";
    },
    ...mapGetters(["plantillas", "nuevaPlantilla", "avillos"]),
    allPlantillas: {
      set(plantillas) {
        return plantillas;
      },
      get() {
        return this.plantillas;
      },
    },
    nueva: {
      set(plantilla) {
        this.setNuevaPlantilla(plantilla);
        return plantilla;
      },
      get() {
        return this.nuevaPlantilla;
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
              if (e.cantidadInicial!=0) {
                  numero = Number(1 / e.cantidadInicial);
              }else{
                numero=0;
              }
            
            } else {
              numero =
                Number(e.cantidadInicial) *
                Number(e.unidadConversion.constante);
            }

            e.cantidad = numero.toFixed(4);
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
      "getPlantillas",
      "updatePlantilla",
      "savePlantilla",
      "deletePlantilla",
      "iniciarPlantilla",
    ]),
    ...mapMutationsPlantilla(["setNuevaPlantilla"]),
    ...mapMutations(["mostrarMsj"]),
    async initialize() {
      await this.getPlantillas();
      await this.iniciarPlantilla();
    },

    editItem(item) {
      this.editedIndex = this.plantillas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.plantillas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deletePlantilla();
      if (res) {
        this.mostrarMsj("Plantilla eliminada!");
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarPlantilla();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarPlantilla();
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        //editar
        let res = await this.updatePlantilla();
        if (res) {
          this.mostrarMsj("Plantilla modificada!");
        }
      } else {
        //guardar
        let res = await this.savePlantilla();
        if (res) {
          this.mostrarMsj("Plantilla guardada!");
        }
      }
      this.close();
    },
  },
};
</script>