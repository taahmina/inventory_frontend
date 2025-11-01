<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-primary">📊 POS Reports & Analytics Dashboard</h2>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div
        class="col-md-3 mb-3"
        v-for="card in summaryCards"
        :key="card.label"
      >
        <div class="card shadow-sm p-3 text-center border-0 rounded-3">
          <h6 class="text-muted">{{ card.label }}</h6>
          <h3 class="fw-bold mt-2">{{ card.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row">
      <!-- Sales Chart -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm p-3">
          <h5 class="text-secondary">📈 Sales Overview</h5>
          <canvas id="salesChart"></canvas>
        </div>
      </div>

      <!-- Expense Chart -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm p-3">
          <h5 class="text-secondary">💸 Expense Overview</h5>
          <canvas id="expenseChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Low Stock Products -->
    <div class="card shadow-sm p-3 mt-3">
      <h5 class="text-danger mb-3">⚠️ Low Stock Alerts</h5>
      <table class="table table-striped">
        <thead class="table-light">
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Sell Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in lowStockProducts" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.sell_price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";
import Chart from "chart.js/auto";

export default {
  name: "ReportDashboard",
  data() {
    return {
      summaryCards: [
        { label: "Total Sales", value: "0" },
        { label: "Total Expenses", value: "0" },
        { label: "Total Profit", value: "0" },
        { label: "Low Stock", value: "0" },
      ],
      lowStockProducts: [],
      salesData: [],
      expenseData: [],
    };
  },
  methods: {
    async fetchReports() {
      try {
        const res = await DataService.GetReports(); // backend: /api/reports
        const data = res.data;

        this.summaryCards = [
          { label: "Total Sales", value: data.total_sales || 0 },
          { label: "Total Expenses", value: data.total_expenses || 0 },
          { label: "Total Profit", value: data.profit || 0 },
          { label: "Low Stock", value: data.low_stock?.length || 0 },
        ];

        this.lowStockProducts = data.low_stock || [];
        this.salesData = data.sales_chart || [];
        this.expenseData = data.expense_chart || [];

        this.renderCharts();
      } catch (err) {
        console.error("Error loading reports:", err);
        alert("Failed to load report data.");
      }
    },

    renderCharts() {
      // Sales Chart
      const salesCtx = document.getElementById("salesChart").getContext("2d");
      new Chart(salesCtx, {
        type: "line",
        data: {
          labels: this.salesData.map((d) => d.date),
          datasets: [
            {
              label: "Sales",
              data: this.salesData.map((d) => d.total),
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
              fill: false,
            },
          ],
        },
      });

      // Expense Chart
      const expenseCtx = document.getElementById("expenseChart").getContext("2d");
      new Chart(expenseCtx, {
        type: "bar",
        data: {
          labels: this.expenseData.map((d) => d.date),
          datasets: [
            {
              label: "Expenses",
              data: this.expenseData.map((d) => d.total),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        },
      });
    },
  },
  mounted() {
    this.fetchReports();
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-3px);
}
</style>
