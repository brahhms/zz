<template>
  <tr>
    <td>
      <v-edit-dialog>
        <span v-if="detalle.estilo != null"
          >{{ detalle.estilo.linea.nombre
          }}{{ detalle.estilo.correlativo }}</span
        >
        <span v-else>[estilo]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              v-model="detalle.estilo"
              required
              :rules="notNull"
              label="codigo"
              :items="estilos"
              clearable
              dense
              filled
              rounded
              return-object
              @change="validarPedido()"
            >
              <template v-slot:selection="data">
                {{ data.item.linea.nombre }}{{ data.item.correlativo }}
              </template>
              <template v-slot:item="data">
                {{ data.item.linea.nombre }}{{ data.item.correlativo }}
              </template>
            </v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>
    <!--material-->
    <td>
      <v-edit-dialog>
        <span v-if="detalle.detalleMaterial.material != null">{{
          detalle.detalleMaterial.material.nombre
        }}</span>
        <span v-else>[material] : </span>
        <span v-if="detalle.detalleMaterial.color != null">
          {{ detalle.detalleMaterial.color }}</span
        >
        <span v-else>[color]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              v-model="detalle.detalleMaterial.material"
              required
              label="material"
              :items="materiales"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
              return-object
              :rules="notNull"
            >
              <template v-slot:item="{ item }">
                {{ item.nombre }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.nombre }}
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-if="detalle.detalleMaterial.material != null"
              v-model="detalle.detalleMaterial.color"
              label="color"
              :items="detalle.detalleMaterial.material.colores"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
            ></v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <!--material tacon-->
    <td>
      <v-edit-dialog>
        <span v-if="detalle.detalleTacon.material != null">{{
          detalle.detalleTacon.material.nombre
        }}</span>
        <span v-else>[material] : </span>
        <span v-if="detalle.detalleTacon.color != null">
          {{ detalle.detalleTacon.color }}</span
        >
        <span v-else>[color]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              v-model="detalle.detalleTacon.material"
              required
              label="material"
              :items="materiales"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
              return-object
              :rules="notNull"
            >
              <template v-slot:item="{ item }">
                {{ item.nombre }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.nombre }}
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-if="detalle.detalleTacon.material != null"
              v-model="detalle.detalleTacon.color"
              label="color"
              :items="detalle.detalleTacon.material.colores"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
            ></v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <!--tallas-->
    <td>
      <v-dialog>
        <template v-slot:activator="{ on }">
          <v-container class="d-flex flex-row" v-on="on">
            <div
              class="pa-1"
              v-for="t in detalle.detalleTallas"
              :key="t.talla._id"
            >
              <v-chip color="primary" v-if="t.cantidad > 0"
                >{{ t.cantidad }}/{{ t.talla.nombre }}</v-chip
              >
              <v-chip v-else color="gray"
                >{{ t.cantidad }}/{{ t.talla.nombre }}</v-chip
              >
            </div>
          </v-container>
        </template>
        <selector-talla :detalleTallas="detalle.detalleTallas"></selector-talla>
      </v-dialog>
    </td>

    <!--horma-->
    <td>
      <v-edit-dialog>
        <span v-if="detalle.horma != null">{{ detalle.horma.nombre }}</span>
        <span v-else>[horma]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              :rules="notNull"
              v-model="detalle.horma"
              label="horma"
              :items="hormas"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
              return-object
            >
              <template v-slot:item="{ item }">
                {{ item.nombre }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.nombre }}
              </template>
            </v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <td>
      <v-edit-dialog>
        <span v-if="detalle.detalleForro.forro != null">{{
          detalle.detalleForro.forro.nombre
        }}</span>
        <span v-else>[forro] : </span>
        <span v-if="detalle.detalleForro.color != null">
          {{ detalle.detalleForro.color }}</span
        >
        <span v-else>[color]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              :rules="notNull"
              v-model="detalle.detalleForro.forro"
              label="forro"
              :items="forros"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
              return-object
            >
              <template v-slot:item="{ item }">
                {{ item.nombre }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.nombre }}
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-if="detalle.detalleForro.forro != null"
              v-model="detalle.detalleForro.color"
              label="color"
              :items="detalle.detalleForro.forro.colores"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
            ></v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <td>
      <v-edit-dialog>
        <span v-if="detalle.detalleSuela.suela != null">
          {{ detalle.detalleSuela.suela.nombre }}</span
        >
        <span v-else>[suela] : </span>
        <span v-if="detalle.detalleSuela.color != null">
          {{ detalle.detalleSuela.color }}</span
        >
        <span v-else>[color]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              :rules="notNull"
              v-model="detalle.detalleSuela.suela"
              label="suela"
              :items="suelas"
              clearable
              dense
              filled
              rounded
              item-text="nombre"
              return-object
            >
              <template v-slot:item="{ item }">
                {{ item.nombre }}
              </template>
              <template v-slot:selection="{ item }">
                {{ item.nombre }}
              </template>
            </v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <td>
      <v-chip>{{ detalle.subtotal }}</v-chip>
    </td>

    <td>
      <v-row>
        <v-icon small @click="duplicateDetalle(detalle)">
          mdi-content-duplicate
        </v-icon>
        <v-spacer></v-spacer>
        <v-icon small @click="removeDetalle(detalle)"> mdi-delete </v-icon>
      </v-row>
    </td>
  </tr>
</template>

<script>
import SelectorTalla from "../components/SelectorTalla.vue";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("pedido");

export default {
  props: [
    "detalle",
    "estilos",
    "materiales",
    "tallas",
    "forros",
    "suelas",
    "hormas",
  ],
  components: {
    SelectorTalla,
  },
  data: () => ({
    notNull: [(v) => !!v || "" || "Este campo es requerido"],
    selected: {
      estilo: null,
    },
  }),
  methods: {
    ...mapMutations(["validarPedido", "removeDetalle", "duplicateDetalle"]),
  },

  watch: {
    "detalle.detalleTallas": {
      handler(newVal) {
        let subtotal = 0;
        newVal.forEach((talla) => {
          subtotal += talla.cantidad;
        });
        this.detalle.subtotal = subtotal;
      },
      deep: true,
    },

    "detalle.detalleMaterial.material"(newVal, oldVal) {
      try {
        if (newVal._id != oldVal._id) {
          this.detalle.detalleMaterial.color = newVal.defaultColor;
        }
      } catch (error) {
        console.log("material null");
      }
      if (newVal == null) {
        this.detalle.detalleMaterial.color = null;
      }
    },
    "detalle.detalleForro.forro"(newVal, oldVal) {
      try {
        if (newVal._id != oldVal._id) {
          this.detalle.detalleForro.color = newVal.defaultColor;
        }
      } catch (error) {
        console.log("forro null");
      }
      if (newVal == null) {
        this.detalle.detalleForro.color = null;
      }
    },
    "detalle.detalleSuela.suela"(newVal, oldVal) {
      try {
        if (newVal._id != oldVal._id) {
          this.detalle.detalleSuela.color = newVal.defaultColor;
        }
      } catch (error) {
        console.log("suela null");
      }
      if (newVal == null) {
        this.detalle.detalleSuela.color = null;
      }
    },

    detalle: {
      handler(newVal) {
        this.validarPedido();

        if (
          newVal.detalleMaterial.color == null &&
          newVal.detalleMaterial.material != null
        ) {
          this.detalle.detalleMaterial.color =
            newVal.detalleMaterial.material.defaultColor;
        }
        if (
          newVal.detalleForro.color == null &&
          newVal.detalleForro.forro != null
        ) {
          this.detalle.detalleForro.color =
            newVal.detalleForro.forro.defaultColor;
        }
        if (
          newVal.detalleSuela.color == null &&
          newVal.detalleSuela.suela != null
        ) {
          this.detalle.detalleSuela.color =
            newVal.detalleSuela.suela.defaultColor;
        }
      },
      deep: true,
    },
  },
  computed: {},

  created() {
    this.detalle;
  },
};
</script>
