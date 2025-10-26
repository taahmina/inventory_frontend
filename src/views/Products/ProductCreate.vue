<template>
  <div class="container mt-5">
    <h2>Add New Product</h2>
    <form @submit.prevent="addProduct" enctype="multipart/form-data">
      <div class="row">

        <div class="col-md-4 mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="product.name" required>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Unit</label>
          <input type="text" class="form-control" v-model="product.unit">
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">SKU</label>
          <input type="text" class="form-control" v-model="product.sku">
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Category</label>
          <select class="form-select" v-model="product.category_id" required>
            <option value="">Select Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Supplier</label>
          <select class="form-select" v-model="product.supplier_id">
            <option value="">Select Supplier</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Brand</label>
          <input type="text" class="form-control" v-model="product.brand">
        </div>

        <div class="col-md-12 mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" v-model="product.description"></textarea>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Buy Price</label>
          <input type="number" class="form-control" v-model="product.buy_price" required>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Sell Price</label>
          <input type="number" class="form-control" v-model="product.sell_price" required>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Stock</label>
          <input type="number" class="form-control" v-model="product.stock" required>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="product.status" required>
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>

        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Image</label>
          <input type="file" @change="handleImage" accept="image/*" class="form-control">
        </div>

        <div class="col-md-12">
          <button class="btn btn-primary" type="submit">Add Product</button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ProductCreate",
  data() {
    return {
      categories: [],
      suppliers: [],
      product: {
        name: "",
        unit: "",
        sku: "",
        image: null,
        category_id: "",
        supplier_id: "",
        brand: "",
        description: "",
        buy_price: 0,
        sell_price: 0,
        stock: 0,
        status: 1
      
      },
    };
  },
  methods: {
    fetchCategories() {
      DataService.CategoryList()
        .then(res => this.categories = res.data)
        .catch(err => console.log(err));
    },
    fetchSuppliers() {
      DataService.SupplierList()
        .then(res => this.suppliers = res.data)
        .catch(err => console.log(err));
    },
    handleImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.product.image = file;
      } else {
        alert("Please select a valid image file (jpeg, png, jpg, gif).");
        this.product.image = null;
        event.target.value = "";
      }
    },
    addProduct() {
      if (!this.product.image) {
        alert("Please select an image for the product.");
        return;
      }

      const formData = new FormData();

      // Map status to 1 (active) or 0 (inactive)
      const statusValue = this.product.status === 'active' ? 1 : 0;

      for (const key in this.product) {
        if (key === "status") {
          formData.append(key, statusValue);
        } else {
          formData.append(key, this.product[key]);
        }
      }

      DataService.AddProduct(formData)
        .then(() => {
          alert("Product added successfully!");
          this.$router.push({ name: "product_list" });
        })
        .catch(err => {
          if (err.response && err.response.data) {
            console.log("Error:", err.response.data);
            alert(JSON.stringify(err.response.data));
          } else {
            console.log(err);
          }
        });
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchSuppliers();
  },
};
</script>
