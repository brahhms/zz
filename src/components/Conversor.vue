<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    disable-pagination
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar dense color="primary" dark flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
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
            :append-icon="item.icon"
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
          <v-text-field disabled v-model="item.cantidad"></v-text-field>
        </v-col>
      </v-row>
    </template>

    <template v-slot:item.unidad="{ item }">
      {{ item.unidad.nombre }}
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="update"> Reset </v-btn>
    </template>
  </v-data-table>
</template>



<script>
export default {
  props: ["items", "title", "update"],
  data() {
    return {
      headers: [
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
    };
  },
  methods: {
    reset() {},
  },

  watch: {
    items: {
      handler(newVal) {
        newVal.forEach((e) => {
          if (e.cantidadInicial != null) {
            let numero = 0;
            if (e.unidadConversion.constante == null) {
              if (e.cantidadInicial != 0) {
                numero = Number(1 / e.cantidadInicial);
              } else {
                numero = 0;
              }
            } else {
              numero =
                Number(e.cantidadInicial) *
                Number(e.unidadConversion.constante);
            }

            e.cantidad = Number(numero.toFixed(4));
          }
        });
      },
      deep: true,
    },
  },

  computed: {},
  created() {},
};
</script>