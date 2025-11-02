<template>
  <div class="product-page">
    <!-- Header -->
    <div class="page-header d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 rounded">
      <h3 class="fw-bold text-white mb-0">
        <i class="bi bi-box-seam me-2"></i> Product Management
      </h3>
      <router-link to="/products/add" class="btn btn-gradient shadow-sm">
        <i class="bi bi-plus-circle me-1"></i> Add Product
      </router-link>
    </div>

    <!-- Filter Section -->
    <div class="card filter-card shadow-sm mb-4 p-4 border-0">
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label fw-semibold text-dark">🔍 Search</label>
          <input
            type="text"
            class="form-control"
            v-model="filters.search"
            placeholder="Search by name, brand, or SKU..."
          />
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold text-dark">📦 Category</label>
          <select class="form-select" v-model="filters.category">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold text-dark">🏢 Supplier</label>
          <select class="form-select" v-model="filters.supplier">
            <option value="">All Suppliers</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>

        <div class="col-md-2 d-flex">
          <button class="btn btn-outline-primary w-100 reset-btn" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="card shadow-lg border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Brand</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(product, index) in paginatedProducts" :key="product.id">
              <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
              <td>
                <img
                  v-if="product.image"
                  :src="product.image"
                  alt="Product"
                  class="rounded shadow-sm"
                  style="width: 50px; height: 50px; object-fit: cover;"
                />
                <span v-else>-</span>
              </td>
              <td class="fw-semibold">{{ product.name }}</td>
              <td>{{ product.category?.name || '-' }}</td>
              <td>{{ product.supplier?.name || '-' }}</td>
              <td>{{ product.brand || '-' }}</td>
              <td class="text-success fw-bold">{{ product.buy_price }}</td>
              <td class="text-danger fw-bold">{{ product.sell_price }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <span
                  :class="product.status == 1 ? 'badge bg-success' : 'badge bg-secondary'"
                >
                  {{ product.status == 1 ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-center">
                <router-link
                  :to="`/products/edit/${product.id}`"
                  class="btn btn-sm btn-outline-info me-2"
                  title="Edit Product"
                >
                  <i class="bi bi-pencil-square"></i>
                </router-link>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteProduct(product.id)"
                  title="Delete Product"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="11" class="text-center py-4 text-muted">
                <i class="bi bi-info-circle me-1"></i> No matching products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center border-top">
        <small class="text-muted">
          Showing {{ startItem }}–{{ endItem }} of {{ filteredProducts.length }} results
        </small>

        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="currentPage++"
              :disabled="currentPage === totalPages"
            >
              »</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      categories: [],
      suppliers: [],
      filters: { search: "", category: "", supplier: "" },
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const s = this.filters.search.toLowerCase();
        const searchMatch =
          product.name.toLowerCase().includes(s) ||
          product.brand?.toLowerCase().includes(s) ||
          product.sku?.toLowerCase().includes(s);

        const categoryMatch =
          !this.filters.category || product.category_id == this.filters.category;
        const supplierMatch =
          !this.filters.supplier || product.supplier_id == this.filters.supplier;

        return searchMatch && categoryMatch && supplierMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
    startItem() {
      return this.filteredProducts.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.startItem + this.perPage - 1, this.filteredProducts.length);
    },
  },
  methods: {
    fetchProducts() {
      DataService.ProductList()
        .then((res) => (this.products = res.data))
        .catch((err) => console.error(err));
    },
    fetchCategories() {
      DataService.CategoryList()
        .then((res) => (this.categories = res.data))
        .catch((err) => console.error(err));
    },
    fetchSuppliers() {
      DataService.SupplierList()
        .then((res) => (this.suppliers = res.data))
        .catch((err) => console.error(err));
    },
    resetFilters() {
      this.filters = { search: "", category: "", supplier: "" };
    },
    deleteProduct(id) {
      if (confirm("Are you sure you want to delete this product?")) {
        DataService.DeleteProduct(id)
          .then(() => {
            alert("✅ Product deleted successfully!");
            this.fetchProducts();
          })
          .catch((err) => console.error(err));
      }
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
    this.fetchSuppliers();
  },
};
</script>

<style scoped>
.product-page {
  max-width: 1250px;
  margin: auto;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 12px;
}

.page-header {
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: #fff;
}

.btn-gradient {
  background: linear-gradient(90deg, #007bff, #00bfff);
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.btn-gradient:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.filter-card {
  background-color: #f0f5ff;
  border-left: 5px solid #007bff;
  border-radius: 10px;
}

.form-label {
  color: #333;
}

.reset-btn {
  border-radius: 6px;
}

.pagination .page-link {
  color: #007bff;
  border-radius: 5px;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
}
</style>
