<template>
  <div class="forro">
    <v-data-table
      :headers="headers"
      :items="forros"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>FORROS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Forro
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
                        v-model="nuevo.nombre"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        v-model="nuevo.colores"
                        :items="colores"
                        label="Colores"
                        multiple
                        chips
                      ></v-combobox>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-if="nuevo.colores"
                        :items="nuevo.colores"
                        v-model="nuevo.defaultColor"
                        label="Color default"
                      ></v-select>
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
                >Desea eliminar este forro?</v-card-title
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
      <template v-slot:item.colores="{ item }">
        <div v-if="item.colores">
          <v-chip v-for="color in item.colores" :key="color">{{
            color
          }}</v-chip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>



<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
const { mapGetters, mapActions, mapMutations:mapMutationsForro } = createNamespacedHelpers("forro");
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
        text: "Default color",
        align: "start",
        sortable: false,
        value: "defaultColor",
      },
      {
        text: "Colores",
        align: "start",
        sortable: false,
        value: "colores",
      },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    colores:[
      "negro",
      "gun"
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
    ...mapGetters(["forros", "nuevoForro"]),
    allForros: {
      set(forros) {
        return forros;
      },
      get() {
        return this.forros;
      },
    },
    nuevo: {
      set(forro) {
        this.setNuevoForro(forro);
        return forro;
      },
      get() {
        return this.nuevoForro;
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
    ...mapActions(["getForros", "updateForro", "saveForro", "deleteForro"]),
    ...mapMutationsForro(["iniciarForro", "setNuevoForro"]),
    ...mapMutations(["mostrarMsj"]),
    async initialize() {
      await this.getForros();
    },
    editItem(item) {
      this.editedIndex = this.forros.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.forros.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deleteForro();
      if (res) {
          this.mostrarMsj("Forro eliminado!");
        }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarForro();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarForro();
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        //editar
        let res = this.updateForro();
        if (res) {
          this.mostrarMsj("Forro modificado!");
        }
      } else {
        //guardar

        let res = this.saveForro();
        if (res) {
          this.mostrarMsj("Forro guardado!");
        }
      }
      this.close();
    },
  },
};
</script>