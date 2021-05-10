<template>
  <q-page
    class="bg-primary window-height window-width row justify-center items-center"
  >
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Invoice Manager</h5>
      </div>
      <div class="row">
        <q-card
          square
          bordered
          v-if="!isRegisterSection"
          class="q-pa-lg shadow-1"
        >
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="login.email"
                type="email"
                label="Email"
              />
              <q-input
                v-model="login.password"
                filled
                label="Password"
                :type="login.isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="login.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="login.isPwd = !login.isPwd"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              @click="onLogin"
              class="full-width"
              label="Login"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Not registred?
              <a @click="isRegisterSection = true"> Create an Account!</a>
            </p>
          </q-card-section>
        </q-card>

        <q-card square bordered v-else class="q-pa-lg shadow-1">
          <p>Register an account</p>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="register.firstName"
                type="text"
                label="First name"
              />
              <q-input
                square
                filled
                clearable
                v-model="register.lastName"
                type="text"
                label="Last name"
              />
              <q-input
                square
                filled
                clearable
                v-model="register.email"
                type="email"
                label="Email"
              />
              <q-input
                v-model="register.password"
                filled
                label="Password"
                :type="register.isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="register.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="register.isPwd = !register.isPwd"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class=" row justify-center items-center">
            <q-btn
              unelevated
              color="grey"
              size="md"
              @click="isRegisterSection = false"
              label="Back"
            />
            <q-btn
              @click="onRegister"
              unelevated
              color="primary"
              size="md"
              label="Submit"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
a {
  color: $accent;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "LoginPage",
  data() {
    return {
      isRegisterSection: false,
      register: {
        isPwd: true,
        password: "",
        email: "",
        firstName: "",
        lastName: ""
      },
      login: { isPwd: true, password: "", email: "" }
    };
  },
  beforeMount() {
    if (LocalStorage.getItem("loggedIn")) {
      this.$router.push("/");
    }
  },
  methods: {
    onRegister() {
      this.$axios
        .post("/api/auth/register", this.register)
        .then(response => {
          this.$q.notify({
            color: "green",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.isRegisterSection = false;
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",

            message: error.response.data.message,
            icon: "report_problem"
          });
        });
    },
    onLogin() {
      this.$axios
        .post("/api/auth/login", {
          email: this.login.email,
          password: this.login.password
        })
        .then(response => {
          this.$q.notify({
            color: "green",

            message: "Login successfully",
            icon: "arrow_forward"
          });
          LocalStorage.set("loggedIn", true);
          LocalStorage.set("user", response.data);

          this.$router.push({ name: "Home" });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",

            message: "Email or password incorrect",
            icon: "report_problem"
          });
        });
    }
  }
};
</script>
