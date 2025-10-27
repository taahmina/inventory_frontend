<template>
  <div class="container mt-5">
    <h2>Edit Purchase</h2>

    <form @submit.prevent="updatePurchase">
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

      <!-- Products list -->
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
          <tr v-for="(item, index) in purchase.items" :key="item.id || index">
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
            <td>{{ formatCurrency(item.quantity * item.unit_price) }}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="removeItem(index, item)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button" class="btn btn-secondary mb-3" @click="addItem">Add Product</button>

      <!-- Purchase summary -->
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

      <button type="submit" class="btn btn-primary">Update Purchase</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "PurchaseEdit",
  data() {
    return {
      suppliers: [],
      products: [],
      purchase: {
        supplier_id: "",
        purchase_date: "",
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
      return this.purchase.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    },
    total() {
      return this.subtotal - this.purchase.discount + this.purchase.tax;
    },
    due() {
      return this.total - this.purchase.paid_amount;
    }
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchProducts();
    this.fetchPurchase();
  },
  methods: {
    fetchSuppliers() {
      DataService.SupplierList()
        .then(res => this.suppliers = res.data)
        .catch(err => console.log(err));
    },
    fetchProducts() {
      DataService.ProductList()
        .then(res => this.products = res.data)
        .catch(err => console.log(err));
    },
    fetchPurchase() {
      const id = this.$route.params.id;
      DataService.GetPurchase(id)
        .then(res => {
          this.purchase = res.data;
        })
        .catch(err => console.log(err));
    },
    addItem() {
      this.purchase.items.push({ product_id: "", quantity: 1, unit_price: 0 });
    },
    removeItem(index, item) {
      // If item has an ID, delete via API first
      if(item.id) {
        if(confirm("Are you sure you want to delete this item?")) {
          DataService.DeletePurchaseItem(item.id)
            .then(() => {
              this.purchase.items.splice(index, 1);
            })
            .catch(err => console.log(err));
        }
      } else {
        this.purchase.items.splice(index, 1);
      }
    },
    updatePurchase() {
      const id = this.$route.params.id;
      DataService.UpdatePurchase(id, this.purchase)
        .then(() => {
          alert("Purchase updated successfully!");
          this.$router.push({ name: "purchase_list" });
        })
        .catch(err => {
          console.log(err);
          alert("Error updating purchase. Check console for details.");
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
