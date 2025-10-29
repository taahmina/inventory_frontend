<template>
  <div class="container mt-5">
    <h2>Edit Customer</h2>

    <form @submit.prevent="updateCustomer">
      <div class="row mb-3">
        <div class="col-md-6">
          <label>Name</label>
          <input type="text" class="form-control" v-model="customer.name" required>
        </div>
        <div class="col-md-6">
          <label>Email</label>
          <input type="email" class="form-control" v-model="customer.email">
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label>Phone</label>
          <input type="text" class="form-control" v-model="customer.phone">
        </div>
        <div class="col-md-6">
          <label>Address</label>
          <input type="text" class="form-control" v-model="customer.address">
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Update Customer</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "CustomerEdit",
  data() {
    return {
      customer: {
        name: "",
        email: "",
        phone: "",
        address: ""
      }
    };
  },
  mounted() {
    this.fetchCustomer();
  },
  methods: {
    fetchCustomer() {
      const id = this.$route.params.id;
      DataService.GetCustomer(id)
        .then(res => this.customer = res.data)
        .catch(err => console.error(err));
    },
    updateCustomer() {
      const id = this.$route.params.id;
      if(!this.customer.name) return alert("Name is required.");

      DataService.UpdateCustomer(id, this.customer)
        .then(() => {
          alert("Customer updated successfully!");
          this.$router.push({ name: "customer_list" });
        })
        .catch(err => {
          console.error(err);
          alert("Error updating customer. Check console.");
        });
    }
  }
};
</script>

<style scoped>
</style>
