<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-primary">Sales Report</h2>

    <div class="row mb-3">
      <div class="col-md-3">
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary" @click="fetchReport">Filter</button>
      </div>
    </div>

    <table class="table table-bordered">
      <thead class="table-info">
        <tr>
          <th>Date</th>
          <th>Total Sales</th>
          <th>Discount</th>
          <th>Tax</th>
          <th>Net Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="report.length === 0">
          <td colspan="5" class="text-center text-muted">No data found</td>
        </tr>
        <tr v-for="row in report" :key="row.id">
          <td>{{ row.sale_date }}</td>
          <td>{{ formatCurrency(row.total_price) }}</td>
          <td>{{ formatCurrency(row.discount) }}</td>
          <td>{{ formatCurrency(row.tax) }}</td>
          <td>{{ formatCurrency(row.total_cost) }}</td>
        </tr>
      </tbody>
    </table>

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
  name: "SalesReport",
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
      DataService.GetSalesReport(this.filters)
        .then((res) => {
          // Map API sales array directly
          this.report = res.data.sales || [];
          console.log("Sales report:", this.report);
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
