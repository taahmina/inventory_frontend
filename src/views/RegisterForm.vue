<template>
  <div class="container-xxl py-5">
    <div class="row justify-content-center">
      <div class="col-6">
        <h2 class="text-center text-primary mb-4">Register</h2>
        <form class="border p-4 bg-light rounded">
          <div class="mb-3">
            <label class="form-label text-primary">Name</label>
            <input type="text" v-model="formData.name" class="form-control" placeholder="Enter your name"/>
          </div>

          <div class="mb-3">
            <label class="form-label text-primary">Email</label>
            <input type="email" v-model="formData.email" class="form-control" placeholder="Enter your email"/>
          </div>

          <div class="mb-3">
            <label class="form-label text-primary">Password</label>
            <input type="password" v-model="formData.password" class="form-control" placeholder="Enter a password"/>
          </div>

          <button type="button" @click="register" class="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import router from "@/router";

export default {
  name: "RegisterForm",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    register() {
      DataService.register(this.formData)
        .then((response) => {
          alert(response.data.message);
          router.push({ name: "login" }); // redirect to login page after success
        })
        .catch((e) => {
          console.log(e.response?.data || e);
          alert("Registration failed. Check your inputs.");
        });
    },
  },
};
</script>
