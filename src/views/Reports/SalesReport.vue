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
        <tr v-for="row in report" :key="row.date">
          <td>{{ row.date }}</td>
          <td>{{ row.total_sales }}</td>
          <td>{{ row.discount }}</td>
          <td>{{ row.tax }}</td>
          <td>{{ row.net_total }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mb-3">
      <button class="btn btn-primary" @click="goBack">
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
  methods: {
    fetchReport() {
      DataService.GetSalesReport(this.filters)
        .then(res => (this.report = res.data))
        .catch(err => console.error(err));
    },
    goBack() {
  this.$router.push({ name: "report_list" });
}
  },
};
</script>
