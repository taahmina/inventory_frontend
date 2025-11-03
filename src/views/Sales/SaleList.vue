<template>
  <div class="container mt-5">
    <h2>Sales List</h2>

    <router-link to="/sales/add" class="btn btn-primary mb-3">
      Add New Sale
    </router-link>

    <div v-if="loading" class="alert alert-info">Loading sales...</div>

    <table v-else class="table table-bordered table-striped">
      <thead class="table-light">
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
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
          <td class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-info" @click="toggleItems(sale.id)">
              {{ expanded.includes(sale.id) ? 'Hide Items' : 'View Items' }}
            </button>
            <router-link :to="`/sales/edit/${sale.id}`" class="btn btn-sm btn-primary">
              Edit
            </router-link>
            <button class="btn btn-sm btn-danger" @click="deleteSale(sale.id)">
              Delete
            </button>
            <router-link :to="`/sales/invoice/${sale.id}`" class="btn btn-sm btn-secondary" title="View Invoice">
            <i class="bi bi-receipt"></i>
          </router-link>

          </td>
        </tr>

        <!-- Expanded Sale Items -->
        <tr v-for="sale in expandedSales" :key="'items-' + sale.id">
          <td colspan="12">
            <table class="table table-sm table-bordered mb-0">
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
                  <td class="d-flex gap-1">
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
          </td>
        </tr>

        <tr v-if="sales.length === 0">
          <td colspan="12" class="text-center">No sales found</td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Item Modal -->
    <div v-if="editingItem" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5>Edit Item: {{ editingItem.product?.name }}</h5>

          <div class="mb-2">
            <label>Quantity</label>
            <input
              type="number"
              v-model.number="editingItem.quantity"
              min="1"
              class="form-control"
            />
          </div>

          <div class="mb-2">
            <label>Unit Price</label>
            <input
              type="number"
              v-model.number="editingItem.unit_price"
              min="0"
              step="0.01"
              class="form-control"
            />
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-success" @click="updateItem">Save</button>
            <button class="btn btn-secondary" @click="editingItem = null">Cancel</button>
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
  data() {
    return {
      sales: [],
      expanded: [],
      loading: false,
      editingItem: null,
      editingSaleId: null,
    };
  },
  computed: {
    expandedSales() {
      return this.sales.filter((s) => this.expanded.includes(s.id));
    },
  },
  mounted() {
    this.fetchSales();
  },
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
      if (this.expanded.includes(id)) {
        this.expanded = this.expanded.filter((i) => i !== id);
      } else {
        this.expanded.push(id);
        this.refreshSingleSale(id);
      }
    },

    deleteSale(id) {
      if (confirm("Are you sure you want to delete this sale?")) {
        DataService.DeleteSale(id)
          .then(() => {
            this.sales = this.sales.filter((s) => s.id !== id);
            this.expanded = this.expanded.filter((i) => i !== id);
            alert("Sale deleted successfully");
          })
          .catch((err) => console.error(err));
      }
    },

    editItem(saleId, item) {
      this.editingItem = { ...item };
      this.editingSaleId = saleId;
    },

    updateItem() {
      const item = this.editingItem;
      DataService.UpdateSaleItem(item.id, {
        quantity: item.quantity,
        unit_price: item.unit_price,
      })
        .then(() => {
          this.editingItem = null;
          if (this.expanded.includes(this.editingSaleId)) {
            this.refreshSingleSale(this.editingSaleId);
          }
          alert("Item updated successfully");
        })
        .catch((err) => console.error(err));
    },

    deleteItem(saleId, itemId) {
      if (confirm("Are you sure you want to delete this item?")) {
        DataService.DeleteSaleItem(itemId)
          .then(() => {
            if (this.expanded.includes(saleId)) {
              this.refreshSingleSale(saleId);
            }
            alert("Item deleted successfully");
          })
          .catch((err) => console.error(err));
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    statusClass(status) {
      switch (status) {
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
.table { border-collapse: collapse; }

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
  border-radius: 6px;
  width: 400px;
  max-width: 90%;
  padding: 15px;
}
</style>
