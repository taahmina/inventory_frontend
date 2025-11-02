<template>
  <div class="employee-page">
    <!-- Header -->
    <div class="page-header d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 rounded">
      <h3 class="fw-bold text-white mb-0">
        <i class="bi bi-people-fill me-2"></i> Employee Management
      </h3>
      <router-link to="/employees/add" class="btn btn-gradient shadow-sm">
        <i class="bi bi-plus-circle me-1"></i> Add New Employee
      </router-link>
    </div>

    <!-- Filter Section -->
    <div class="card filter-card shadow-sm mb-4 p-4 border-0">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label fw-semibold text-dark">🔍 Search</label>
          <input
            type="text"
            class="form-control"
            v-model="filters.search"
            placeholder="Search by name, username, email, or phone..."
          />
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold text-dark">Status</label>
          <select class="form-select" v-model="filters.status">
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div class="col-md-2 d-flex">
          <button class="btn btn-outline-primary w-100 reset-btn" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="card shadow-lg border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-primary">
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
              <th class="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(employee, index) in paginatedEmployees" :key="employee.id">
              <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
              <td>
                <img
                  v-if="employee.profile_photo"
                  :src="employee.profile_photo"
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
              <td>{{ formatCurrency(employee.salary) }}</td>
              <td>{{ employee.joining_date || '-' }}</td>
              <td>{{ employee.termination_date || '-' }}</td>
              <td>
                <span :class="employee.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ employee.status == 1 ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <router-link
                    :to="`/employees/edit/${employee.id}`"
                    class="btn btn-sm btn-primary action-btn"
                    title="Edit Employee"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger action-btn"
                    @click="deleteEmployee(employee.id)"
                    title="Delete Employee"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredEmployees.length === 0">
              <td colspan="12" class="text-center py-4 text-muted">
                <i class="bi bi-info-circle me-1"></i> No matching employees found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center border-top">
        <small class="text-muted">
          Showing {{ startItem }}–{{ endItem }} of {{ filteredEmployees.length }} results
        </small>

        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">«</button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
              »
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "EmployeeList",
  data() {
    return {
      employees: [],
      filters: { search: "", status: "" },
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter((emp) => {
        const s = this.filters.search.toLowerCase();
        const searchMatch =
          emp.name.toLowerCase().includes(s) ||
          (emp.username?.toLowerCase().includes(s)) ||
          (emp.email?.toLowerCase().includes(s)) ||
          (emp.phone?.toLowerCase().includes(s));

        const statusMatch =
          this.filters.status === "" || emp.status == this.filters.status;

        return searchMatch && statusMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.perPage);
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredEmployees.slice(start, start + this.perPage);
    },
    startItem() {
      return this.filteredEmployees.length === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.startItem + this.perPage - 1, this.filteredEmployees.length);
    },
  },
  methods: {
    fetchEmployees() {
      DataService.EmployeeList()
        .then((res) => {
          this.employees = res.data.map(emp => ({
            ...emp,
            status: emp.status != null ? Number(emp.status) : 0,
            profile_photo: emp.profile_photo || null,
          }));
        })
        .catch((err) => console.error(err));
    },
    deleteEmployee(id) {
      if (confirm("Are you sure you want to delete this employee?")) {
        DataService.DeleteEmployee(id)
          .then(() => {
            alert("Employee deleted successfully!");
            this.fetchEmployees();
          })
          .catch((err) => console.error(err));
      }
    },
    resetFilters() {
      this.filters = { search: "", status: "" };
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value || 0);
    },
  },
  mounted() {
    this.fetchEmployees();
  },
};
</script>

<style scoped>
.employee-page {
  max-width: 1250px;
  margin: auto;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  padding: 20px;
  border-radius: 12px;
}

.page-header {
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: #fff;
}

.btn-gradient {
  background: linear-gradient(90deg, #007bff, #00bfff);
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.btn-gradient:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.filter-card {
  background-color: #f0f5ff;
  border-left: 5px solid #007bff;
  border-radius: 10px;
}

.form-label {
  color: #333;
}

.reset-btn {
  border-radius: 6px;
}

.pagination .page-link {
  color: #007bff;
  border-radius: 5px;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
}

.profile-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.action-btn {
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
