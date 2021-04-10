<template>
  <div class="forro">
    <v-data-table
      :headers="headers"
      :items="items"
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
                        v-model="editedItem.nombre"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        v-model="editedItem.colores"
                        :items="colores"
                        label="Colores"
                        multiple
                        chips
                      ></v-combobox>
                    </v-col>

                    <v-col cols="12">
                      <v-select
                        v-if="editedItem.colores"
                        :items="editedItem.colores"
                        v-model="editedItem.defaultColor"
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
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("forro");
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
    items: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      defaultColor: "",
      colores: [],
    },
    defaultItem: {
      nombre: "",
      defaultColor: "",
      colores: [],
    },
    colores: [
      "azul",
      "verde",
      "rojo",
      "cafe",
      "negro",
      "blanco",
      "morado",
      "celeste",
      "gris",
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
    ...mapGetters(["forros"]),
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
    this.cargarDatos();
  },

  methods: {
    ...mapActions(["getForros", "updateForro", "saveForro", "deleteForro"]),
    async cargarDatos() {
      await this.getForros();
      this.initialize();
    },
    initialize() {
      this.items = this.forros.map((forro) => {
        return {
          _id: forro._id,
          _rev: forro._rev,
          nombre: forro.nombre,
          defaultColor: forro.defaultColor,
          colores: forro.colores,
        };
      });
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteForro(this.editedItem);
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        //editar
        Object.assign(this.items[this.editedIndex], this.editedItem);
        this.updateForro(this.editedItem);
      } else {
        //guardar
        this.items.push(this.editedItem);
        console.log(this.editedItem);
        this.saveForro(this.editedItem);
      }
      this.close();
    },
  },
};
</script>