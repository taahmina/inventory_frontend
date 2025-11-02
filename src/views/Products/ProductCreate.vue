<template>
  <div class="product-form-page">
    <!-- Header -->
    <div class="page-header d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 rounded">
      <h3 class="fw-bold mb-0">
        <i class="bi bi-box-seam me-2"></i> Add New Product
      </h3>
      <router-link to="/products" class="btn btn-outline-light shadow-sm">
        <i class="bi bi-arrow-left me-1"></i> Back to List
      </router-link>
    </div>

    <!-- Form Card -->
    <div class="card shadow-sm p-4 form-card">
      <form @submit.prevent="addProduct" enctype="multipart/form-data">
        <div class="row g-3">

          <div class="col-md-4">
            <label class="form-label">Category <span class="text-danger">*</span></label>
            <select class="form-select" v-model="product.category_id" required>
              <option value="">Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Supplier</label>
            <select class="form-select" v-model="product.supplier_id">
              <option value="">Select Supplier</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-label">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="product.name" required>
          </div>

           <div class="col-md-4">
            <label class="form-label">Brand</label>
            <input type="text" class="form-control" v-model="product.brand">
          </div>

          <div class="col-md-4">
            <label class="form-label">Unit</label>
            <input type="text" class="form-control" v-model="product.unit">
          </div>

          <div class="col-md-4">
            <label class="form-label">SKU</label>
            <input type="text" class="form-control" v-model="product.sku">
          </div>

         

          <div class="col-md-12">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="product.description" rows="3"></textarea>
          </div>

          <div class="col-md-4">
            <label class="form-label">Buy Price <span class="text-danger">*</span></label>
            <input type="number" class="form-control" v-model.number="product.buy_price" required>
          </div>

          <div class="col-md-4">
            <label class="form-label">Sell Price <span class="text-danger">*</span></label>
            <input type="number" class="form-control" v-model.number="product.sell_price" required>
          </div>

          <div class="col-md-4">
            <label class="form-label">Stock <span class="text-danger">*</span></label>
            <input type="number" class="form-control" v-model.number="product.stock" required>
          </div>

          

          <div class="col-md-4">
            <label class="form-label">Image</label>
            <input type="file" @change="handleImage" accept="image/*" class="form-control">
          </div>

          <div class="col-md-4">
            <label class="form-label">Status</label>
            <select class="form-select" v-model.number="product.status">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

          <div class="col-md-12 mt-3">
            <button class="btn btn-gradient" type="submit">
              <i class="bi bi-save me-1"></i> Add Product
            </button>
          </div>

        </div>
      </form>
    </div>
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
      }
    };
  },
  methods: {
    fetchCategories() { DataService.CategoryList().then(res => this.categories = res.data); },
    fetchSuppliers() { DataService.SupplierList().then(res => this.suppliers = res.data); },
    handleImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) this.product.image = file;
      else alert("Please select a valid image file.");
    },
    addProduct() {
      const formData = new FormData();
      for (const key in this.product) formData.append(key, this.product[key]);
      DataService.AddProduct(formData)
        .then(() => this.$router.push({ name: "product_list" }))
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchSuppliers();
  }
};
</script>

<style scoped>
.product-form-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
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
.form-card {
  border-left: 5px solid #007bff;
  border-radius: 12px;
  background-color: #f0f5ff;
}
</style>
