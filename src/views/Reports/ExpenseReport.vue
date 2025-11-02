<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-success">Expense Report</h2>

    <div class="row mb-3">
      <div class="col-md-3">
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-3">
        <button class="btn btn-success" @click="fetchReport">Filter</button>
      </div>
    </div>

    <table class="table table-bordered">
      <thead class="table-success">
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="report.length === 0">
          <td colspan="4" class="text-center text-muted">No data found</td>
        </tr>
        <tr v-for="row in report" :key="row.id">
          <td>{{ row.expense_date }}</td>
          <td>{{ row.category_name || row.category }}</td>
          <td>{{ formatCurrency(row.amount) }}</td>
          <td>{{ row.note }}</td>
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
  name: "ExpenseReport",
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
      DataService.GetExpenseReport(this.filters)
        .then((res) => {
          this.report = res.data.expenses || res.data || [];
          console.log("Expense report:", this.report);
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
