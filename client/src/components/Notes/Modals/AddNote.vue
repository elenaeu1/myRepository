<template>
  <q-card>
    <modal-header>Add Note</modal-header>

    <form @submit.prevent="submitForm">
      <q-card-section>
        <div class="row q-mb-sm">
          <q-input
            outlined
            v-model="noteToSubmit.name"
            label="Note name"
            autofocus
            class="col"
            :rules="[val => !!val || 'Field is required']"
            ref="name"
            clearable
          />
        </div>

        <div class="row q-mb-sm">
          <q-input
            outlined
            v-model="noteToSubmit.subject"
            label="Subject name"
            class="col"
            :rules="[val => !!val || 'Field is required']"
          />
        </div>

        <div class="row q-mb-sm">
          <q-select
            outlined
            label="Course or Seminar"
            v-model="noteToSubmit.label"
            :options="optionsCS"
            class="col"
            :rules="[val => !!val || 'Field is required']"
          />
        </div>

        <!-- <div class="row q-mb-sm">
        <q-select
          outlined
          label="Type"
          v-model="noteToSubmit.label"
          :options="optionsType"
          class="col"
        />
        </div>-->

        <div class="row q-mb-sm">
          <q-input outlined v-model="noteToSubmit.date" label="Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="noteToSubmit.date" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn clickable @click="prepareToAdd" type="submit" label="Save" color="primary" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<style scoped>
</style>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      noteToSubmit: {
        name: "",
        label: "",
        subject: "",
        date: ""
      },
      optionsCS: ["C", "S"]
      //   optionsType: ["Text", "Draw", "Code Editor"]
    };
  },
  methods: {
    ...mapActions("notes", ["addNote"]),
    submitForm() {
      console.log("submitForm");
      this.$refs.name.validate();
    },
    prepareToAdd() {
      this.$store.dispatch("data/setSelectedNote", this.noteToSubmit);
      this.$store.dispatch("data/enableIsNew");

      this.$router.push("/note");
    }
  },
  components: {
    "modal-header": require("components/Notes/Modals/Shared/ModalHeader.vue")
      .default
  }
};
</script>




