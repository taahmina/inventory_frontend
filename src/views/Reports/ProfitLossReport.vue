<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-warning text-center">📊 Profit & Loss Report</h2>

    <!-- Filters -->
    <div class="row mb-4 justify-content-center">
      <div class="col-md-3">
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-2">
        <button class="btn btn-warning w-100" @click="fetchReport">Filter</button>
      </div>
    </div>

    <!-- Report Table -->
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-bordered align-middle">
        <thead class="table-warning text-center">
          <tr>
            <th>Date</th>
            <th>Total Sales</th>
            <th>Total Purchases</th>
            <th>Total Expenses</th>
            <th>Gross Profit</th>
            <th>Net Profit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="report.length === 0">
            <td colspan="6" class="text-center text-muted">No data found</td>
          </tr>

          <tr v-for="(row, index) in report" :key="index">
            <td>{{ row.date || 'Overall' }}</td>
            <td>{{ formatCurrency(row.total_sales) }}</td>
            <td>{{ formatCurrency(row.total_purchase_cost) }}</td>
            <td>{{ formatCurrency(row.total_expenses) }}</td>
            <td :class="profitClass(calcGross(row))">
              {{ formatCurrency(calcGross(row)) }}
            </td>
            <td :class="profitClass(calcNet(row))">
              {{ formatCurrency(calcNet(row)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Back Button -->
    <div class="mt-4 text-center">
      <button class="btn btn-secondary px-4" @click="goBack">
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
    // Fetch report data
    fetchReport() {
      DataService.GetProfitLossReport(this.filters)
        .then((res) => {
          if (res.data) {
            // Ensure array
            this.report = Array.isArray(res.data) ? res.data : [res.data];
          } else {
            this.report = [];
          }
        })
        .catch((err) => console.error(err));
    },

    // Format numbers as USD currency
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value) || 0);
    },

    // Gross Profit = Sales - Purchases
    calcGross(row) {
      return row.gross_profit ?? (row.total_sales - (row.total_purchase_cost || 0));
    },

    // Net Profit = Gross Profit - Expenses
    calcNet(row) {
      return row.net_profit ?? (this.calcGross(row) - (row.total_expenses || 0));
    },

    // Color class for profit/loss
    profitClass(value) {
      if (value > 0) return "text-success fw-bold";
      if (value < 0) return "text-danger fw-bold";
      return "text-muted";
    },

    // Navigate back
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
  font-size: 15px;
}

.table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.container {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}

.btn-warning {
  font-weight: 600;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  color: #6c757d !important;
}
</style>
