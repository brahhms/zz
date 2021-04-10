<template>
  <v-card class="mx-auto" max-width="500" flat>
    <v-card-title class="title font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
    
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-autocomplete
            clearable
            label="Cliente"
            :items="clientes"
            v-model="clienteSeleccionado"
            item-text="nombre"
            required
            return-object
          >
            <v-icon slot="prepend" color="primary"> mdi-account </v-icon>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="
              step++;
              clienteSeleccionado = null;
            "
          >
            Crear Nuevo Cliente
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              :rules="nombreRules"
              label="Nombre"
              v-model="clienteForm.nombre"
              type="text"
              required
            ></v-text-field>
            <v-text-field
              :rules="telefonoRules"
              label="Telefono"
              v-model="clienteForm.telefono"
              type="text"
            ></v-text-field>
            <v-text-field
              :rules="descripcionRules"
              label="Direccion"
              v-model="clienteForm.direccion"
              type="text"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="cancelar()"> Regresar </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!valid"
            depressed
            @click="guardarCliente(clienteForm)"
          >
            Crear
          </v-btn>
        </v-card-actions>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("cliente");
const {
  mapMutations: pedidoMapMutations,
  mapGetters,
} = createNamespacedHelpers("pedido");

export default {
  data: () => ({
    valid: false,
    nombreRules: [
      (v) => !!v || "Nombre es requerido",
      (v) =>
        (v && v.length <= 12) || "Nombre debe contener menos de 12 caracteres",
    ],
    telefonoRules: [v => ((v == null || v=='') || (!isNaN(v) && v>20000000 && v<80000000 ))  || 'Debe introducir un numero valido'],
    descripcionRules: [],
    step: 1,
    clienteForm:{nombre:'',telefono:'',direccion:''}

  }),

  computed: {
    ...mapState(["snackbar"]),
    ...mapGetters(["clientes","cliente"]),
    clienteSeleccionado:{
      get(){
        return this.cliente;
      },
      set(cliente){
        this.setCliente(cliente);
        return cliente;
      }
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Selecciona un Cliente";
        case 2:
          return "Crea un Cliente Nuevo";
        default:
          return "";
      }
    },
  },
  methods: {
    ...mapActions(["saveCliente"]),
    ...pedidoMapMutations(["setCliente"]),
    validate() {
      this.valid = this.$refs.form.validate();
      console.log("form valid? " + this.valid);
    },
    cancelar() {
      this.step--;
      this.$refs.form.reset()
    },

    async guardarCliente(cliente) {
      this.validate();
      if (!this.valid) return;
      const res = await this.saveCliente(cliente);

      if (res.data.ok) {
        this.clienteSeleccionado = cliente;
        this.snackbar.msj = "Cliente guardado!";
        this.snackbar.show = true;
      }
    },
  },
  created() {},
  mounted() {},
};
</script>