<template>
  <v-container>
    <v-data-table :headers="headers" :items="[1]" hide-default-footer>
      <template v-slot:item>
        <tr>
          <td v-for="t in detalleTallas" :key="t.talla._id">
            <v-text-field
              v-model.lazy.number="t.cantidad"
              flat
              hide-details
              dense
             min="0"
             max="99"
             step="1"
              type="number"
              oninput="this.value=this.value.replace(/[^0-9]/g,'');"
              :rules="rules"
            ></v-text-field>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>



<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("pedido");

export default {
  props: ["detalleTallas"],
  data() {
    return {
      rules:[
         value => {
          const pattern = /^[0-9]+/
          return pattern.test(value) || 'Invalid integer'
        }
      ]
    };
  },
  methods: {},

  watch:{
    detalleTallas:{
      deep:true,
      handler(newVal){
        newVal.forEach(element => {
          element.cantidad = (element.cantidad=="" || element.cantidad==null)?0:element.cantidad;          
        });
      }
    }
  },

  computed: {
    ...mapGetters(["tallas"]),
    headers() {
      let lista = [];
      this.tallas.forEach((element) => {
        lista.push({
          text: element.nombre,
          align: "center",
          sortable: false,
          value: element.nombre,
          width: 5,
          divider: true,
        });
      });

      return lista;
    },
  },
  created() {},
};
</script>