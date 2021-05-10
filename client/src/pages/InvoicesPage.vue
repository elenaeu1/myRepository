<template>
  <q-page padding>
    <div class="row justify-evenly" style="margin-bottom: 60px;">
      <div class="column">
        <q-radio left-label v-model="filter.typeDate" val="issueDate" label="Data emitere" />
        <q-radio left-label v-model="filter.typeDate" val="dueDate" label="Data scadenta" />
      </div>

      <q-input v-model="filter.startDate" filled type="date" hint="Data inceput" />
      <q-input v-model="filter.endDate" filled type="date" hint="Data final" />
      <q-select
        filled
        label="Toti furnizorii"
        hint="Furnizori"
        v-model="filter.suppliers"
        use-input
        use-chips
        multiple
        input-debounce="0"
        :options="filterOptions"
        @filter="filterFn"
        style="width: 250px"
      />
    </div>
    <q-table
      title="Facturi"
      :data="invoices"
      :filter="filter.search"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top-left>
        <q-btn color="primary" label="Adauga factura" outline @click="addInvoice" />

        <q-space />
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter.search" placeholder="Search">
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
            @click="viewInvoice(props.row)"
            round
            color="primary"
            icon="subject"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="card" class="dialog">
      <q-card class="my-card" style="width:70%" v-if="state === 'VIEW'">
        <div id="print">
          <q-card-section class="row text-h5 ellipsis">
            <div
              class="col-10 text-dark"
              v-if="selectedInvoice.supplier"
            >{{ selectedInvoice.supplier.name }} / {{ selectedInvoice.number }}</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Data emitere:</div>
              <div class="col-9 text-dark">{{ selectedInvoice.issueDate }}</div>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Data scadenta:</div>
              <div class="col-9 text-dark">{{ selectedInvoice.dueDate }}</div>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Produse/Servicii:</div>
              <q-list dense bordered padding class="col-9 rounded-borders">
                <q-item clickable v-ripple :key="item.id" v-for="item in selectedInvoice.items">
                  <q-item-section avatar>
                    <q-icon name="insert_drive_file" />
                  </q-item-section>
                  <q-item-section>{{ item.info.name }}</q-item-section>

                  <q-item-section>
                    {{ item.noUnits }} x {{ item.value
                    }}{{ selectedInvoice.currency }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Plati:</div>
              <q-list dense bordered padding class="col-9 rounded-borders">
                <q-item
                  clickable
                  class="column"
                  v-ripple
                  :key="item.id"
                  v-for="item in selectedInvoice.payments"
                >
                  <div class="row">
                    <q-item-section avatar>
                      <q-icon name="payment" />
                    </q-item-section>
                    <q-item-section>No: {{ item.number }}</q-item-section>
                    <q-item-section>
                      {{
                      formatDate(item.createdAt)
                      }}
                    </q-item-section>

                    <q-item-section>
                      {{ item.value }}
                      {{ selectedInvoice.currency }}
                    </q-item-section>
                  </div>

                  <div class="row">
                    <q-item-section avatar class="invisible">
                      <q-icon name="payment" />
                    </q-item-section>

                    <q-item-section>IBAN: {{ item.bankAccount.iban }}</q-item-section>
                  </div>
                </q-item>
                <q-item
                  v-if="
                    selectedInvoice &&
                      selectedInvoice.payments &&
                      selectedInvoice.payments.length == 0
                  "
                >Nici o plata efectuata</q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="row justify-evenly plata">
            <div class="column q-mb-md justify-center">
              <div class="text-grey">Total comanda:</div>
              <div class="text-dark">{{ selectedInvoice.value }} {{ selectedInvoice.currency }}</div>
            </div>
            <div class="column q-mb-md">
              <div class="text-grey">Total achitat:</div>
              <div class="text-dark">{{ selectedInvoice.paid }} {{ selectedInvoice.currency }}</div>
            </div>
            <div class="column q-mb-md sold">
              <div class="text-grey">Total de plata:</div>
              <div class="text-dark">{{ selectedInvoice.sold }} {{ selectedInvoice.currency }}</div>
            </div>
          </q-card-section>
        </div>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn icon="print" outline color="primary" @click="print">Printeaza</q-btn>
            <q-btn
              icon="payment"
              outline
              color="primary"
              :disabled="selectedInvoice.sold <= 0"
              @click="goPay"
            >Plateste</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>

      <q-card class="my-card" style="width:90%" v-if="state === 'ADD'">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey">Furnizor:</div>

          <q-select
            outlined
            class="col-9"
            dense
            value="Furnizor"
            v-model="selectedInvoice.supplier"
            :options="suppliersStringOptions"
          ></q-select>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Numar factura:</div>

            <q-input class="col-9" type="number" outlined v-model="selectedInvoice.number" dense />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Data emitere:</div>

            <q-input class="col-9" type="date" outlined v-model="selectedInvoice.issueDate" dense />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Data scadenta:</div>

            <q-input class="col-9" type="date" outlined v-model="selectedInvoice.dueDate" dense />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Moneda:</div>

            <q-input class="col-9" outlined readonly v-model="selectedInvoice.currency" dense />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Produse/Servicii:</div>
            <q-list dense bordered padding class="col-9 rounded-borders">
              <q-item clickable v-ripple :key="item.id" v-for="item in selectedItems">
                <q-item-section avatar>
                  <q-icon name="insert_drive_file" />
                </q-item-section>
                <q-item-section v-if="item.operation === 'ADD'">
                  <q-input class="col-9" outlined v-model="item.name" label="Denumire" dense />
                </q-item-section>
                <q-item-section v-else>
                  <div class="col-9 text-dark">{{ item.name }}</div>
                </q-item-section>
                <q-item-section v-if="item.operation === 'ADD'">
                  <q-input
                    class="col-9"
                    outlined
                    v-model="item.value"
                    type="number"
                    label="Pret"
                    dense
                  />
                </q-item-section>
                <q-item-section v-else>
                  <div class="col-9 text-dark">Pret: {{ item.value }} {{ selectedInvoice.currency }}</div>
                </q-item-section>
                <q-item-section v-if="item.operation === 'ADD'">
                  <q-input
                    class="col-9"
                    outlined
                    v-model="item.noUnits"
                    type="number"
                    label="Cantitate"
                    dense
                  />
                </q-item-section>
                <q-item-section v-else>
                  <div class="col-9 text-dark">Cantitate: {{ item.noUnits }} buc.</div>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple class="text-primary">
                <q-item-section avatar>
                  <q-icon name="add" />
                </q-item-section>
                <q-item-section @click="addItem()">Adauga un item</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row justify-evenly plata">
          <div class="row q-mb-md">
            <div class="text-grey">Total comanda:</div>
            <div class="text-dark">
              {{
              selectedItems
              .filter(currentValue => currentValue.operation === "ADDED")
              .reduce(
              (accumulator, currentValue) =>
              accumulator +
              parseInt(currentValue.value) *
              parseFloat(currentValue.noUnits),
              0
              )
              }}
              {{ selectedInvoice.currency }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn icon="document" outline color="primary" @click="executeAddInvoice">Adauga factura</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>

      <q-card class="my-card" style="width:70%" v-if="state === 'PAY'">
        <q-card-section class="row text-h5 ellipsis">
          <div
            class="col-10 text-dark"
            v-if="selectedInvoice.supplier"
          >{{ selectedInvoice.supplier.name }} / {{ selectedInvoice.number }}</div>
        </q-card-section>
        <q-expansion-item
          group="somegroup"
          icon="description"
          label="Mai multe informatii"
          default-folded
          header-class="text-primary"
        >
          <q-card-section>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Data emitere:</div>
              <div class="col-9 text-dark">{{ selectedInvoice.issueDate }}</div>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Data scadenta:</div>
              <div class="col-9 text-dark">{{ selectedInvoice.dueDate }}</div>
            </div>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Produse/Servicii:</div>
              <q-list dense bordered padding class="col-9 rounded-borders">
                <q-item clickable v-ripple :key="item.id" v-for="item in selectedInvoice.items">
                  <q-item-section avatar>
                    <q-icon name="insert_drive_file" />
                  </q-item-section>
                  <q-item-section>{{ item.info.name }}</q-item-section>

                  <q-item-section>
                    {{ item.noUnits }} x {{ item.value
                    }}{{ selectedInvoice.currency }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-separator inset />
        </q-expansion-item>
        <q-card-section class="row justify-evenly plata">
          <div class="column q-mb-md justify-center">
            <div class="text-grey">Total comanda:</div>
            <div class="text-dark">{{ selectedInvoice.value }} {{ selectedInvoice.currency }}</div>
          </div>
          <div class="column q-mb-md">
            <div class="text-grey">Total achitat:</div>
            <div class="text-dark">{{ selectedInvoice.paid }} {{ selectedInvoice.currency }}</div>
          </div>
          <div class="column q-mb-md sold">
            <div class="text-grey">Total de plata:</div>
            <div class="text-dark">{{ selectedInvoice.sold }} {{ selectedInvoice.currency }}</div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="column q-mb-md">
            <div class="text-grey">Suma pentru plata:</div>
            <q-input
              class="col-9"
              type="number"
              :prefix="selectedInvoice.currency"
              outlined
              v-model="payment.value"
              label
              dense
            />
          </div>
          <div class="text-grey">Alegeti IBAN-ul catre care veti trimite suma:</div>
          <div class="q-gutter-sm column">
            <q-radio
              v-model="payment.bankAccountId"
              v-for="item in suppliers.find(
                x => x.id === selectedInvoice.supplierId
              ).bankAccounts"
              :key="item.id"
              :val="item.id"
              :label="item.iban"
            />
          </div>
          <div class="column q-mb-md">
            <div class="text-grey">Numar plata:</div>
            <q-input class="col-9" type="number" outlined v-model="payment.number" dense />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn icon="arrow_back" outline color="primary" @click="goBack">inapoi</q-btn>
            <q-btn icon="payment" outline color="primary" @click="executePayment">Executa plata</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- <q-page-sticky position="bottom-right" :offset="[35, 35]">
      <q-btn fab icon="add" style="font-size: 50px;" color="primary" />
    </q-page-sticky>-->
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import jsPDF from "jspdf";

export default {
  name: "Invoices",
  computed: {
    suppliersStringOptions() {
      return this.suppliers.map(item => ({
        label: item.name,
        id: item.id
      }));
    },
    suppliers() {
      return this.$store.getters["data/getSuppliers"];
    },
    categories() {
      return this.$store.getters["data/getCategories"];
    },
    storeFilter() {
      return this.$store.getters["data/getFilter"];
    },
    invoices() {
      let inv = this.$store.getters["data/getInvoices"];

      if (this.filter.startDate || this.filter.endDate) {
        const startDate = this.filter.startDate
          ? new Date(this.filter.startDate)
          : null;
        const endDate = this.filter.endDate
          ? new Date(this.filter.endDate)
          : null;
        if (this.filter.typeDate == "dueDate") {
          inv = startDate
            ? inv.filter(item => new Date(item.dueDate) > startDate)
            : inv;
          inv = endDate
            ? inv.filter(item => new Date(item.dueDate) < endDate)
            : inv;
        } else {
          inv = startDate
            ? inv.filter(item => new Date(item.issueDate) > startDate)
            : inv;
          inv = endDate
            ? inv.filter(item => new Date(item.issueDate) < endDate)
            : inv;
        }
      }

      if (this.filter.suppliers.length > 0) {
        const suppliers = this.filter.suppliers.map(i => i.id);

        inv = inv.filter(item => suppliers.includes(item.supplierId));
      }
      this.$store.dispatch("data/setFilter", this.filter.suppliers);
      this.filteredInvoices = inv;

      return inv;
    }
  },
  methods: {
    goBack() {
      this.state = "VIEW";
    },

    executePayment() {
      if (
        this.payment.value < 1 ||
        this.payment.value > this.selectedInvoice.sold
      ) {
        this.$q.notify({
          color: "negative",

          message: "suma invalida",
          icon: "arrow_forward"
        });
      } else
        this.$q
          .dialog({
            title: "Confirmare",
            message: `Vrei sa platesti ${this.payment.value} ${this.selectedInvoice.currency} in contul furnizorului ${this.selectedInvoice.supplier.name}?`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.$axios
              .post("/api/invoices/payment", this.payment)
              .then(response => {
                this.$q.notify({
                  color: "green",

                  message: response.data.message,
                  icon: "arrow_forward"
                });
                this.$store.dispatch("data/loadInvoices");
                this.card = false;
              })
              .catch(error => {
                console.error(error);
                this.$q.notify({
                  color: "negative",

                  message: "Eroare",
                  icon: "arrow_forward"
                });
              });
          });
    },

    executeAddInvoice() {
      if (!this.selectedInvoice.number) {
        this.$q.notify({
          color: "negative",

          message: "numar invalid",
          icon: "arrow_forward"
        });
      } else if (
        this.selectedInvoice.dueDate < this.selectedInvoice.issueDate
      ) {
        this.$q.notify({
          color: "negative",

          message: "date necurespunzatoare",
          icon: "arrow_forward"
        });
      } else
        this.$axios
          .post("/api/invoices", {
            ...this.selectedInvoice,
            supplierId: this.selectedInvoice.supplier.id,
            items: this.selectedItems.filter(item => item.operation === "ADDED")
          })
          .then(response => {
            this.$q.notify({
              color: "green",

              message: response.data.message,
              icon: "arrow_forward"
            });
            this.card = false;
            this.$store.dispatch("data/loadInvoices");
          })
          .catch(error => {
            this.$q.notify({
              color: "negative",

              message: error.response.data.message,
              icon: "arrow_forward"
            });
          });
    },
    addItem() {
      console.log(this.selectedItems);
      if (
        this.selectedItems.length === 0 ||
        this.selectedItems[this.selectedItems.length - 1].operation === "ADDED"
      )
        this.selectedItems.push({
          name: "",
          noUnits: 0,
          value: 0,
          operation: "ADD"
        });
      else {
        const { name, noUnits, value } = this.selectedItems[
          this.selectedItems.length - 1
        ];
        if (name.length < 1 || noUnits < 1 || value < 0) {
          this.$q.notify({
            color: "negative",

            message: "date item invalide",
            icon: "arrow_forward"
          });
        } else
          this.selectedItems[this.selectedItems.length - 1].operation = "ADDED";
      }
    },
    formatDate(date) {
      const formatted = new Date(date);
      return formatted.toLocaleString("en-GB").split(",")[0];
    },
    viewInvoice(invoice) {
      console.log(invoice);
    },
    addInvoice() {
      this.state = "ADD";
      this.card = true;
      this.selectedItems = [];
      this.selectedInvoice = {
        // id: 7,
        issueDate: new Date().toISOString().split("T")[0],

        dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split("T")[0],
        number: Math.floor(Math.random() * 9000000) + 1000000,
        // numberDocument: "22222",

        currency: "RON",
        // createdAt: "2020-05-14T05:50:52.000Z",
        // updatedAt: "2020-05-14T05:51:25.000Z",
        userId: 1,
        supplierId: 10,
        supplier: {
          id: 10,
          label: "Alege furnizor"
        },
        // paid: 23,
        // sold: 7,
        payments: [],
        items: []
      };
    },
    goPay() {
      this.state = "PAY";
      this.card = true;
      this.payment = {
        number: Math.floor(Math.random() * 90000) + 10000,
        value: this.selectedInvoice.sold,
        bankAccountId: 0,
        invoiceId: this.selectedInvoice.id
      };
    },
    print() {
      let pdfName = `Factura-${this.selectedInvoice.number}-${this.selectedInvoice.supplier.name}`;
      var doc = new jsPDF();

      doc.fromHTML(document.getElementById("print"), 15, 15, {
        width: 170
      });

      doc.save(pdfName + ".pdf");
    },
    viewInvoice(invoice) {
      this.state = "VIEW";
      this.card = true;
      this.selectedInvoice = invoice;
    },
    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = this.suppliersStringOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = this.suppliersStringOptions.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    }
  },
  beforeMount() {
    this.filter.suppliers = this.storeFilter;
  },
  data() {
    return {
      payment: { number: 0, value: 0, bankAccountId: 0, invoiceId: 0 },
      state: "VIEW",
      selectedInvoice: {},
      card: false,
      selectedItems: [],
      filterOptions: this.suppliersStringOptions,

      filter: {
        typeDate: "dueDate",
        search: "",
        startDate: "",
        endDate: "",
        suppliers: []
      },

      columns: [
        {
          name: "number",
          required: true,
          label: "Numar",
          align: "left",
          field: row => row.number,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "supplier",
          required: true,
          label: "Furnizor",
          align: "left",
          field: row => row.supplier.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "issueDate",
          required: true,
          label: "Data emitere",
          align: "left",
          field: row => row.issueDate,
          format: val => this.formatDate(val),
          sortable: true
        },
        {
          name: "dueDate",
          required: true,
          label: "Data scadenta",
          align: "left",
          field: row => row.dueDate,
          format: val => this.formatDate(val),
          sortable: true
        },

        {
          name: "currency",
          required: true,
          label: "Valuta",
          align: "left",
          field: row => row.currency,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "value",
          required: true,
          label: "Valoare cu TVA",
          align: "left",
          field: row => row.value,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "datePaid",
          label: "Data ultima plata",
          align: "left",
          field: row => row.payments,
          // format: val => {
          //   return val[0].createdAt;
          // },
          format: val => {
            if (val.length > 0) {
              const date = new Date(val[val.length - 1].createdAt);
              return date.toLocaleString("en-GB").split(",")[0];
            } else return "N/A";
          },
          sortable: true
        },
        {
          name: "valuePaid",
          label: "Valoare platita",
          align: "left",
          field: row => row.paid,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "sold",
          label: "Sold",
          align: "left",
          field: row => row.sold,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "actions",
          label: "Actiuni"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.plata > .column {
  padding: 15px;
}
.sold {
  border-style: solid;
  border-width: thin;
  border-color: $primary;
  padding: 15px;
  border-radius: 20px;
}
.dialog {
  width: 80%;
  max-width: 800px !important;
}
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    max-width: 800px;
  }
}
</style>
