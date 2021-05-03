<template>

</template>


<script>

//import { mapMutations } from "vuex";
export default {
  components: {
  },
  data() {
    return {};
  },
  methods: {
    //...mapMutations(["ocultarBarra"]),
    imprimir() {
      window.print();
    },
  },

  computed: {
    txt() {
      return "ssemana";
    },
  },
  created() {
    //this.ocultarBarra();
  },
};
</script>

