<template>
  <div class="purchase-page">
    <!-- Header -->
    <div class="page-header d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 rounded">
      <h3 class="fw-bold text-white mb-0">
        <i class="bi bi-receipt me-2"></i> Purchase Management
      </h3>
      <router-link to="/purchases/add" class="btn btn-gradient shadow-sm">
        <i class="bi bi-plus-circle me-1"></i> Add Purchase
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
            placeholder="Search by invoice, supplier..."
          />
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

    <!-- Purchases Table -->
    <div class="card shadow-lg border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(purchase, index) in paginatedPurchases"
              :key="purchase.id"
              class="accordion-header"
            >
              <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
              <td>{{ purchase.invoice_no }}</td>
              <td>{{ purchase.supplier?.name || '-' }}</td>
              <td>{{ formatDate(purchase.purchase_date) }}</td>
              <td>{{ formatCurrency(purchase.subtotal) }}</td>
              <td>{{ formatCurrency(purchase.discount) }}</td>
              <td>{{ formatCurrency(purchase.tax) }}</td>
              <td>{{ formatCurrency(purchase.total_cost) }}</td>
              <td>{{ formatCurrency(purchase.paid_amount) }}</td>
              <td>{{ formatCurrency(purchase.due_amount) }}</td>
              <td>
                <span :class="statusClass(purchase.payment_status)">
                  {{ purchase.payment_status?.toUpperCase() }}
                </span>
              </td>
            <td class="text-center">
  <div class="btn-group" role="group">
    <!-- Toggle Items / Expand -->
    <button
      class="btn btn-sm btn-info"
      @click="toggleItems(purchase.id)"
      :title="expanded.includes(purchase.id) ? 'Collapse Items' : 'View Items'"
    >
      <i :class="expanded.includes(purchase.id) ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </button>

    <!-- Edit Purchase -->
    <router-link
      :to="`/purchases/edit/${purchase.id}`"
      class="btn btn-sm btn-primary"
      title="Edit Purchase"
    >
      <i class="bi bi-pencil-square"></i>
    </router-link>

    <!-- Delete Purchase -->
    <button
      class="btn btn-sm btn-danger"
      @click="deletePurchase(purchase.id)"
      title="Delete Purchase"
    >
      <i class="bi bi-trash"></i>
    </button>

    <!-- View Invoice -->
    <router-link
      :to="`/purchases/invoice/${purchase.id}`"
      class="btn btn-sm btn-secondary"
      title="View Invoice"
    >
      <i class="bi bi-receipt"></i>
    </router-link>
  </div>
</td>

            </tr>

            <!-- Expanded Accordion -->
            <tr v-for="purchase in expandedPurchases" :key="'items-' + purchase.id">
              <td colspan="12" class="p-0">
                <transition name="accordion">
                  <div class="accordion-body p-3" v-show="expanded.includes(purchase.id)">
                    <h6 class="fw-semibold mb-2">
                      <i class="bi bi-box-seam me-1"></i> Items for Invoice: {{ purchase.invoice_no }}
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-hover align-middle mb-0">
                        <thead class="table-secondary">
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in purchase.items" :key="item.id">
                            <td>{{ item.product?.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ formatCurrency(item.unit_price) }}</td>
                            <td>{{ formatCurrency(item.total_cost) }}</td>
                            <td class="d-flex gap-1 flex-wrap">
                              <button class="btn btn-sm btn-warning" @click="editItem(purchase.id, item)">
                                Edit
                              </button>
                              <button class="btn btn-sm btn-danger" @click="deleteItem(purchase.id, item.id)">
                                Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </transition>
              </td>
            </tr>

            <tr v-if="filteredPurchases.length === 0">
              <td colspan="12" class="text-center py-4 text-muted">
                <i class="bi bi-info-circle me-1"></i> No purchases found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center border-top">
        <small class="text-muted">
          Showing {{ startItem }}–{{ endItem }} of {{ filteredPurchases.length }} results
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
  name: "PurchaseList",
  data() {
    return {
      purchases: [],
      suppliers: [],
      filters: { search: "", supplier: "" },
      expanded: [],
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filteredPurchases() {
      return this.purchases.filter((purchase) => {
        const s = this.filters.search.toLowerCase();
        const searchMatch =
          purchase.invoice_no.toLowerCase().includes(s) ||
          purchase.supplier?.name?.toLowerCase().includes(s);

        const supplierMatch =
          !this.filters.supplier || purchase.supplier_id == this.filters.supplier;

        return searchMatch && supplierMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredPurchases.length / this.perPage);
    },
    paginatedPurchases() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredPurchases.slice(start, start + this.perPage);
    },
    startItem() {
      return this.filteredPurchases.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.startItem + this.perPage - 1, this.filteredPurchases.length);
    },
    expandedPurchases() {
      return this.purchases.filter((p) => this.expanded.includes(p.id));
    },
  },
  methods: {
    fetchPurchases() {
      DataService.PurchaseList()
        .then((res) => (this.purchases = res.data))
        .catch((err) => console.error(err));
    },
    fetchSuppliers() {
      DataService.SupplierList()
        .then((res) => (this.suppliers = res.data))
        .catch((err) => console.error(err));
    },
    resetFilters() {
      this.filters = { search: "", supplier: "" };
    },
    toggleItems(id) {
      if (this.expanded.includes(id)) {
        this.expanded = this.expanded.filter((i) => i !== id);
      } else {
        this.expanded.push(id);
      }
    },
    deletePurchase(id) {
      if (!confirm("Are you sure you want to delete this purchase?")) return;
      DataService.DeletePurchase(id)
        .then(() => {
          this.purchases = this.purchases.filter((p) => p.id !== id);
        })
        .catch((err) => console.error(err));
    },
    deleteItem(purchaseId, itemId) {
      if (!confirm("Are you sure you want to delete this item?")) return;

      DataService.DeletePurchaseItem(itemId)
        .then(() => {
          const purchase = this.purchases.find((p) => p.id === purchaseId);
          if (purchase) {
            purchase.items = purchase.items.filter((i) => i.id !== itemId);
          }
        })
        .catch((err) => console.error(err));
    },
    editItem(purchaseId, item) {
      const newUnitPrice = prompt(
        `Update Unit Price for ${item.product?.name}`,
        item.unit_price
      );
      if (newUnitPrice !== null) {
        this.updateItem(purchaseId, item.id, parseFloat(newUnitPrice));
      }
    },
    updateItem(purchaseId, itemId, newPrice) {
      DataService.UpdatePurchaseItem(itemId, { unit_price: newPrice })
        .then(() => {
          const purchase = this.purchases.find((p) => p.id === purchaseId);
          if (purchase) {
            const item = purchase.items.find((i) => i.id === itemId);
            if (item) {
              item.unit_price = newPrice;
              item.total_cost = item.quantity * newPrice;
            }
          }
        })
        .catch((err) => console.error(err));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        value || 0
      );
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      switch (status) {
        case "paid":
          return "badge bg-success";
        case "partial":
          return "badge bg-warning";
        case "due":
          return "badge bg-danger";
        default:
          return "badge bg-secondary";
      }
    },
  },
  mounted() {
    this.fetchPurchases();
    this.fetchSuppliers();
  },
};
</script>

<style scoped>
.purchase-page {
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

/* Accordion Animation */
.accordion-body {
  overflow: hidden;
}
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
