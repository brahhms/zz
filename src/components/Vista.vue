<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ viewName }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Desea eliminar este elemento?</v-card-title
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

        <v-dialog scrollable persistent v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Crear {{ title }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <slot></slot>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"  :disabled="!isValid"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="removeItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>

    <template v-slot:item.unidad="{ item }">
      {{ item.unidad.nombre }}
    </template>
    <template v-slot:item.colorSegunMaterial="{ item }">
      <v-simple-checkbox
        v-model="item.colorSegunMaterial"
        disabled
      ></v-simple-checkbox>
    </template>

    <template v-slot:item.colores="{ item }">
      <div v-if="item.colores">
        <v-chip v-for="color in item.colores" :key="color">{{ color }}</v-chip>
      </div>
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
    <template v-slot:item.paraTacon="{ item }">
      <v-simple-checkbox v-model="item.paraTacon" disabled></v-simple-checkbox>
    </template>
    <template v-slot:item.colorSegunSuela="{ item }">
      <v-simple-checkbox
        v-model="item.colorSegunSuela"
        disabled
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.predeterminado="{ item }">
      <v-simple-checkbox
        v-model="item.predeterminado"
        disabled
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.img="{ item }">
      <v-chip v-if="item._attachments"> imagen</v-chip>
      <span v-else>sin imagen</span>
    </template>
    <template v-slot:item.correlativo="{ item }">
      {{ item.codigo }}
    </template>
  </v-data-table>
</template>



<script>
import { mapMutations } from "vuex";
export default {
  props: [
    "title",
    "viewName",
    "headers",
    "items",
    "initialize",
    "setNuevoItem",
    "iniciar",
    "updateItem",
    "saveItem",
    "deleteItem",
    "isValid"
  ],
  data: () => ({
    dialogDelete: false,
    dialog: false,
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Crear " + this.title
        : "Editar " + this.title;
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

  methods: {
    ...mapMutations(["mostrarMsj"]),

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.setNuevoItem({ ...item });
      this.dialog = true;
    },

    removeItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.setNuevoItem(item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let res = await this.deleteItem();
      if (res) {
        this.mostrarMsj("Se ha eliminado exitosamente!");
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.iniciar();
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.iniciar();
        this.editedIndex = -1;
      });
    },

    async save() {
      let res;
      if (this.editedIndex > -1) {
        //editar
        res = await this.updateItem();
        if (res) {
          this.mostrarMsj("Se ha modificado exitosamente!");
        }
      } else {
        //guardar
        res = await this.saveItem();
        if (res) {
          this.mostrarMsj("Se ha creado exitosamente!");
        }
      }

      this.close();
    },
  },
};
</script>