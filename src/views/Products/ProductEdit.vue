<template>
  <div class="container mt-5">
    <h2>Edit Product</h2>
    <form @submit.prevent="updateProduct" enctype="multipart/form-data">
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">Image</label>
          <input type="file" @change="handleImage" class="form-control">
        </div>

        <div class="col-md-12">
          <button class="btn btn-primary" type="submit">Update Product</button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ProductEdit",
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
        status: "active",
      },
    };
  },
  methods: {
    fetchCategories() {
      DataService.CategoryList().then(res => this.categories = res.data).catch(err => console.log(err));
    },
    fetchSuppliers() {
      DataService.SupplierList().then(res => this.suppliers = res.data).catch(err => console.log(err));
    },
    handleImage(event) {
      this.product.image = event.target.files[0];
    },
    getProduct(id) {
      DataService.SingleProduct(id)
        .then(res => {
          if(res.data) this.product = res.data;
        })
        .catch(err => console.log(err));
    },
    updateProduct() {
      const formData = new FormData();
      for (const key in this.product) {
        formData.append(key, this.product[key]);
      }
      const id = this.$route.params.id;
      DataService.UpdateProduct(id, formData)
        .then(() => {
          alert("Product updated successfully!");
          this.$router.push({ name: "product_list" });
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchSuppliers();
    const id = this.$route.params.id;
    if(id) this.getProduct(id);
  }
};
</script>
