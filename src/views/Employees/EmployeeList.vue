<template>
  <div class="container mt-5">
    <h2>All Employees</h2>

    <router-link to="/employees/add" class="btn btn-primary mb-3">
      Add New Employee
    </router-link>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>#SL</th>
          <th>Photo</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Position</th>
          <th>Salary</th>
          <th>Joining Date</th>
          <th>Termination Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(employee, index) in employees" :key="employee.id">
          <td>{{ index + 1 }}</td>
          <td>
            <img
              v-if="employee.profile_photo_url"
              :src="employee.profile_photo_url"
              alt="Photo"
              class="profile-photo"
            />
            <span v-else>-</span>
          </td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.username || '-' }}</td>
          <td>{{ employee.email || '-' }}</td>
          <td>{{ employee.phone || '-' }}</td>
          <td>{{ employee.position || '-' }}</td>
          <td>{{ employee.salary || 0 }}</td>
          <td>{{ employee.joining_date || '-' }}</td>
          <td>{{ employee.termination_date || '-' }}</td>
          <td>
            <span
              :class="employee.status == 1 ? 'badge bg-success' : 'badge bg-secondary'"
            >
              {{ employee.status == 1 ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <router-link
              :to="`/employees/edit/${employee.id}`"
              class="btn btn-sm btn-primary me-2"
            >
              Edit
            </router-link>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteEmployee(employee.id)"
            >
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="employees.length === 0">
          <td colspan="12" class="text-center">No employees found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "EmployeeList",
  data() {
    return {
      employees: [],
    };
  },
  methods: {
    fetchEmployees() {
      DataService.EmployeeList()
        .then((res) => {
          this.employees = res.data.map(emp => ({
            ...emp,
            status: emp.status != null ? Number(emp.status) : 0,
            profile_photo_url: emp.profile_photo_url || null,
          }));
        })
        .catch(err => console.log(err));
    },
    deleteEmployee(id) {
      if (confirm("Are you sure you want to delete this employee?")) {
        DataService.DeleteEmployee(id)
          .then(() => {
            alert("Employee deleted successfully!");
            this.fetchEmployees();
          })
          .catch(err => console.log(err));
      }
    }
  },
  mounted() {
    this.fetchEmployees();
  }
};
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
}
.profile-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
