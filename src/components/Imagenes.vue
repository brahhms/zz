<template>
          <v-container fluid>
            <v-row dense>
              <v-col v-for="card in cards" :key="card.index" :cols="card.flex">
                <v-card>
                  <v-img
                    
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

  
</template>


<script>
//import { mapMutations } from "vuex";

import axios from "axios";
import credentials from "../store/modules/credentials.js";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("estilo");

export default {
  data() {
    return {
      cards: [],
    };
  },
  methods: {
    ...mapActions(["getEstilos"]),

    async initialize() {
      await this.getEstilos();

      const data = await axios.all(
        this.allEstilos.map((item) => {
          return axios.get(
            `http://localhost:5984/zapp-estilos/${item._id}/img`,
            {
              auth: credentials.authentication.auth,
              responseType: "blob",
              title: item.codigo,
            },
            credentials.authentication
          );
        })
      );

      this.cards = [];
      data.forEach((res) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          let imageDataUrl = reader.result;
          this.cards.push({
            src: imageDataUrl,
            title: res.config.title,
            flex: 3,
          });
        };
      });
    },
  },

  computed: {
    ...mapGetters(["estilos"]),
    allEstilos() {
      return this.estilos.filter((es) => es._attachments != undefined);
    },
  },
  created() {
    this.initialize();

  },
};
</script>

