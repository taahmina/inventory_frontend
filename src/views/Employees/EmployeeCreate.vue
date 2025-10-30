<template>
  <div class="container mt-5">
    <div class="card shadow-sm">
      <div class="card-header bg-secondary text-white">
        <h3 class="mb-0">Add New Employee</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="addEmployee" enctype="multipart/form-data">
          <div class="row g-3">

            <!-- Name -->
            <div class="col-md-4">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="employee.name" required>
              <small class="text-danger">{{ errors.name ? errors.name[0] : '' }}</small>
            </div>

            <!-- Email -->
            <div class="col-md-4">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="employee.email" required>
              <small class="text-danger">{{ errors.email ? errors.email[0] : '' }}</small>
            </div>

            <!-- Phone -->
            <div class="col-md-4">
              <label class="form-label">Phone</label>
              <input type="text" class="form-control" v-model="employee.phone">
            </div>

            <!-- Username -->
            <div class="col-md-4">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" v-model="employee.username" required>
              <small class="text-danger">{{ errors.username ? errors.username[0] : '' }}</small>
            </div>

            <!-- Password -->
            <div class="col-md-4">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" v-model="employee.password" required>
              <small class="text-danger">{{ errors.password ? errors.password[0] : '' }}</small>
            </div>

            <!-- Position -->
            <div class="col-md-4">
              <label class="form-label">Position</label>
              <input type="text" class="form-control" v-model="employee.position">
            </div>

            <!-- Salary -->
            <div class="col-md-4">
              <label class="form-label">Salary</label>
              <input type="number" class="form-control" v-model.number="employee.salary">
            </div>

            <!-- Joining Date -->
            <div class="col-md-4">
              <label class="form-label">Joining Date</label>
              <input type="date" class="form-control" v-model="employee.joining_date">
            </div>

            <!-- Termination Date -->
            <div class="col-md-4">
              <label class="form-label">Termination Date</label>
              <input type="date" class="form-control" v-model="employee.termination_date">
            </div>

            <!-- Status -->
            <div class="col-md-4">
              <label class="form-label">Status</label>
              <select class="form-select" v-model.number="employee.status">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>

            <!-- Notes -->
            <div class="col-md-12">
              <label class="form-label">Notes</label>
              <textarea class="form-control" v-model="employee.notes" rows="2"></textarea>
            </div>

            <!-- Profile Photo -->
            <div class="col-md-4">
              <label class="form-label">Profile Photo</label>
              <input type="file" @change="handleImage" accept="image/*" class="form-control">
              <div v-if="employee.profile_photo_preview" class="mt-2">
                <img :src="employee.profile_photo_preview" alt="Profile" class="img-thumbnail" style="max-width: 100px;">
              </div>
            </div>

            <!-- Submit -->
            <div class="col-md-12">
              <button class="btn btn-success w-100 mt-3">Add Employee</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "EmployeeCreate",
  data() {
    return {
      employee: {
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        position: "",
        salary: 0,
        joining_date: new Date().toISOString().substr(0, 10),
        termination_date: "",
        status: 1,
        notes: "",
        profile_photo: null,
        profile_photo_preview: null
      },
      errors: {}
    };
  },
  methods: {
    handleImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.employee.profile_photo = file;
        this.employee.profile_photo_preview = URL.createObjectURL(file);
      } else {
        alert("Please select a valid image file.");
        this.employee.profile_photo = null;
        this.employee.profile_photo_preview = null;
        event.target.value = "";
      }
    },
    addEmployee() {
      const formData = new FormData();
      for (const key in this.employee) {
        if (key === "profile_photo_preview") continue;
        formData.append(key, this.employee[key]);
      }

      DataService.AddEmployee(formData)
        .then(() => {
          alert("Employee added successfully!");
          this.$router.push({ name: "employee_list" });
        })
        .catch(err => {
          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
          } else {
            console.log(err);
          }
        });
    }
  }
};
</script>

<style scoped>
.img-thumbnail {
  border-radius: 5px;
  border: 1px solid #ddd;
}
.card {
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
}
.text-danger {
  font-size: 0.85rem;
}
</style>
