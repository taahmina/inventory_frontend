<template>
  <div class="container mt-5">
    <h2>Edit Employee</h2>
    <form @submit.prevent="updateEmployee" enctype="multipart/form-data">
      <div class="row">

        <!-- Name -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="employee.name" required />
        </div>

        <!-- Email -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="employee.email" />
        </div>

        <!-- Phone -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Phone</label>
          <input type="text" class="form-control" v-model="employee.phone" />
        </div>

        <!-- Username -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model="employee.username" />
        </div>

        <!-- Password -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Password <small>(Leave blank to keep current)</small></label>
          <input type="password" class="form-control" v-model="employee.password" />
        </div>

        <!-- Profile Photo -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Profile Photo</label>
          <input type="file" @change="handleImage" accept="image/*" class="form-control" />
          <div v-if="employee.profile_photo_url" class="mt-2">
            <img :src="employee.profile_photo_url" alt="Profile Photo" style="max-width: 100px; border-radius: 5px;" />
          </div>
        </div>

        <!-- Address -->
        <div class="col-md-12 mb-3">
          <label class="form-label">Address</label>
          <textarea class="form-control" v-model="employee.address"></textarea>
        </div>

        <!-- Position -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Position</label>
          <input type="text" class="form-control" v-model="employee.position" />
        </div>

        <!-- Salary -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Salary</label>
          <input type="number" class="form-control" v-model.number="employee.salary" min="0" />
        </div>

        <!-- Joining Date -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Joining Date</label>
          <input type="date" class="form-control" v-model="employee.joining_date" />
        </div>

        <!-- Termination Date -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Termination Date <small class="text-muted">(Optional)</small></label>
          <input type="date" class="form-control" v-model="employee.termination_date" />
        </div>

        <!-- Notes -->
        <div class="col-md-12 mb-3">
          <label class="form-label">Notes</label>
          <textarea class="form-control" v-model="employee.notes"></textarea>
        </div>

        <!-- Status -->
        <div class="col-md-4 mb-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model.number="employee.status">
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <!-- Submit -->
        <div class="col-md-12">
          <button class="btn btn-primary" type="submit">Update Employee</button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "EmployeeEdit",
  data() {
    return {
      employee: {
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        profile_photo_url: "",
        address: "",
        position: "",
        salary: null,
        joining_date: null,
        termination_date:"",
        notes: "",
        status: 1
      },
      imageFile: null
    };
  },
  methods: {
    fetchEmployee() {
      const id = this.$route.params.id;
      DataService.SingleEmployee(id)
        .then(res => {
          this.employee = {
            ...res.data,
            password: "",
            profile_photo_url: res.data.profile_photo || null
          };
        })
        .catch(err => console.log(err));
    },

    handleImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.imageFile = file;
        this.employee.profile_photo_url = URL.createObjectURL(file);
      } else {
        alert("Please select a valid image file.");
        this.imageFile = null;
        event.target.value = "";
      }
    },

    updateEmployee() {
      const formData = new FormData();
      for (const key in this.employee) {
        let value = this.employee[key];

        
        // Skip profile_photo if not selected
        if (key === "profile_photo") continue;

        formData.append(key, value);
      }

      if (this.imageFile) {
        formData.append("profile_photo", this.imageFile);
      }

      DataService.UpdateEmployee(this.$route.params.id, formData)
        .then(() => {
          alert("Employee updated successfully!");
          this.$router.push({ name: "employee_list" });
        })
        .catch(err => console.log(err.response?.data || err));
    }
  },
  mounted() {
    this.fetchEmployee();
  }
};
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 5px;
}
.text-muted {
  font-size: 0.85rem;
}
</style>
