<template>
  <div class="container mt-5">
    <h2>All Products</h2>

    <router-link to="/products/add" class="btn btn-primary mb-3">
      Add New Product
    </router-link>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>#SL</th>
          <th>Name</th>
          <th>Unit</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Brand</th>
          <th>Description</th>
          <th>Buy Price</th>
          <th>Sell Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.unit || '-' }}</td>
          <td>{{ product.sku || '-' }}</td>
          <td>{{ product.category?.name || '-' }}</td>
          <td>{{ product.supplier?.name || '-' }}</td>
          <td>{{ product.brand || '-' }}</td>
          <td>{{ product.description || '-' }}</td>
          <td>{{ product.buy_price || 0 }}</td>
          <td>{{ product.sell_price || 0 }}</td>
          <td>{{ product.stock || 0 }}</td>
          <td>
            <span
              :class="product.status == 1 ? 'badge bg-success' : 'badge bg-secondary'"
            >
              {{ product.status == 1 ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <img
              v-if="product.image"
              :src="product.image"
              alt="Product Image"
              style="width: 50px; height: 50px; object-fit: cover;"
            />
            <span v-else>-</span>
          </td>
          <td>
            <router-link
              :to="`/products/edit/${product.id}`"
              class="btn btn-sm btn-primary me-2"
            >
              Edit
            </router-link>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteProduct(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td colspan="14" class="text-center">No products found.</td>
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
        .then((res) => {
          // If your API returns status as 1/0, you can optionally map it here
          this.products = res.data.map(product => ({
            ...product,
            status: product.status != null ? Number(product.status) : 0,
          }));
        })
        .catch((err) => console.log(err));
    },
    deleteProduct(id) {
      if (confirm("Are you sure you want to delete this product?")) {
        DataService.DeleteProduct(id)
          .then(() => {
            alert("Product deleted successfully!");
            this.fetchProducts();
          })
          .catch((err) => console.log(err));
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.badge {
  font-size: 0.9em;
}
</style>
