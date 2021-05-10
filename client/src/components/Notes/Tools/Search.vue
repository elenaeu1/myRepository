<template>
  <q-input v-model="searchField" outlined label="Search" class="col">
    <template v-slot:append>
      <q-icon v-if="searchField !== ''" name="close" @click="text = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>
  </q-input>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("notes", ["search"]),
    searchField: {
      get() {
        return this.search;
      },
      set(value) {
        this.setSearch(value);
      }
    }
  },
  methods: {
    ...mapActions("notes", ["setSearch"])
  }
};
</script>