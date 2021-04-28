<template>
  <div>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Estilos</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-dialog
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          v-model="dialog"
        >
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
            <v-btn color="primary" depressed dark class="mb-2"> Imgs </v-btn>
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
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="rendimiento por yarda"
                      v-model="nuevo.rendimientoPorYarda"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="capeyada"
                      v-model="nuevo.capeyada"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-file-input
                      label="Imagen"
                      show-size
                      small-chips
                      truncate-length="9"
                      v-model="nuevo._attachments"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-data-table
                      :headers="adornoHeaders"
                      :items="nuevo.avillos"
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
                        <v-text-field
                          type="number"
                          v-model="item.cantidad"
                        ></v-text-field>
                      </template>

                      <template v-slot:no-data>
                        <v-btn color="primary" @click="iniciarEstilo">
                          Reset
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>

                  <v-col cols="6">
                    <v-data-table
                      :headers="adornoHeaders"
                      :items="nuevo.adornos"
                      class="elevation-1"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:top>
                        <v-toolbar flat>
                          <v-toolbar-title>Adornos</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                        </v-toolbar>
                      </template>

                      <template v-slot:item.cantidad="{ item }">
                        <v-text-field
                          type="number"
                          v-model="item.cantidad"
                        ></v-text-field>
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
            <template v-slot:item.codigo="{ item }">
              {{ item.linea.nombre }}{{ item.correlativo }}
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
          <v-container v-else fluid>
            <v-row dense>
              <v-col v-for="card in cards" :key="card.title" :cols="card.flex">
                <v-card>
                  <v-img
                    :key="card.rev"
                    :src="card.src"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                  >
                    <v-card-title v-text="card.title"></v-card-title>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>




<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters, mapMutations } = createNamespacedHelpers(
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
          width: 2,
        },
        {
          text: "Unidad",
          align: "start",
          sortable: false,
          value: "unidad",
        },
      ],
      estiloHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "codigo",
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
      cards: [],
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
      "actualizarAvillos"
    ]),
    ...mapMutations(["setNuevoEstilo"]),
    changeLinea(linea){
      this.generarCorrelativo(linea.nombre);
      this.actualizarAvillos(linea);
    },
    async save() {
      if (this.editedIndex > -1) {
        //editar
        await this.updateEstilo();
      } else {
        //guardar
        await this.saveEstilo();
      }
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
      console.log(item.linea.nombre);
      this.editedIndex = this.estilos.indexOf(item);
      this.nuevo = item;
      console.log(this.nuevo.linea);
      this.dialog = true;
    },
    async initialize() {
      await this.getEstilos();

      this.iniciarEstilo();

      this.cards = this.estilos.map((item) => {
        return {
          title: item.codigo,
          src: `http://localhost:5984/zapp-estilos/${item._id}/img`,
          flex: 3,
          rev: item._rev,
        };
      });
    },
  },
  computed: {
    ...mapGetters(["nuevoEstilo", "lineas", "estilos"]),
    nuevo: {
      set(estilo) {
        this.setNuevoEstilo(estilo);
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
            if (estilo.linea._id == this.lineas[this.tab]._id) {
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

  created() {
    this.initialize();
  },
};
</script>
