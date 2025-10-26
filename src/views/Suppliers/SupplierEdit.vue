<template>
  <div class="container mt-5">
    <h3><strong>Edit Supplier</strong></h3>
    <form @submit.prevent="updateSupplier">
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
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "SupplierEdit",
  data() {
    return {
      supplier: {},
    };
  },
  methods: {
    getSupplier() {
      DataService.SupplierList(this.$route.params.id)
        .then((response) => {
          this.supplier = response.data;
        })
        .catch((e) => console.log(e));
    },
    updateSupplier() {
      DataService.updateSupplier(this.$route.params.id, this.supplier)
        .then(() => {
          alert("Supplier updated successfully!");
          this.$router.push("/suppliers");
        })
        .catch((e) => console.log(e));
    },
  },
  mounted() {
    this.getSupplier();
  },
};
</script>
