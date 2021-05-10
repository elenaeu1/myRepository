<template>
  <q-page padding>
    <div class="row justify-evenly" style="margin-bottom: 60px;">
      <q-input
        v-model="filter.startDate"
        filled
        type="date"
        hint="Data inceput"
      />
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
      title="Plati"
      :data="payments"
      :filter="filter.search"
      :columns="columns"
      row-key="name"
      ><template v-slot:top-left>
        <div class="q-table__title">Plati</div>
        <div>Total: {{ generateTotal() }}</div>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter.search"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "Payments",
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

    payments() {
      let inv = this.$store.getters["data/getPayments"];
      if (this.filter.startDate || this.filter.endDate) {
        const startDate = this.filter.startDate
          ? new Date(this.filter.startDate)
          : null;
        const endDate = this.filter.endDate
          ? new Date(this.filter.endDate)
          : null;

        inv = startDate
          ? inv.filter(item => new Date(item.createdAt) > startDate)
          : inv;
        inv = endDate
          ? inv.filter(item => new Date(item.createdAt) < endDate)
          : inv;
      }

      if (this.filter.suppliers.length > 0) {
        const suppliers = this.filter.suppliers.map(i => i.id);

        inv = inv.filter(item => suppliers.includes(item.invoice.supplierId));
      }
      this.$store.dispatch("data/setFilter", this.filter.suppliers);
      this.filteredInvoices = inv;

      return inv;
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
    formatDate(date) {
      const formatted = new Date(date);
      return formatted.toLocaleString("en-GB").split(",")[0];
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
    },
    generateTotal() {
      const total = {};
      this.payments.forEach(item => {
        if (total[item.invoice.currency]) {
          total[item.invoice.currency] += item.value;
        } else {
          total[item.invoice.currency] = item.value;
        }
      });
      console.log(total);

      let string = "";

      Object.keys(total).forEach(
        item => (string += `${total[item]} ${item}; `)
      );
      return string.slice(0, -2);
    }
  },
  beforeMount() {
    this.filter.suppliers = this.storeFilter;
  },
  data() {
    return {
      filterOptions: this.suppliersStringOptions,
      countTotal: "",
      filter: {
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
          field: row => row.invoice.supplier.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "invoiceNumber",
          label: "Numar factura",
          align: "left",
          field: row => row.invoice.number,
          format: val => val,
          sortable: true
        },
        {
          name: "paidDate",
          required: true,
          label: "Data plata",
          align: "left",
          field: row => row.createdAt,
          format: val => this.formatDate(val),
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
          name: "currency",
          required: true,
          label: "Valuta",
          align: "left",
          field: row => row.invoice.currency,
          format: val => `${val}`,
          sortable: true
        },

        {
          name: "iban",
          label: "IBAN",
          align: "left",
          field: row => row.bankAccount.iban,
          format: val => val,
          // format: val => {
          //   return val[0].createdAt;
          // },

          sortable: true
        }

        // {
        //   name: "sold",
        //   label: "Sold",
        //   align: "left",
        //   field: row => row.sold,
        //   format: val => `${val}`,
        //   sortable: true
        // },
        // {
        //   name: "actions",
        //   label: "Actiuni"
        // }
      ]
    };
  }
};
</script>
