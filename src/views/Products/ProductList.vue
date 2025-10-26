<template>
  <div class="container mt-5">
    <h2>All Products</h2>
    <router-link to="/products/add" class="btn btn-primary mb-3">Add New Product</router-link>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#SL</th>
          <th>Name</th>
          <th>Unit</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.unit }}</td>
          <td>{{ product.sku }}</td>
          <td>{{ product.category.name }}</td>
          <td>{{ product.supplier?.name || '-' }}</td>
          <td>{{ product.brand }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.status }}</td>
          <td>
            <router-link :to="`/products/edit/${product.id}`" class="btn btn-sm btn-primary me-2">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ProductList",
  data() {
    return {
      products: [],
    };
  },
  methods: {
    fetchProducts() {
      DataService.ProductList()
        .then(res => this.products = res.data)
        .catch(err => console.log(err));
    },
    deleteProduct(id) {
      if(confirm("Are you sure you want to delete this product?")) {
        DataService.DeleteProduct(id)
          .then(() => {
            alert("Product deleted successfully!");
            this.fetchProducts();
          })
          .catch(err => console.log(err));
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>
