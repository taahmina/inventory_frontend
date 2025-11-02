<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-info">Inventory Report</h2>

    <!-- Filters -->
    <div class="row mb-3">
      <div class="col-md-3">
        <input type="date" v-model="filters.start" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filters.end" class="form-control" />
      </div>
      <div class="col-md-3">
        <button class="btn btn-info" @click="fetchReport">Filter</button>
      </div>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-primary">
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Buy Price</th>
          <th>Sell Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="report.length === 0">
          <td colspan="10" class="text-center text-muted">No products found</td>
        </tr>
        <tr v-for="(row, index) in report" :key="row.id">
          <td>{{ index + 1 }}</td>
          <td>
            <img
              v-if="row.image"
              :src="row.image"
              alt="Product"
              class="product-img"
            />
            <span v-else>-</span>
          </td>
          <td>{{ row.name }}</td>
          <td>{{ getCategoryName(row.category_id) }}</td>
          <td>{{ getSupplierName(row.supplier_id) }}</td>
          <td>{{ row.brand || '-' }}</td>
          <td>{{ row.stock || 0 }}</td>
          <td>{{ formatCurrency(row.buy_price) }}</td>
          <td>{{ formatCurrency(row.sell_price) }}</td>
          <td>
            <span :class="row.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">
              {{ row.status == 1 ? 'Active' : 'Inactive' }}
            </span>
          </td>
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
  name: "InventoryReport",
  data() {
    return {
      filters: { start: "", end: "" },
      report: [],
      categories: [],
      suppliers: [],
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchSuppliers();
    this.fetchReport();
  },
  methods: {
    fetchCategories() {
      DataService.CategoryList()
        .then(res => (this.categories = res.data))
        .catch(err => console.error(err));
    },
    fetchSuppliers() {
      DataService.SupplierList()
        .then(res => (this.suppliers = res.data))
        .catch(err => console.error(err));
    },
    fetchReport() {
      DataService.GetInventoryReport(this.filters)
        .then(res => {
          this.report = res.data.products || [];
        })
        .catch(err => console.error(err));
    },
    getCategoryName(id) {
      const cat = this.categories.find(c => c.id === id);
      return cat ? cat.name : '-';
    },
    getSupplierName(id) {
      const sup = this.suppliers.find(s => s.id === id);
      return sup ? sup.name : '-';
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
.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.badge {
  font-size: 0.85rem;
  padding: 5px 10px;
}
</style>
