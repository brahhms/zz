<template>
  <div class="cliente">
    <v-data-table
      :headers="headers"
      :items="allClientes"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CLIENTES</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Cliente
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }} Cliente</span>
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
                      <v-text-field
                        v-model="nuevo.documento"
                        label="Documento"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        v-model="nuevo.codigoPais"
                        :items="codigos"
                        label="Codigo"
                        return-object
                        item-text="codigo"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-model="nuevo.telefono"
                        label="Telefono"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="nuevo.direccion"
                        label="Direccion"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1"  text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" depressed dark text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Desea eliminar esta cliente?</v-card-title
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

      <template v-slot:item.telefono="{ item }">
        <span v-if="item.codigoPais != null"
          >{{ item.codigoPais.codigo }} {{ item.telefono }}</span
        >
        <span v-else>{{ item.telefono }}</span>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>



<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions, mapMutations } = createNamespacedHelpers(
  "cliente"
);
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
        text: "Documento",
        align: "start",
        sortable: false,
        value: "documento",
      },
      {
        text: "Telefono",
        align: "start",
        sortable: false,
        value: "telefono",
      },
      {
        text: "Direccion",
        align: "start",
        sortable: false,
        value: "direccion",
      },

      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
    ...mapGetters(["clientes", "nuevoCliente", "codigos"]),
    allClientes: {
      set(clientes) {
        return clientes;
      },
      get() {
        return this.clientes;
      },
    },
    nuevo: {
      set(cliente) {
        this.setNuevoCliente(cliente);
        return cliente;
      },
      get() {
        return this.nuevoCliente;
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
      "getClientes",
      "updateCliente",
      "saveCliente",
      "deleteCliente",
    ]),
    ...mapMutations(["iniciarCliente", "setNuevoCliente"]),
    async initialize() {
      await this.getClientes();
    },

    editItem(item) {
      this.editedIndex = this.clientes.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.clientes.indexOf(item);
      this.nuevo = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteCliente();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciarCliente();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciarCliente();
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        //editar
        await this.updateCliente();
      } else {
        //guardar
        await this.saveCliente();
      }
      this.close();
    },
  },
};
</script>