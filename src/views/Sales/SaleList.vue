<template>
  <div class="sales-page">
    <!-- Header -->
    <div class="page-header d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 rounded">
      <h3 class="fw-bold text-white mb-0">
        <i class="bi bi-cart-check me-2"></i> Sales Management
      </h3>
      <router-link to="/sales/add" class="btn btn-gradient shadow-sm">
        <i class="bi bi-plus-circle me-1"></i> Add Sale
      </router-link>
    </div>

    <div v-if="loading" class="alert alert-info text-center shadow-sm rounded">Loading sales...</div>

    <!-- Sales Table -->
    <div class="card shadow-lg border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-primary">
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th>Note</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id" class="accordion-header">
              <td>{{ sale.invoice_no }}</td>
              <td>{{ sale.customer?.name }}</td>
              <td>{{ formatDate(sale.sale_date) }}</td>
              <td>{{ formatCurrency(sale.subtotal) }}</td>
              <td>{{ formatCurrency(sale.discount) }}</td>
              <td>{{ formatCurrency(sale.tax) }}</td>
              <td>{{ formatCurrency(sale.total_price) }}</td>
              <td>{{ formatCurrency(sale.paid_amount) }}</td>
              <td>{{ formatCurrency(sale.due_amount) }}</td>
              <td>
                <span :class="statusClass(sale.payment_status)">
                  {{ sale.payment_status?.toUpperCase() }}
                </span>
              </td>
              <td>{{ sale.note }}</td>
              <td class="text-center">
                <div class="btn-group" role="group">
                  <button
                    class="btn btn-sm btn-info"
                    @click="toggleItems(sale.id)"
                    :title="expanded.includes(sale.id) ? 'Hide Items' : 'View Items'"
                  >
                    <i :class="expanded.includes(sale.id) ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                  </button>

                  <router-link
                    :to="`/sales/edit/${sale.id}`"
                    class="btn btn-sm btn-primary"
                    title="Edit Sale"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </router-link>

                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteSale(sale.id)"
                    title="Delete Sale"
                  >
                    <i class="bi bi-trash"></i>
                  </button>

                  <router-link
                    :to="`/sales/invoice/${sale.id}`"
                    class="btn btn-sm btn-secondary"
                    title="View Invoice"
                  >
                    <i class="bi bi-receipt"></i>
                  </router-link>
                </div>
              </td>
            </tr>

            <!-- Expanded Sale Items -->
            <tr v-for="sale in expandedSales" :key="'items-' + sale.id">
              <td colspan="12" class="p-0">
                <transition name="accordion">
                  <div class="accordion-body p-3" v-show="expanded.includes(sale.id)">
                    <h6 class="fw-semibold mb-2">
                      <i class="bi bi-box2-heart me-1"></i> Items for Invoice: {{ sale.invoice_no }}
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-hover table-sm align-middle mb-0">
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
                          <tr v-for="item in sale.items" :key="item.id">
                            <td>{{ item.product?.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ formatCurrency(item.unit_price) }}</td>
                            <td>{{ formatCurrency(item.total_price) }}</td>
                            <td class="d-flex gap-1 flex-wrap">
                              <button class="btn btn-sm btn-warning" @click="editItem(sale.id, item)">
                                Edit
                              </button>
                              <button class="btn btn-sm btn-danger" @click="deleteItem(sale.id, item.id)">
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

            <tr v-if="sales.length === 0">
              <td colspan="12" class="text-center py-4 text-muted">
                <i class="bi bi-info-circle me-1"></i> No sales found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Item Modal -->
    <div v-if="editingItem" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-pencil-square me-1"></i> Edit Item: {{ editingItem.product?.name }}
          </h5>

          <div class="mb-3">
            <label class="form-label">Quantity</label>
            <input type="number" v-model.number="editingItem.quantity" min="1" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Unit Price</label>
            <input type="number" v-model.number="editingItem.unit_price" min="0" step="0.01" class="form-control" />
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-success w-50" @click="updateItem">Save</button>
            <button class="btn btn-secondary w-50" @click="editingItem = null">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";
export default {
  name: "SaleList",
  // same JS as before
  data() { return { sales: [], expanded: [], loading: false, editingItem: null, editingSaleId: null }; },
  computed: {
    expandedSales() { return this.sales.filter((s) => this.expanded.includes(s.id)); },
  },
  mounted() { this.fetchSales(); },
  methods: {
    fetchSales() {
      this.loading = true;
      DataService.SaleList()
        .then((res) => (this.sales = res.data))
        .catch((err) => console.error(err))
        .finally(() => (this.loading = false));
    },
    refreshSingleSale(id) {
      DataService.GetSale(id)
        .then((res) => {
          const idx = this.sales.findIndex((s) => s.id === id);
          if (idx !== -1) this.$set(this.sales, idx, res.data);
        })
        .catch((err) => console.error(err));
    },
    toggleItems(id) {
      if (this.expanded.includes(id)) this.expanded = this.expanded.filter((i) => i !== id);
      else { this.expanded.push(id); this.refreshSingleSale(id); }
    },
    deleteSale(id) {
      if (confirm("Are you sure you want to delete this sale?")) {
        DataService.DeleteSale(id)
          .then(() => { this.sales = this.sales.filter((s) => s.id !== id); alert("Sale deleted successfully"); })
          .catch((err) => console.error(err));
      }
    },
    editItem(saleId, item) { this.editingItem = { ...item }; this.editingSaleId = saleId; },
    updateItem() {
      const item = this.editingItem;
      DataService.UpdateSaleItem(item.id, { quantity: item.quantity, unit_price: item.unit_price })
        .then(() => {
          this.editingItem = null;
          if (this.expanded.includes(this.editingSaleId)) this.refreshSingleSale(this.editingSaleId);
          alert("Item updated successfully");
        })
        .catch((err) => console.error(err));
    },
    deleteItem(saleId, itemId) {
      if (confirm("Are you sure you want to delete this item?")) {
        DataService.DeleteSaleItem(itemId)
          .then(() => { if (this.expanded.includes(saleId)) this.refreshSingleSale(saleId); alert("Item deleted successfully"); })
          .catch((err) => console.error(err));
      }
    },
    formatCurrency(v) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0); },
    formatDate(d) { return new Date(d).toLocaleDateString(); },
    statusClass(s) {
      switch (s) {
        case "paid": return "badge bg-success";
        case "partial": return "badge bg-warning";
        case "due": return "badge bg-danger";
        default: return "badge bg-secondary";
      }
    },
  },
};
</script>

<style scoped>
.sales-page {
  max-width: 1250px;
  margin: auto;
  background: linear-gradient(135deg, #f9fbff 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 12px;
}

.page-header {
  background: linear-gradient(90deg, #0d6efd, #0056b3);
  color: #fff;
}

.btn-gradient {
  background: linear-gradient(90deg, #007bff, #00bfff);
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.card {
  border-radius: 12px;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
}

.accordion-body {
  background-color: #f8f9fa;
  border-radius: 10px;
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

.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  background: #fff;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
</style>
