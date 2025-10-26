<template>
  <div class="container mt-5">
    <h3><strong>All Suppliers</strong></h3>
    <router-link to="/add_supplier" class="btn btn-primary mb-3">Add New Supplier</router-link>

    <table class="table table-bordered">
      <thead class="table-info">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
          <td>{{ index + 1 }}</td>
          <td>{{ supplier.name }}</td>
          <td>{{ supplier.email }}</td>
          <td>{{ supplier.phone }}</td>
          <td>{{ supplier.address }}</td>
          <td>
            <router-link :to="`/edit_supplier/${supplier.id}`" class="btn btn-sm btn-warning me-2">Edit</router-link>
            <button @click="deleteSupplier(supplier.id)" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "SupplierList",
  data() {
    return {
      suppliers: [],
    };
  },
  methods: {
    getSuppliers() {
      DataService.SupplierList()
        .then((response) => {
          this.suppliers = response.data;
        })
        .catch((e) => console.log(e));
    },
    deleteSupplier(id) {
      if (confirm("Are you sure to delete this supplier?")) {
        DataService.deleteSupplier(id)
          .then(() => {
            alert("Supplier deleted successfully!");
            this.getSuppliers();
          })
          .catch((e) => console.log(e));
      }
    },
  },
  mounted() {
    this.getSuppliers();
  },
};
</script>
