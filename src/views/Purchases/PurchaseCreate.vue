<template>
  <div class="container mt-5">
    <h2>Add Purchase</h2>

    <form @submit.prevent="submitPurchase">
      <!-- Supplier and Date -->
      <div class="row mb-3">
        <div class="col-md-4">
          <label>Supplier</label>
          <select class="form-select" v-model="purchase.supplier_id" required>
            <option value="">Select Supplier</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label>Purchase Date</label>
          <input type="date" class="form-control" v-model="purchase.purchase_date" required>
        </div>
      </div>

      <!-- Products Table -->
      <h5>Products</h5>
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in purchase.items" :key="index">
            <td>
              <select class="form-select" v-model="item.product_id" required>
                <option value="">Select Product</option>
                <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }}</option>
              </select>
            </td>
            <td>
              <input type="number" class="form-control" v-model.number="item.quantity" min="1" required>
            </td>
            <td>
              <input type="number" class="form-control" v-model.number="item.unit_price" min="0" step="0.01" required>
            </td>
            <td>{{ formatCurrency(itemTotal(item)) }}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="removeItem(index)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button" class="btn btn-secondary mb-3" @click="addItem">Add Product</button>

      <!-- Summary -->
      <div class="row mb-3">
        <div class="col-md-2">
          <label>Discount</label>
          <input type="number" class="form-control" v-model.number="purchase.discount" min="0" step="0.01">
        </div>
        <div class="col-md-2">
          <label>Tax</label>
          <input type="number" class="form-control" v-model.number="purchase.tax" min="0" step="0.01">
        </div>
        <div class="col-md-2">
          <label>Paid Amount</label>
          <input type="number" class="form-control" v-model.number="purchase.paid_amount" min="0" step="0.01">
        </div>
        <div class="col-md-6">
          <label>Note</label>
          <input type="text" class="form-control" v-model="purchase.note">
        </div>
      </div>

      <div class="mb-3">
        <strong>Subtotal:</strong> {{ formatCurrency(subtotal) }},
        <strong>Total:</strong> {{ formatCurrency(total) }},
        <strong>Due:</strong> {{ formatCurrency(due) }}
      </div>

      <button type="submit" class="btn btn-primary">Save Purchase</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "PurchaseCreate",
  data() {
    return {
      suppliers: [],
      products: [],
      purchase: {
        supplier_id: "",
        purchase_date: new Date().toISOString().substr(0, 10),
        items: [],
        discount: 0,
        tax: 0,
        paid_amount: 0,
        note: ""
      }
    };
  },
  computed: {
    subtotal() {
      return this.purchase.items.reduce((sum, item) => sum + this.itemTotal(item), 0);
    },
    total() {
      return Math.max(this.subtotal - (this.purchase.discount || 0) + (this.purchase.tax || 0), 0);
    },
    due() {
      return Math.max(this.total - (this.purchase.paid_amount || 0), 0);
    }
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchProducts();
    this.addItem();
  },
  methods: {
    fetchSuppliers() {
      DataService.SupplierList()
        .then(res => this.suppliers = res.data)
        .catch(err => console.error(err));
    },
    fetchProducts() {
      DataService.ProductList()
        .then(res => this.products = res.data)
        .catch(err => console.error(err));
    },
    addItem() {
      this.purchase.items.push({ product_id: "", quantity: 1, unit_price: 0 });
    },
    removeItem(index) {
      this.purchase.items.splice(index, 1);
    },
    itemTotal(item) {
      return (item.quantity || 0) * (item.unit_price || 0);
    },
    submitPurchase() {
      if (!this.purchase.supplier_id) {
        alert("Please select a supplier.");
        return;
      }
      if (this.purchase.items.length === 0) {
        alert("Add at least one product.");
        return;
      }
      // Validate products
      for (let i = 0; i < this.purchase.items.length; i++) {
        if (!this.purchase.items[i].product_id) {
          alert(`Select product for row ${i + 1}`);
          return;
        }
      }

      DataService.AddPurchase(this.purchase)
        .then(() => {
          alert("Purchase created successfully!");
          this.$router.push({ name: "purchase_list" });
        })
        .catch(err => {
          console.error(err);
          alert("Error creating purchase. Check console for details.");
        });
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  }
};
</script>

<style scoped>
.table { border-collapse: collapse; }
</style>
