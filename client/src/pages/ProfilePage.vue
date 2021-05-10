<template>
  <q-page padding>
    <div class="h1" style="margin-bottom:50px">Pagina Profil</div>

    <q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section class="col-2">Prenume: </q-item-section>
        <q-item-section class="col-10">{{ user.firstName }}</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section class="col-2">Nume: </q-item-section>
        <q-item-section class="col-10">{{ user.lastName }}</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section class="col-2">Email: </q-item-section>
        <q-item-section class="col-10">{{ user.email }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "Profile",
  data() {
    return {
      user: {}
    };
  },
  beforeMount() {
    this.user = LocalStorage.getItem("user");
  }
};
</script>
