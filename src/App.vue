<template>
  <v-app>
    <v-app-bar v-if="showBar" app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn
          style="
            text-transform: none !important;
            font-size: 32px;
            font-weight: bold;
          "
          plain
          text
          dark
          link
          x-large
          :to="{ name: 'Home' }"
          >Fuentes</v-btn
        >
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
        <!--dddddddddd-->

        <v-navigation-drawer v-model="drawer" absolute temporary>
          <v-list-item link :to="{ name: 'Home' }">
            <v-list-item-avatar>
              <v-img
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title><b> Home</b></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item v-if="!isEmpty" link :to="{ name: 'NuevoPedido' }">
              <v-list-item-icon>
                <v-icon></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Ultimo pedido en borrador</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              link
              :to="{ name: item.name }"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <!--fffffff-->
        <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
          {{ snackbar.msj }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="snackbar.show = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers, mapState ,mapActions} from "vuex";
const { mapGetters } = createNamespacedHelpers("pedido");
export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: null,
    items: [
      { name: "Adorno", title: "Adornos", icon: "mdi-scatter-plot" },
      { name: "Avillo", title: "Avillos", icon: "mdi-scatter-plot-outline" },
      { name: "Cliente", title: "Clientes", icon: "mdi-account-box-multiple" },
      { name: "Estilo", title: "Estilos", icon: "mdi-shoe-heel" },
      { name: "Forro", title: "Forros", icon: "mdi-layers-triple" },
      { name: "Horma", title: "Hormas", icon: "mdi-shoe-formal" },
      { name: "Linea", title: "Lineas", icon: "mdi-equal" },
      { name: "Material", title: "Materiales", icon: "mdi-layers-outline" },
      { name: "Plantilla", title: "Plantillas", icon: "mdi-shore" },
      { name: "Suela", title: "Suelas", icon: "mdi-shoe-print" },
      { name: "Talla", title: "Tallas", icon: "mdi-format-list-numbered" },
    ],
  }),
  computed: {
    ...mapState(["showBar", "snackbar"]),
    ...mapGetters(["isEmpty", "semanaSeleccionada"]),
  },

  created() {

  },
};
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>