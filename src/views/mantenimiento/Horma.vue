<template>
  <div class="horma">
    <v-data-table
      :headers="headers"
      :items="allHormas"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>HORMAS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva Horma
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
                    <v-col>
                      <v-checkbox
                        label="Horma para tacon?"
                        v-model="nueva.paraTacon"
                      ></v-checkbox>
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
                >Desea eliminar esta horma?</v-card-title
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
      <template v-slot:item.paraTacon="{ item }">
        <v-simple-checkbox
          v-model="item.paraTacon"
          disabled
        ></v-simple-checkbox>
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
  mapMutations: mapMutationsHorma,
} = createNamespacedHelpers("horma");
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
        text: "Tacon",
        align: "start",
        sortable: false,
        value: "paraTacon",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Horma" : "Editar Horma";
    },
    ...mapGetters(["hormas", "nuevaHorma"]),
    allHormas: {
      set(hormas) {
        return hormas;
      },
      get() {
        return this.hormas;
      },
    },
    nueva: {
      set(horma) {
        this.setNuevaHorma(horma);
        return horma;
      },
      get() {
        return this.nuevaHorma;
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
    ...mapActions(["getHormas", "updateHorma", "saveHorma", "deleteHorma"]),
    ...mapMutationsHorma(["iniciarHorma", "setNuevaHorma"]),
    ...mapMutations(["mostrarMsj"]),
    async initialize() {
      await this.getHormas();
    },

    editItem(item) {
      this.editedIndex = this.hormas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.hormas.indexOf(item);
      this.nueva = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deleteHorma();
      if (res) {
        this.mostrarMsj("Horma eliminada!");
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarHorma();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarHorma();
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        //editar
        let res = await this.updateHorma();
        if (res) {
          this.mostrarMsj("Horma modificada!");
        }
      } else {
        //guardar
        let res = await this.saveHorma();
        if (res) {
          this.mostrarMsj("Horma guardada!");
        }
      }
      this.close();
    },
  },
};
</script>