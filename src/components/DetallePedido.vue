<template>
  <tr v-if="detalle.cloned" class="cloned">
    <td>
      <v-edit-dialog :key="detalle.estilo.codigo">
        <span
          v-if="detalle.estilo != null"
          v-bind:class="{
            changed: detalle.clonedFrom.estilo.codigo != detalle.estilo.codigo,
          }"
          >{{ detalle.estilo.linea.nombre }}{{ detalle.estilo.correlativo }}
        </span>
        <span v-else>[estilo]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              v-model="detalle.estilo"
              item-text="codigo"
              required
              :rules="notNull"
              label="codigo"
              :items="estilos"
              dense
              filled
              rounded
              return-object
              @change="changeEstilo()"
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
        <span
          v-if="detalle.detalleMaterial.material != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleMaterial.material.nombre !=
              detalle.detalleMaterial.material.nombre,
          }"
          >{{ detalle.detalleMaterial.material.nombre }}</span
        >
        <span v-else>[material] : </span>
        <span
          v-if="detalle.detalleMaterial.color != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleMaterial.color !=
              detalle.detalleMaterial.color,
          }"
        >
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
      <v-edit-dialog v-if="isTacon">
        <span
          v-if="
            detalle.detalleTacon.material != null &&
            detalle.detalleTacon.material != ''
          "
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleTacon.material.nombre !=
              detalle.detalleTacon.material.nombre,
          }"
          >{{ detalle.detalleTacon.material.nombre }}</span
        >
        <span v-else>[material] : </span>
        <span
          v-if="detalle.detalleTacon.color != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleTacon.color !=
              detalle.detalleTacon.color,
          }"
        >
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
              <v-chip
                v-if="t.cantidad > 0"
                :color="
                  JSON.stringify(detalle.detalleTallas) !==
                  JSON.stringify(detalle.clonedFrom.detalleTallas)
                    ? 'warning'
                    : 'primary'
                "
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
      <v-edit-dialog :key="detalle.horma.nombre">
        <span
          v-if="detalle.horma != null"
          v-bind:class="{
            changed: detalle.clonedFrom.horma.nombre != detalle.horma.nombre,
          }"
          >{{ detalle.horma.nombre }}</span
        >
        <span v-else>[horma]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              :rules="notNull"
              v-model="detalle.horma"
              label="horma"
              :items="allHormas"
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

    <!--forro-->
    <td>
      <v-edit-dialog>
        <span
          v-if="detalle.detalleForro.forro != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleForro.forro.nombre !=
              detalle.detalleForro.forro.nombre,
          }"
          >{{ detalle.detalleForro.forro.nombre }}</span
        >
        <span v-else>[forro] : </span>
        <span
          v-if="detalle.detalleForro.color != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleForro.color !=
              detalle.detalleForro.color,
          }"
        >
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
              dense
              filled
              rounded
              item-text="nombre"
            ></v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <!--suela-->
    <td>
      <v-edit-dialog>
        <span
          v-if="detalle.detalleSuela.suela != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleSuela.suela.nombre !=
              detalle.detalleSuela.suela.nombre,
          }"
        >
          {{ detalle.detalleSuela.suela.nombre }}</span
        >
        <span v-else>[suela] : </span>
        <span
          v-if="detalle.detalleSuela.color != null"
          v-bind:class="{
            changed:
              detalle.clonedFrom.detalleSuela.color !=
              detalle.detalleSuela.color,
          }"
        >
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
              :rules="notNull"
              v-model="detalle.detalleSuela.color"
              label="color"
              :items="detalle.detalleSuela.suela.colores"
              dense
              filled
              rounded
            >
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
  <tr v-else>
    <td>
      <v-edit-dialog :key="detalle.estilo.codigo">
        <span v-if="detalle.estilo != null"
          >{{ detalle.estilo.linea.nombre }}{{ detalle.estilo.correlativo }}
        </span>
        <span v-else>[estilo]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              v-model="detalle.estilo"
              item-text="codigo"
              required
              :rules="notNull"
              label="codigo"
              :items="estilos"
              dense
              filled
              rounded
              return-object
              @change="changeEstilo()"
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
      <v-edit-dialog v-if="isTacon">
        <span
          v-if="
            detalle.detalleTacon.material != null &&
            detalle.detalleTacon.material != ''
          "
          >{{ detalle.detalleTacon.material.nombre }}</span
        >
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
      <v-edit-dialog :key="detalle.horma.nombre">
        <span v-if="detalle.horma != null">{{ detalle.horma.nombre }}</span>
        <span v-else>[horma]</span>
        <template v-slot:input>
          <v-container class="mt-3">
            <v-autocomplete
              :rules="notNull"
              v-model="detalle.horma"
              label="horma"
              :items="allHormas"
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

    <!--forro-->
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
              dense
              filled
              rounded
              item-text="nombre"
            ></v-autocomplete>
          </v-container>
        </template>
      </v-edit-dialog>
    </td>

    <!--suela-->
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
              :rules="notNull"
              v-model="detalle.detalleSuela.color"
              label="color"
              :items="detalle.detalleSuela.suela.colores"
              dense
              filled
              rounded
            >
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
const { mapMutations, mapActions, mapGetters } =
  createNamespacedHelpers("pedido");

export default {
  props: ["detalle"],
  components: {
    SelectorTalla,
  },
  data: () => ({
    notNull: [(v) => !!v || "" || "Este campo es requerido"],
    hormasSegunTacon: [],
  }),
  methods: {
    ...mapMutations(["validarPedido", "removeDetalle", "duplicateDetalle"]),
    ...mapActions(["actualizarHormas"]),
    async changeEstilo() {
      await this.validarPedido();
      if (this.detalle.estilo != null && this.detalle.cloned != true) {
        this.hormasSegunTacon = await this.actualizarHormas(
          this.detalle.estilo.linea.tacon
        );
        //this.detalle.horma = this.hormasSegunTacon[0];
        if (
          this.detalle.estilo.linea.horma != undefined &&
          this.detalle.estilo.linea.horma != null
        ) {
          this.detalle.horma = this.detalle.estilo.linea.horma;
        }
        if (
          this.detalle.estilo.linea.suela != undefined &&
          this.detalle.estilo.linea.suela != null
        ) {
          this.detalle.detalleSuela.suela = this.detalle.estilo.linea.suela;

          if (this.detalle.detalleMaterial.color == "negro") {
            this.detalle.detalleSuela.color = "negro";
          } else {
            this.detalle.detalleSuela.color =
              this.detalle.estilo.linea.suela.defaultColor;
          }
        }
      } else if (
        this.detalle.estilo.linea.tacon === true &&
        (this.detalle.detalleTacon.material !== null ||
          this.detalle.detalleTacon.color !== null)
      ) {
        this.detalle.detalleTacon.material = null;
        this.detalle.detalleTacon.color = null;
      }
    },
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
          if (this.detalle.detalleMaterial.color == "negro") {
            this.detalle.detalleSuela.color = "negro";
          } else {
            this.detalle.detalleSuela.color =
              this.detalle.detalleSuela.suela.defaultColor;
          }
        }
      } catch (error) {
        console.log("material null");
      }
      if (newVal == null) {
        this.detalle.detalleMaterial.color = null;
      }
    },
    "detalle.detalleMaterial.color"(newVal, oldVal) {
      try {
        if (newVal != oldVal) {
          if (newVal == "negro") {
            this.detalle.detalleSuela.color = "negro";
          } else if (this.detalle.detalleSuela.suela.defaultColor != "negro") {
            this.detalle.detalleSuela.color =
              this.detalle.detalleSuela.suela.defaultColor;
          } else {
            console.log("a");
            this.detalle.detalleSuela.suela.colores.forEach((color) => {
              if (color != "negro") {
                this.detalle.detalleSuela.color = color;
              }
            });
          }
          if (this.detalle.estilo.linea.tacon) {
            this.detalle.detalleTacon.color = newVal;
          }
        }
      } catch (error) {
        console.log("material null");
      }
      if (newVal == null) {
        this.detalle.detalleMaterial.color = null;
      }
    },
    "detalle.detalleTacon.material"(newVal, oldVal) {
      try {
        if (newVal._id != oldVal._id) {
          this.detalle.detalleTacon.color = newVal.defaultColor;
        }
      } catch (error) {
        console.log("tacon null");
      }
      if (newVal == null) {
        this.detalle.detalleTacon.color = null;
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
          if (this.detalleMaterial.color == "negro") {
            this.detalle.detalleSuela.color == "negro";
          } else {
            this.detalle.detalleSuela.color = newVal.defaultColor;
          }
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
          newVal.detalleTacon.color == null &&
          newVal.detalleTacon.material != null
        ) {
          this.detalle.detalleTacon.color =
            newVal.detalleTacon.material.defaultColor;
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
  computed: {
    ...mapGetters([
      "hormas",
      "estilos",
      "materiales",
      "suelas",
      "tallas",
      "forros",
      "semanaSeleccionada",
    ]),
    isTacon() {
      if (this.detalle.estilo != null) {
        return this.detalle.estilo.linea.tacon;
      } else {
        this.detalle.detalleTacon.material = null;
        this.detalle.detalleTacon.color = null;
        return false;
      }
    },
    allHormas() {
      if (this.hormasSegunTacon.length > 0) {
        return this.hormasSegunTacon;
      } else if (this.detalle.estilo != null) {
        return this.hormas.filter(
          (h) => h.paraTacon == this.detalle.estilo.linea.tacon
        );
      } else {
        return this.hormas;
      }
    },
  },
};
</script>

<style scoped>
.cloned {
  color: gray;
}

.changed {
  color: orange !important;
}
</style>
