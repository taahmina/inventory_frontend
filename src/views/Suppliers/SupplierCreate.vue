<template>
  <div class="container mt-5">
    <h3><strong>Add New Supplier</strong></h3>
    <form @submit.prevent="saveSupplier">
      <div class="mb-3">
        <label>Name</label>
        <input v-model="supplier.name" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Email</label>
        <input v-model="supplier.email" type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Phone</label>
        <input v-model="supplier.phone" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Address</label>
        <textarea v-model="supplier.address" class="form-control"></textarea>
      </div>
      <button type="submit" class="btn btn-success">Save</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "SupplierCreate",
  data() {
    return {
      supplier: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    saveSupplier() {
      DataService.createSupplier(this.supplier)
        .then(() => {
          alert("Supplier added successfully!");
          this.$router.push("/suppliers");
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>
