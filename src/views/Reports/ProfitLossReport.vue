<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-warning">Profit & Loss Report</h2>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-3">
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-3">
        <button class="btn btn-warning" @click="fetchReport">Filter</button>
      </div>
    </div>

    <!-- Report Table -->
    <table class="table table-bordered">
      <thead class="table-warning">
        <tr>
          <th>Date</th>
          <th>Total Sales</th>
          <th>Total Expenses</th>
          <th>Gross Profit</th>
          <th>Net Profit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="report.length === 0">
          <td colspan="5" class="text-center text-muted">No data found</td>
        </tr>
        <tr v-for="(row, index) in report" :key="index">
          <td>{{ row.date || 'Overall' }}</td>
          <td>{{ formatCurrency(row.total_sales) }}</td>
          <td>{{ formatCurrency(row.total_expenses) }}</td>
          <td>{{ formatCurrency(row.gross_profit || row.profit) }}</td>
          <td>{{ formatCurrency(row.net_profit || row.profit) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Back Button -->
    <div class="mb-3">
      <button class="btn btn-secondary" @click="goBack">
        ← Back to Reports List
      </button>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ProfitLossReport",
  data() {
    return {
      filters: { start: "", end: "" },
      report: [],
    };
  },
  mounted() {
    this.fetchReport();
  },
  methods: {
    fetchReport() {
      DataService.GetProfitLossReport(this.filters)
        .then((res) => {
          // Handle both array and object responses
          if (res.data) {
            if (Array.isArray(res.data)) {
              this.report = res.data;
            } else {
              this.report = [res.data];
            }
          } else {
            this.report = [];
          }
          console.log("Profit & Loss report:", this.report);
        })
        .catch((err) => console.error(err));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value) || 0);
    },
    goBack() {
      this.$router.push({ name: "report_list" });
    },
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
</style>
