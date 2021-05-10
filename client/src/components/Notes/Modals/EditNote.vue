<template>
  <q-card>
    <modal-header>Edit Note</modal-header>

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
            cleara
            ble
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
        <q-btn type="submit" label="Save" color="primary" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<style scoped>
</style>

<script>
import { mapActions } from "vuex";

export default {
  props: ["note", "id"],
  data() {
    return {
      noteToSubmit: {
        // noteName: "",
        // label: "",
        // subject: "",
        // date: ""
      },
      optionsCS: ["C", "S"]
      //   optionsType: ["Text", "Draw", "Code Editor"]
    };
  },
  methods: {
    ...mapActions("notes", ["updateNote"]),
    submitForm() {
      console.log("submitForm");
      this.$refs.name.validate();
      if (!this.$refs.name.hasError) {
        this.submitNote();
      }
    },
    submitNote() {
      this.$axios
        .put(`/api/notes/${this.id}`, this.noteToSubmit)
        .then(response => {
          this.$q.notify({
            color: "green",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadNotes");
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",

            message: error.response.data.message,
            icon: "report_problem"
          });
        });
      this.$emit("close");
    }
  },
  components: {
    "modal-header": require("components/Notes/Modals/Shared/ModalHeader.vue")
      .default
  },
  mounted() {
    this.noteToSubmit = Object.assign({}, this.note);
  }
};
</script>