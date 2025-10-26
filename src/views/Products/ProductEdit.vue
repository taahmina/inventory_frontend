<template>
  <div class="container mt-5" v-if="categories.length && suppliers.length">
    <h2>Edit Product</h2>
    <form @submit.prevent="updateProduct" enctype="multipart/form-data">
      <div class="row">

        <!-- Name -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="product.name">
          <span class="text-danger" v-if="errors.name">{{ errors.name[0] }}</span>
        </div>

        <!-- Unit -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Unit</label>
          <input type="text" class="form-control" v-model="product.unit">
        </div>

        <!-- SKU -->
        <div class="col-md-4 mb-3">
          <label class="form-label">SKU</label>
          <input type="text" class="form-control" v-model="product.sku">
        </div>

        <!-- Category -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Category</label>
          <select class="form-select" v-model="product.category_id" >
            <option value="">Select Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <span class="text-danger" v-if="errors.category_id">{{ errors.category_id[0] }}</span>
        </div>

        <!-- Supplier -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Supplier</label>
          <select class="form-select" v-model="product.supplier_id">
            <option value="">Select Supplier</option>
            <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
          </select>
        </div>

        <!-- Brand -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Brand</label>
          <input type="text" class="form-control" v-model="product.brand">
        </div>

        <!-- Description -->
        <div class="col-md-12 mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" v-model="product.description"></textarea>
        </div>

        <!-- Buy Price -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Buy Price</label>
          <input type="number" class="form-control" v-model.number="product.buy_price" >
          <span class="text-danger" v-if="errors.buy_price">{{ errors.buy_price[0] }}</span>
        </div>

        <!-- Sell Price -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Sell Price</label>
          <input type="number" class="form-control" v-model.number="product.sell_price" >
          <span class="text-danger" v-if="errors.sell_price">{{ errors.sell_price[0] }}</span>
        </div>

        <!-- Stock -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Stock</label>
          <input type="number" class="form-control" v-model.number="product.stock" >
          <span class="text-danger" v-if="errors.stock">{{ errors.stock[0] }}</span>
        </div>

        <!-- Status -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model.number="product.status" >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
          <span class="text-danger" v-if="errors.status">{{ errors.status[0] }}</span>
        </div>

        <!-- Image -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Image</label>
          <input type="file" @change="handleImage" accept="image/*" class="form-control">
          <div v-if="product.image_url" class="mt-2">
            <img :src="product.image_url" alt="Product Image" style="max-width: 100px;">
          </div>
        </div>

        <!-- Submit -->
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
        image_url: "",
        category_id: "",
        supplier_id: "",
        brand: "",
        description: "",
        buy_price: 0,
        sell_price: 0,
        stock: 0,
        status: 1
      },
      errors: {},
    };
  },
  methods: {
    fetchCategories() {
      return DataService.CategoryList()
        .then(res => this.categories = res.data)
        .catch(err => console.log(err));
    },
    fetchSuppliers() {
      return DataService.SupplierList()
        .then(res => this.suppliers = res.data)
        .catch(err => console.log(err));
    },
    fetchProduct() {
      const id = this.$route.params.id;
      DataService.SingleProduct(id)
        .then(res => {
          this.product = {
            ...res.data,
            image: null,
            image_url: res.data.image_url || ""
          };
        })
        .catch(err => console.log(err));
    },
    handleImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.product.image = file;
      } else {
        alert("Please select a valid image file.");
        this.product.image = null;
        event.target.value = "";
      }
    },
    updateProduct() {
      const formData = new FormData();

      for (const key in this.product) {
        if (key === "image" && !this.product.image) continue;
        formData.append(key, this.product[key]);
      }
      formData.append("_method", "PUT"); // For Laravel PUT

      DataService.UpdateProduct(this.$route.params.id, formData)
        .then(() => {
          alert("Product updated successfully!");
          this.$router.push({ name: "product_list" });
        })
        .catch(err => {
          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
          } else {
            console.log(err);
          }
        });
    }
  },
  mounted() {
    Promise.all([this.fetchCategories(), this.fetchSuppliers()])
      .then(() => this.fetchProduct());
  },
};
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  padding: 2px;
}
.text-danger {
  font-size: 0.85rem;
}
</style>
