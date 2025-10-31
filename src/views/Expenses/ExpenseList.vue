<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-3">
      <div
        class="card-header d-flex justify-content-between align-items-center bg-primary text-white"
      >
        <h4 class="mb-0">Expense List</h4>
        <router-link
          :to="{ name: 'expense_create' }"
          class="btn btn-light btn-sm fw-semibold shadow-sm"
        >
          <i class="bi bi-plus-circle me-2"></i> Add Expense
        </router-link>
      </div>

      <div class="card-body">
        <!-- Search Filter -->
        <div class="row mb-3">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control shadow-sm"
              v-model="search"
              placeholder="Search by category or note..."
            />
          </div>
        </div>

        <!-- Expense Table -->
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredExpenses.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  No expenses found.
                </td>
              </tr>
              <tr
                v-for="(expense, index) in filteredExpenses"
                :key="expense.id"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ formatDate(expense.expense_date) }}</td>
                <td>{{ expense.category }}</td>
                <td>৳ {{ parseFloat(expense.amount).toFixed(2) }}</td>
                <td>{{ expense.note || "-" }}</td>
                <td>
                  <div class="btn-group">
                    <router-link
                      :to="{ name: 'expense_edit', params: { id: expense.id } }"
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </router-link>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteExpense(expense.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "ExpenseList",
  data() {
    return {
      expenses: [],
      search: "",
    };
  },
  computed: {
    filteredExpenses() {
      return this.expenses.filter((expense) => {
        const term = this.search.toLowerCase();
        return (
          expense.category.toLowerCase().includes(term) ||
          (expense.note && expense.note.toLowerCase().includes(term))
        );
      });
    },
  },
  methods: {
    fetchExpenses() {
      DataService.ExpenseList()
        .then((res) => {
          this.expenses = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteExpense(id) {
      if (!confirm("Are you sure you want to delete this expense?")) return;

      DataService.DeleteExpense(id)
        .then(() => {
          this.expenses = this.expenses.filter((e) => e.id !== id);
          alert("Expense deleted successfully!");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("en-GB");
    },
  },
  mounted() {
    this.fetchExpenses();
  },
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.table {
  border-radius: 0.8rem;
  overflow: hidden;
}
.btn {
  border-radius: 0.5rem;
}
</style>
