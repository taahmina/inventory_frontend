<template>
  <div>
    <h2>Customer List</h2>
    <router-link to="/customers/add" class="btn btn-primary mb-3">Add Customer</router-link>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.name }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.address }}</td>
          <td>
            <router-link :to="`/customers/edit/${customer.id}`" class="btn btn-sm btn-primary">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click="deleteCustomer(customer.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  data() {
    return { customers: [] };
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    fetchCustomers() {
      DataService.CustomerList().then(res => this.customers = res.data);
    },
    deleteCustomer(id) {
      if(confirm('Are you sure?')) {
        DataService.DeleteCustomer(id).then(() => this.fetchCustomers());
      }
    }
  }
};
</script>
