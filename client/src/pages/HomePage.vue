<template>
  <q-page class="q-pa-md">
    <q-banner v-if="emptyShow" inline-actions class="text-white bg-green">
      Aveti toate facturile achitate!
      <template v-slot:action>
        <q-btn flat icon="insert_emoticon" to="/invoices" label="Facturi" />
        <q-btn flat icon="close" @click="emptyShow = !emptyShow" />
      </template>
    </q-banner>
    <q-banner v-if="delayedShow" inline-actions class="text-white bg-red">
      Aveti {{ delayed }} facturi cu scadenta intarziata!
      <template v-slot:action>
        <q-btn flat icon="exit_to_app" to="/invoices" label="Facturi" />
        <q-btn flat icon="close" @click="delayedShow = !delayedShow" />
      </template>
    </q-banner>
    <q-banner v-if="lastDayShow" inline-actions class="text-white bg-orange">
      Aveti {{ lastDay }} facturi cu scadenta astazi!
      <template v-slot:action>
        <q-btn flat icon="exit_to_app" to="/invoices" label="Facturi" />
        <q-btn flat icon="close" @click="lastDayShow = !lastDayShow" />
      </template>
    </q-banner>
    <q-banner
      v-if="lastWeekShow"
      inline-actions
      rounded
      class="bg-yellow-7 text-white"
    >
      Aveti {{ lastWeek }} facturi cu scadenta saptamana aceasta!
      <template v-slot:action>
        <q-btn flat icon="exit_to_app" to="/invoices" label="Facturi" />
        <q-btn flat icon="close" @click="lastWeekShow = !lastWeekShow" />
      </template>
    </q-banner>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        :key="item.id"
        v-for="item in invoices"
        flat
        bordered
        class="my-card"
      >
        <q-card-section>
          <div class="text-h6">{{ item.supplier.name }}/{{ item.number }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <div class="col-3 text-grey">Data scadenta:</div>
          <div class="col-9 text-dark">{{ formatDate(item.dueDate) }}</div>
        </q-card-section>
        <q-card-section>
          <div class="col-3 text-grey">Suma achitata: / Total plata:</div>
          <div class="col-9 text-dark">
            {{ item.paid }} {{ item.currency }} / {{ item.value }}
            {{ item.currency }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="isAdmin" class="echarts" style="margin-top:20px">
      <IEcharts :option="supplierData" />
    </div>
    <div v-else class="q-pa-md">
      <q-table
        title="Status general"
        :data="allInvoices"
        :columns="columns"
        row-key="supplier"
      >
        <template v-slot:body-cell-ok="props">
          <q-td :props="props">
            <q-banner
              inline-actions
              rounded
              :class="props.row.value === 0 ? 'bg-green' : 'bg-orange'"
            />
          </q-td>
        </template>
        ></q-table
      >
    </div>
  </q-page>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";

import { LocalStorage } from "quasar";

export default {
  name: "HomePage",
  methods: {
    // doRandom() {
    //   const that = this;
    //   let data = [];
    //   for (let i = 0, min = 5, max = 99; i < 6; i++) {
    //     data.push(Math.floor(Math.random() * (max + 1 - min) + min));
    //   }
    //   that.loading = !that.loading;
    //   that.bar.series[0].data = data;
    // },
    // onReady(instance, ECharts) {
    //   console.log(instance, ECharts);
    // },
    // onClick(event, instance, ECharts) {
    //   console.log(arguments);
    // },
    formatDate(date) {
      const formatted = new Date(date);
      return formatted.toLocaleString("en-GB").split(",")[0];
    },
    refresh() {
      this.$store.dispatch("data/loadUsers");
    }
  },
  components: {
    IEcharts
  },
  computed: {
    invoices() {
      return this.$store.getters["data/getInvoices"].filter(
        item => item.sold > 0
      );
    },

    allInvoices() {
      const inv = this.$store.getters["data/getInvoices"];
      let x = {};

      inv.forEach(item => {
        if (x[item.supplier.name]) {
          x[item.supplier.name] += item.sold;
        } else {
          x[item.supplier.name] = item.sold;
        }
      });

      const invo = [];
      Object.keys(x).forEach((key, index) => {
        invo.push({ supplier: key, value: x[key] });
      });
      return invo;
    },
    suppliers() {
      return this.$store.getters["data/getSuppliers"];
    },
    users() {
      return;
    },
    supplierData() {
      let sup = {};
      const users = this.$store.getters["data/getUsers"];
      users &&
        users.forEach(user => {
          user.invoices.forEach(invoice => {
            if (sup[invoice.supplierId]) {
              sup[invoice.supplierId].total += invoice.value;
              sup[invoice.supplierId].paid += invoice.paid;
            } else {
              sup[invoice.supplierId] = {
                total: invoice.value,
                paid: invoice.paid
              };
            }
          });
        });
      const ceva = Object.keys(sup).map(item => {
        const supplier = this.suppliers.find(i => i.id == item);
        return {
          total: sup[item].total,
          paid: sup[item].paid,
          name: supplier.name
        };
      });
      return {
        title: {
          text: "Valoare facturi per furnizor [RON]"
        },
        tooltip: {},
        xAxis: {
          data: ceva.map(item => item.name)
        },
        yAxis: {},
        series: [
          {
            name: "Valoare platita",
            type: "bar",
            data: ceva.map(item => item.paid)
          },
          {
            name: "Valoarea totala",
            type: "bar",
            data: ceva.map(item => item.total)
          }
        ]
      };
    }
  },
  data() {
    return {
      loading: true,

      isAdmin: LocalStorage.getItem("user").isAdmin,
      lastDay: 0,
      lastDayShow: false,
      lastWeek: 0,
      lastWeekShow: false,
      delayed: 0,
      delayedShow: false,
      emptyShow: false,
      columns: [
        {
          name: "supplier",
          required: true,
          label: "Furnizor",
          align: "left",
          field: row => row.supplier,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "value",
          align: "left",
          label: "Suma ramasa",
          field: row => row.value,
          format: val => `${val} RON`,
          sortable: true
        },
        {
          name: "ok",
          align: "left",
          label: "Status"
        }
      ]
    };
  },
  beforeMount() {
    this.$store.dispatch("data/loadUsers");
    const today = new Date();
    if (this.invoices.length === 0) {
      this.emptyShow = true;
    }
    this.invoices.forEach(item => {
      const date = new Date(item.dueDate);

      if (date < today.getDate() + 1) this.delayed++;
      else if (date.getDate() + 1 < today.getDate() + 2) this.lastDay++;
      else if (date.getDate() + 1 < today.getDate() + 8) this.lastWeek++;

      if (this.delayed) this.delayedShow = true;
      if (this.lastDay) this.lastDayShow = true;
      if (this.lastWeek) this.lastWeekShow = true;
    });
  },
  mounted() {}
};
</script>
<style scoped>
.echarts {
  width: 100%;
  height: 400px;
}
</style>
