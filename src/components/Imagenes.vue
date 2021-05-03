<template>
  <div>
    <img id="myImage"  />
  </div>
</template>


<script>
//import { mapMutations } from "vuex";

import axios from "axios";
import credentials from "../store/modules/credentials.js";

export default {
  components: {},
  data() {
    return {
      cards: [],
    };
  },
  methods: {
    async getImgs() {
      const response = await axios.get(
        `http://localhost:5984/zapp-estilos/2138c18002b1efff98e720cbff01e341/img`,
        {
          auth: credentials.authentication.auth,
          responseType: "blob",
        },
        credentials.authentication
      );

      let reader = new window.FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = function () {
        let imageDataUrl = reader.result;
        let img = document.getElementById("myImage");
        img.setAttribute("src", imageDataUrl);
      };
    },
  },

  computed: {},
  created() {
    this.getImgs();
    /*this.cards = this.estilos.map((item) => {
      return {
        title: item.codigo,
        src: `http://localhost:5984/zapp-estilos/${item._id}/img`,
        flex: 3,
        rev: item._rev,
      };
    });*/
  },
};
</script>

