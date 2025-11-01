<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-info">Inventory Report</h2>

    <table class="table table-bordered">
      <thead class="table-info">
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Buy Price</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in report" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.category?.name }}</td>
          <td :class="{ 'text-danger': p.stock < 10 }">{{ p.stock }}</td>
          <td>{{ p.buy_price }}</td>
          <td>{{ (p.stock * p.buy_price).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
<!-- Back Button -->
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
  name: "InventoryReport",
  data() {
    return {
      report: [],
    };
  },
  methods: {
    fetchReport() {
      DataService.GetInventoryReport()
        .then(res => (this.report = res.data))
        .catch(err => console.error(err));
    },
    goBack() {
      this.$router.push({ name: "report_list" });
    },
  },
  mounted() {
    this.fetchReport();
  },
};
</script>
