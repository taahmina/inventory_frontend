<template>
  <div class="container mt-5">
    <h2>Add Customer</h2>

    <form @submit.prevent="submitCustomer">
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

      <button type="submit" class="btn btn-primary">Save Customer</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "CustomerCreate",
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
  methods: {
    submitCustomer() {
      if(!this.customer.name) return alert("Name is required.");

      DataService.AddCustomer(this.customer)
        .then(() => {
          alert("Customer created successfully!");
          this.$router.push({ name: "customer_list" });
        })
        .catch(err => {
          console.error(err);
          alert("Error creating customer. Check console.");
        });
    }
  }
};
</script>

<style scoped>
</style>
