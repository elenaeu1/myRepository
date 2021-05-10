<template>
  <q-item v-ripple class="bg-deep-purple-1">
    <q-item-section side>
      <q-btn @click="showEditTask = true" flat round dense color="primary" icon="edit" />
      <q-btn @click="promptToDelete(id)" flat round dense color="red" icon="delete_outline" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{note.name}}</q-item-label>
      <q-item-label caption>{{note.subject}}</q-item-label>

      <q-item-label caption>
        <q-icon size="15px" name="event_note" />
        {{note.date}}
      </q-item-label>
    </q-item-section>
    <div class="row items-center">
      <q-btn class="q-mr-sm" clickable @click="open" flat color="primary" label="OPEN" />
      <q-item-section side bottom>
        <q-badge color="accent" :label="note.label" />
      </q-item-section>

      <div class="col-auto">
        <q-btn color="black" round flat icon="share">
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable>
                <q-item-section>Group</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>External</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="showEditTask">
      <edit-note @close="showEditTask = false" :note="note" :id="id" />
    </q-dialog>
  </q-item>
</template>

<style scoped>
</style>

<script>
import { mapActions } from "vuex";

export default {
  props: ["note", "id"],
  data() {
    return {
      showEditTask: false
    };
  },
  methods: {
    ...mapActions("notes", ["updateNote", "deleteNote"]),
    open() {
      this.$store.dispatch("data/setSelectedNote", this.note);
      this.$store.dispatch("data/disableIsNew");

      this.$router.push("/note");
    },
    promptToDelete(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this note?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete(`/api/notes/${id}`)
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
        });
    }
  },
  components: {
    "edit-note": require("components/Notes/Modals/EditNote.vue").default
  }
};
</script>