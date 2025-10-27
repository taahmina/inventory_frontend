<template>
  <div class="container mt-5">
    <h2>Purchase List</h2>

     <router-link to="/purchases/add" class="btn btn-primary mb-3">
      Add New Purchase
    </router-link>


    <!-- Loading state -->
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
          <td>{{ purchase.supplier.name }}</td>
          <td>{{ purchase.purchase_date }}</td>
          <td>{{ formatCurrency(purchase.subtotal) }}</td>
          <td>{{ formatCurrency(purchase.discount) }}</td>
          <td>{{ formatCurrency(purchase.tax) }}</td>
          <td>{{ formatCurrency(purchase.total_cost) }}</td>
          <td>{{ formatCurrency(purchase.paid_amount) }}</td>
          <td>{{ formatCurrency(purchase.due_amount) }}</td>
          <td>{{ purchase.payment_status }}</td>
          <td>{{ purchase.note }}</td>
          <td class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-info" @click="toggleItems(purchase.id)">
              {{ expanded.includes(purchase.id) ? 'Hide Items' : 'View Items' }}
            </button>
            <button class="btn btn-sm btn-danger" @click="deletePurchase(purchase.id)">
              Delete
            </button>
          </td>
        </tr>

        <!-- Expanded purchase items -->
        <tr v-for="purchase in expandedPurchases" :key="'items-'+purchase.id">
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
                  <td>{{ item.product.name }}</td>
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

    <!-- Modal for editing item -->
    <div v-if="editingItem" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <h5>Edit Item: {{ editingItem.product.name }}</h5>
          <div class="mb-2">
            <label>Quantity</label>
            <input type="number" v-model.number="editingItem.quantity" min="1" class="form-control">
          </div>
          <div class="mb-2">
            <label>Unit Price</label>
            <input type="number" v-model.number="editingItem.unit_price" min="0" step="0.01" class="form-control">
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
      editingPurchaseId: null
    };
  },
  computed: {
    expandedPurchases() {
      return this.purchases.filter(p => this.expanded.includes(p.id));
    }
  },
  mounted() {
    this.fetchPurchases();
  },
  methods: {
    fetchPurchases() {
      this.loading = true;
      DataService.PurchaseList()
        .then(res => this.purchases = res.data)
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    },
    toggleItems(id) {
      if(this.expanded.includes(id)) {
        this.expanded = this.expanded.filter(i => i !== id);
      } else {
        this.expanded.push(id);
      }
    },
    deletePurchase(id) {
      if(confirm("Are you sure you want to delete this purchase?")) {
        DataService.DeletePurchase(id)
          .then(() => {
            this.purchases = this.purchases.filter(p => p.id !== id);
            this.expanded = this.expanded.filter(i => i !== id);
          })
          .catch(err => console.log(err));
      }
    },
    editItem(purchaseId, item) {
      this.editingItem = {...item}; // clone object to edit
      this.editingPurchaseId = purchaseId;
    },
    updateItem() {
      const item = this.editingItem;
      DataService.UpdatePurchaseItem(item.id, {
        quantity: item.quantity,
        unit_price: item.unit_price
      })
      .then(res => {
        // update frontend
        const purchase = this.purchases.find(p => p.id === this.editingPurchaseId);
        const idx = purchase.items.findIndex(i => i.id === item.id);
        if(idx !== -1) purchase.items[idx] = res.data.item;
        this.editingItem = null;
        alert("Item updated successfully");
      })
      .catch(err => console.log(err));
    },
    deleteItem(purchaseId, itemId) {
      if(confirm("Are you sure you want to delete this item?")) {
        DataService.DeletePurchaseItem(itemId)
          .then(() => {
            const purchase = this.purchases.find(p => p.id === purchaseId);
            purchase.items = purchase.items.filter(i => i.id !== itemId);
            alert("Item deleted successfully");
          })
          .catch(err => console.log(err));
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  }
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
