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
          <v-dialog persistent v-model="dialog" max-width="500px">
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
                      <v-checkbox
                        label="Tacon"
                        v-model="nueva.tacon"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-data-table
                        :headers="avillosHeaders"
                        :items="avillos"
                        class="elevation-1"
                        disable-pagination
                        hide-default-footer
                        show-select
                        item-key="nombre"
                        v-model="nueva.avillos"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title>Avillos</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                        </template>   

                        <template v-slot:no-data>
                          <v-btn color="primary" @click="iniciarPlantilla">
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
      <template v-slot:item.tacon="{ item }">
        <v-simple-checkbox v-model="item.tacon" disabled></v-simple-checkbox>
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
      {
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "tacon",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    avillosHeaders:[
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        }
      ],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva" : "Editar";
    },
    ...mapGetters(["plantillas", "nuevaPlantilla","avillos"]),
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
  },

  created() {
    this.initialize();

  },

  methods: {
    ...mapActions(["getPlantillas", "updatePlantilla", "savePlantilla", "deletePlantilla","iniciarPlantilla"]),
    ...mapMutationsPlantilla([ "setNuevaPlantilla"]),
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