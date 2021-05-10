<template>
  <q-page padding>
    <div class="row full-width">
      <p>Pagina furnizori</p>
      <q-btn
        style="position: absolute;right: 32px;"
        @click="cardCategories = !cardCategories"
        label="Verifica categorii"
      />
    </div>
    <div class="q-pa-md">
      <q-table
        title="Furnizori"
        :data="suppliers"
        :filter="filter"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              class="button"
              outline
              style="margin-right:20px"
              @click="viewSupplier(props.row)"
              round
              color="primary"
              icon="subject"
            />
            <q-btn
              v-if="isAdmin"
              class="button"
              outline
              @click="removeSupplier(props.row)"
              round
              color="negative"
              icon="delete"
            />
          </q-td>
        </template>

        <template v-slot:top-left>
          <q-btn
            color="primary"
            label="Adauga furnizor"
            outline
            @click="addSupplier"
          />

          <q-space />
        </template>
      </q-table>
      <q-dialog v-model="card">
        <q-card class="my-card">
          <q-card-section class="row text-h5 ellipsis" v-if="state === 'VIEW'">
            <div class="col-10 text-dark">{{ selectedSupplier.name }}</div>

            <div class="col-2" align="right">
              <q-btn
                color="primary"
                round
                outline
                icon="create"
                @click="editSupplier"
              />
            </div>
          </q-card-section>
          <q-card-section class="row text-h5 ellipsis" v-else>
            <div class="col-10 text-dark">
              <q-input outlined v-model="selectedSupplier.name" label="Nume" />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-mb-md" v-if="selectedSupplier.category">
              <div class="col-3 text-grey">Categorie:</div>
              <div class="col-9 text-dark" v-if="state === 'VIEW'">
                {{ selectedSupplier.category.label }}
              </div>
              <q-select
                v-else
                outlined
                class="col-9"
                dense
                v-model="selectedSupplier.category"
                :options="selectCategories"
              ></q-select>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Sediu:</div>
              <div class="col-9 text-dark" v-if="state === 'VIEW'">
                {{ selectedSupplier.headquarter }}
              </div>
              <q-input
                v-else
                class="col-9"
                outlined
                v-model="selectedSupplier.headquarter"
                dense
              />
            </div>

            <div class="row q-mb-md">
              <div class="col-3 text-grey">CUI:</div>
              <div class="col-9 text-dark" v-if="state === 'VIEW'">
                {{ selectedSupplier.CUI }}
              </div>
              <q-input
                v-else
                class="col-9"
                outlined
                v-model="selectedSupplier.CUI"
                dense
              />
            </div>

            <div class="row q-mb-md">
              <div class="col-3 text-grey">ORC:</div>
              <div class="col-9 text-dark" v-if="state === 'VIEW'">
                {{ selectedSupplier.ORC }}
              </div>
              <q-input
                v-else
                class="col-9"
                outlined
                v-model="selectedSupplier.ORC"
                dense
              />
            </div>

            <div class="row q-mb-md" v-if="state === 'VIEW'">
              <div class="col-3 text-grey">Conturi bancare:</div>
              <q-list dense bordered padding class="col-9 rounded-borders">
                <q-item
                  clickable
                  v-ripple
                  :key="item.id"
                  v-for="item in selectedSupplier.bankAccounts"
                >
                  <q-item-section avatar>
                    <q-icon name="account_balance" />
                  </q-item-section>
                  <q-item-section>{{ item.iban }}</q-item-section>
                </q-item>

                <q-item
                  v-if="state == 'EDIT'"
                  clickable
                  v-ripple
                  class="text-primary"
                >
                  <q-item-section avatar>
                    <q-icon name="add" />
                  </q-item-section>
                  <q-item-section>Adauga un cont nou</q-item-section>
                </q-item>
                <q-item
                  v-if="
                    state == 'VIEW' &&
                      selectedSupplier &&
                      selectedSupplier.bankAccounts &&
                      selectedSupplier.bankAccounts.length == 0
                  "
                  >Nici un cont bancar asociat.</q-item
                >
              </q-list>
            </div>

            <div class="row q-mb-md" v-if="state === 'EDIT'">
              <div class="col-3 text-grey">Conturi bancare:</div>
              <q-list dense bordered padding class="col-9 rounded-borders">
                <q-item
                  clickable
                  v-ripple
                  :key="item.id"
                  v-for="(item, index) in selectedBankAccounts"
                >
                  <q-item-section avatar>
                    <q-icon name="account_balance" />
                  </q-item-section>
                  <q-item-section
                    @click="item.operation = 'DELETE'"
                    v-if="item.operation == 'NOTHING'"
                    >{{ item.iban }}</q-item-section
                  >

                  <q-item-section v-if="item.operation == 'ADD'">
                    <q-input
                      @change="
                        !item.iban && selectedBankAccounts.splice(1, index)
                      "
                      v-model="item.iban"
                    />
                  </q-item-section>
                  <q-item-section
                    class="text-strike"
                    @click="item.operation = 'NOTHING'"
                    v-if="item.operation == 'DELETE'"
                    >{{ item.iban }}</q-item-section
                  >
                </q-item>

                <q-item
                  v-if="state == 'EDIT'"
                  clickable
                  v-ripple
                  class="text-primary"
                >
                  <q-item-section avatar>
                    <q-icon name="add" />
                  </q-item-section>
                  <q-item-section
                    @click="
                      selectedBankAccounts.push({
                        iban: 'Introduce un IBAN',
                        operation: 'ADD'
                      })
                    "
                    >Adauga un cont nou</q-item-section
                  >
                </q-item>
              </q-list>
            </div>

            <div class="row q-mb-md">
              <div class="col-3 row text-grey">Date de contact:</div>
              <div class="col-9 row text-dark contact">
                <div class="col" v-if="state === 'VIEW'">
                  <span class="text-grey">Nr. mobil:</span>
                  <span class="text-grey">Email:</span>
                  <span class="text-grey">Fax:</span>
                </div>
                <div class="col" v-else>
                  <span style="line-height: 40px;" class="text-grey"
                    >Nr. mobil:</span
                  >
                  <span style="line-height: 40px;" class="text-grey"
                    >Email:</span
                  >
                  <span style="line-height: 40px;" class="text-grey">Fax:</span>
                </div>
                <div class="col" v-if="state === 'VIEW'">
                  <span class="text-dark">{{ selectedSupplier.phone }}</span>
                  <span class="text-dark">{{ selectedSupplier.email }}</span>
                  <span class="text-dark">{{ selectedSupplier.fax }}</span>
                </div>
                <div class="col" v-else>
                  <q-input
                    outlined
                    type="phone"
                    v-model="selectedSupplier.phone"
                    dense
                  />
                  <q-input
                    outlined
                    type="email"
                    v-model="selectedSupplier.email"
                    dense
                  />
                  <q-input outlined v-model="selectedSupplier.fax" dense />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="around" v-if="state === 'VIEW'">
            <q-btn outline @click="goInvoices" color="primary ">Facturi</q-btn>
            <q-btn outline @click="goPayments" color="primary">Plati</q-btn>
          </q-card-actions>
          <q-card-actions align="around" v-else-if="state === 'EDIT'">
            <q-btn outline color="primary" @click="card = false"
              >Anuleaza</q-btn
            >
            <q-btn outline color="primary" @click="executeSaveSupplier"
              >Modifica</q-btn
            >
          </q-card-actions>
          <q-card-actions align="around" v-else>
            <q-btn outline color="primary" @click="executeAddSupplier"
              >Adauga</q-btn
            >
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="cardCategories">
        <q-table
          title="Categorii"
          :data="categories"
          :columns="isAdmin ? columnsCategoriesAdmin : columnsCategories"
          row-key="name"
        >
          <template v-slot:body-cell-delete="props">
            <q-td :props="props">
              <q-btn
                v-if="isAdmin"
                class="button"
                outline
                @click="removeCategory(props.row)"
                round
                color="negative"
                icon="delete"
              />
            </q-td>
          </template>

          <template v-if="isAdmin" v-slot:top>
            <q-input
              outline
              bottom-slots
              v-model="newCategory"
              label="Categorie noua"
              dense
              class="full-width"
            >
              <template v-slot:append>
                <q-btn
                  @click="executeAddCategory"
                  round
                  dense
                  flat
                  icon="add"
                />
              </template>
            </q-input>

            <q-space />
          </template>
        </q-table>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "Suppliers",

  methods: {
    goPayments() {
      this.$store.dispatch("data/setFilter", [
        { id: this.selectedSupplier.id, label: this.selectedSupplier.name }
      ]);
      this.$router.push({ name: "Payments" });
    },
    goInvoices() {
      this.$store.dispatch("data/setFilter", [
        { id: this.selectedSupplier.id, label: this.selectedSupplier.name }
      ]);
      this.$router.push({ name: "Invoices" });
    },
    executeAddCategory() {
      if (this.newCategory.length < 2) {
        this.$q.notify({
          color: "negative",

          message: "Categorie invalida",
          icon: "arrow_forward"
        });
      } else
        this.$axios
          .post("/api/suppliers/categories", {
            name: this.newCategory
          })
          .then(response => {
            this.$q.notify({
              color: "green",

              message: response.data.message,
              icon: "arrow_forward"
            });
            this.$store.dispatch("data/loadCategories");
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",

              message: "Eroare",
              icon: "arrow_forward"
            });
          });
    },
    executeSaveSupplier() {
      const {
        headquarter,
        name,
        CUI,
        ORC,
        phone,
        email,
        fax,
        categoryId,
        bankAccounts,
        category
      } = this.selectedSupplier;
      if (
        !headquarter ||
        !name ||
        !CUI ||
        !ORC ||
        !phone ||
        !email ||
        !fax ||
        !category.value
      ) {
        this.$q.notify({
          color: "negative",

          message: "date invalide ",
          icon: "arrow_forward"
        });
      } else
        this.$axios
          .put("/api/suppliers", {
            ...this.selectedSupplier,
            categoryId: this.selectedSupplier.category.value,
            bankAccounts: this.selectedBankAccounts
          })
          .then(response => {
            this.$q.notify({
              color: "green",

              message: response.data.message,
              icon: "arrow_forward"
            });
            this.$store.dispatch("data/loadSuppliers");
            this.card = false;
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",

              message: "Eroare",
              icon: "arrow_forward"
            });
          });
    },
    executeAddSupplier() {
      const {
        headquarter,
        name,
        CUI,
        ORC,
        phone,
        email,
        fax,
        categoryId,
        bankAccounts,
        category
      } = this.selectedSupplier;
      if (
        !headquarter ||
        !name ||
        !CUI ||
        !ORC ||
        !phone ||
        !email ||
        !fax ||
        !category.value
      ) {
        this.$q.notify({
          color: "negative",

          message: "date invalide ",
          icon: "arrow_forward"
        });
      } else
        this.$axios
          .post("/api/suppliers", {
            ...this.selectedSupplier,
            categoryId: this.selectedSupplier.category.value
          })
          .then(response => {
            this.$q.notify({
              color: "green",

              message: response.data.message,
              icon: "arrow_forward"
            });
            this.$store.dispatch("data/loadSuppliers");
            this.card = false;
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",

              message: "Eroare",
              icon: "arrow_forward"
            });
          });
    },
    viewSupplier(supplier) {
      this.state = "VIEW";
      this.card = true;
      this.selectedSupplier = {
        ...supplier,
        category: { value: supplier.category.id, label: supplier.category.name }
      };
      console.log(this.selectedSupplier);
    },
    addSupplier() {
      this.state = "ADD";
      this.card = true;
      this.selectedSupplier = {
        headquarter: "",
        name: "",
        CUI: "",
        ORC: "",
        phone: "",
        email: "",
        fax: "",
        categoryId: null,
        bankAccounts: [],
        category: { id: 0, label: "" }
      };
    },
    editSupplier() {
      this.state = "EDIT";
      this.selectedBankAccounts = this.selectedSupplier.bankAccounts.map(
        item => ({ ...item, operation: "NOTHING" })
      );
    },
    removeCategory(category) {
      console.log(category);
      this.$q
        .dialog({
          title: "Confirmare",
          message: `Vrei sa stergi categoria ${category.name}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete("/api/suppliers/categories", {
              data: { id: category.id }
            })
            .then(response => {
              this.$q.notify({
                color: "green",

                message: response.data.message,
                icon: "arrow_forward"
              });

              this.$store.dispatch("data/loadCategories");
            })
            .catch(error => {
              console.error(error);
              this.$q.notify({
                color: "negative",

                message: error.response.data.message,
                icon: "arrow_forward"
              });
            });
        });
    },
    removeSupplier(supplier) {
      console.log(supplier);
      this.$q
        .dialog({
          title: "Confirmare",
          message: `Vrei sa stergi furnizorul ${supplier.name}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete("/api/suppliers", {
              data: { id: supplier.id }
            })
            .then(response => {
              this.$q.notify({
                color: "green",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$store.dispatch("data/loadSuppliers");
            })
            .catch(error => {
              console.error(error);
              this.$q.notify({
                color: "negative",

                message: error.response.data.message,
                icon: "arrow_forward"
              });
            });
        });
    }
  },
  computed: {
    selectCategories() {
      return this.categories.map(item => ({
        value: item.id,
        label: item.name
      }));
    },
    suppliers() {
      return this.$store.getters["data/getSuppliers"];
    },
    categories() {
      return this.$store.getters["data/getCategories"];
    }
  },
  data() {
    return {
      isAdmin: LocalStorage.getItem("user").isAdmin,
      newCategory: "",
      cardCategories: false,
      state: "VIEW",
      stateBankAccount: "VIEW",
      selectedBankAccounts: [],
      filter: "",
      card: false,
      selectedSupplier: {},
      columns: [
        {
          name: "name",
          required: true,
          label: "Nume",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "category",
          align: "left",
          label: "Categorii",
          field: row => row.category.name,
          sortable: true
        },
        {
          name: "actions",
          label: "Action"
        }
      ],
      columnsCategories: [
        {
          name: "name",
          required: true,
          label: "Nume",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        }
      ],
      columnsCategoriesAdmin: [
        {
          name: "name",
          required: true,
          label: "Nume",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "delete",
          label: "Delete",
          align: "left"
        }
      ]
    };
  }
};
</script>

<style scoped>
.my-card {
  width: 600px;
  max-width: 80vw;
  padding: 10px 20px;
}
.contact {
  padding-top: 15px;
  display: flex;
  flex-direction: row;
}
.contact div {
  display: flex;
  flex-direction: column;
}
</style>
