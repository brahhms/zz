<template>
  <div class="material">
    <v-data-table
      :headers="headers"
      :items="materiales"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>MATERIAL</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="400px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Material
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
                >Desea eliminar este material?</v-card-title
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
const {
  mapGetters,
  mapActions,
  mapMutations: mapMutationsMaterial,
} = createNamespacedHelpers("material");
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
        text: "Colores",
        align: "start",
        sortable: false,
        value: "colores",
      },
      {
        text: "Default color",
        align: "start",
        sortable: false,
        value: "defaultColor",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    colores: [
      "negro",
      "gena",
      "corinto",
      "rosa vieja",
      "azul",
      "rojo",
      "beige",
      "mostaza",
      "uva",
      "naranja",
      "rosado",
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Material" : "Editar Material";
    },
    ...mapGetters(["materiales", "nuevoMaterial"]),
    allMateriales: {
      set(materiales) {
        return materiales;
      },
      get() {
        return this.materiales;
      },
    },
    nuevo: {
      set(material) {
        this.setNuevoMaterial(material);
        return material;
      },
      get() {
        return this.nuevoMaterial;
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
    ...mapActions([
      "getMateriales",
      "updateMaterial",
      "saveMaterial",
      "deleteMaterial",
    ]),
    ...mapMutationsMaterial(["iniciarMaterial", "setNuevoMaterial"]),
    ...mapMutations(["mostrarMsj"]),
    async initialize() {
      await this.getMateriales();
    },
    editItem(item) {
      this.editedIndex = this.materiales.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.materiales.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deleteMaterial();
      if (res) {
        this.mostrarMsj("Material eliminado!");
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarMaterial();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarMaterial();
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        //editar
        let res = this.updateMaterial();
        if (res) {
          this.mostrarMsj("Material modificado!");
        }
      } else {
        //guardar

        let res = this.saveMaterial();
        if (res) {
          this.mostrarMsj("Material guardado!");
        }
      }
      this.close();
    },
  },
};
</script>