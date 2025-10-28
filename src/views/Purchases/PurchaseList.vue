<template>
  <div class="container mt-5">
    <h2>Purchase List</h2>

    <router-link to="/purchases/add" class="btn btn-primary mb-3">
      Add New Purchase
    </router-link>

    <div v-if="loading" class="alert alert-info">Loading purchases...</div>

    <table v-else class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
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
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="purchase in purchases" :key="purchase.id">
          <td>{{ purchase.invoice_no }}</td>
          <td>{{ purchase.supplier?.name }}</td>
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
          <td>{{ purchase.note }}</td>
          <td class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-info" @click="toggleItems(purchase.id)">
              {{ expanded.includes(purchase.id) ? 'Hide Items' : 'View Items' }}
            </button>
            <router-link :to="`/purchases/edit/${purchase.id}`" class="btn btn-sm btn-primary">
              Edit
            </router-link>
            <button class="btn btn-sm btn-danger" @click="deletePurchase(purchase.id)">
              Delete
            </button>
          </td>
        </tr>

        <!-- Expanded Purchase Items -->
        <tr v-for="purchase in expandedPurchases" :key="'items-' + purchase.id">
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
                <tr v-for="item in purchase.items" :key="item.id">
                  <td>{{ item.product?.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.unit_price) }}</td>
                  <td>{{ formatCurrency(item.total_cost) }}</td>
                  <td class="d-flex gap-1">
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
          </td>
        </tr>

        <tr v-if="purchases.length === 0">
          <td colspan="12" class="text-center">No purchases found</td>
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
  name: "PurchaseList",
  data() {
    return {
      purchases: [],
      expanded: [],
      loading: false,
      editingItem: null,
      editingPurchaseId: null,
    };
  },
  computed: {
    expandedPurchases() {
      return this.purchases.filter((p) => this.expanded.includes(p.id));
    },
  },
  mounted() {
    this.fetchPurchases();
  },
  methods: {
    // ===== Fetch All Purchases =====
    fetchPurchases() {
      this.loading = true;
      DataService.PurchaseList()
        .then((res) => (this.purchases = res.data))
        .catch((err) => console.error(err))
        .finally(() => (this.loading = false));
    },

    // ===== Refresh Single Purchase (After Edit/Delete Item) =====
    refreshSinglePurchase(id) {
      DataService.GetPurchase(id)
        .then((res) => {
          const idx = this.purchases.findIndex((p) => p.id === id);
          if (idx !== -1) this.$set(this.purchases, idx, res.data);
        })
        .catch((err) => console.error(err));
    },

    toggleItems(id) {
      if (this.expanded.includes(id)) {
        this.expanded = this.expanded.filter((i) => i !== id);
      } else {
        this.expanded.push(id);
        // Auto-refresh latest data when expanding
        this.refreshSinglePurchase(id);
      }
    },

    deletePurchase(id) {
      if (confirm("Are you sure you want to delete this purchase?")) {
        DataService.DeletePurchase(id)
          .then(() => {
            this.purchases = this.purchases.filter((p) => p.id !== id);
            this.expanded = this.expanded.filter((i) => i !== id);
            alert("Purchase deleted successfully");
          })
          .catch((err) => console.error(err));
      }
    },

    editItem(purchaseId, item) {
      this.editingItem = { ...item };
      this.editingPurchaseId = purchaseId;
    },

    updateItem() {
      const item = this.editingItem;
      DataService.UpdatePurchaseItem(item.id, {
        quantity: item.quantity,
        unit_price: item.unit_price,
      })
        .then(() => {
          this.editingItem = null;
          // ✅ Auto-refresh expanded purchase section after saving
          if (this.expanded.includes(this.editingPurchaseId)) {
            this.refreshSinglePurchase(this.editingPurchaseId);
          }
          alert("Item updated successfully");
        })
        .catch((err) => console.error(err));
    },

    deleteItem(purchaseId, itemId) {
      if (confirm("Are you sure you want to delete this item?")) {
        DataService.DeletePurchaseItem(itemId)
          .then(() => {
            // ✅ Auto-refresh expanded purchase section after deleting
            if (this.expanded.includes(purchaseId)) {
              this.refreshSinglePurchase(purchaseId);
            }
            alert("Item deleted successfully");
          })
          .catch((err) => console.error(err));
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value || 0);
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
};
</script>


<style scoped>
.table {
  border-collapse: collapse;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
