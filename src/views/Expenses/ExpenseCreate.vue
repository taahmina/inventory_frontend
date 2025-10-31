<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-3">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Add New Expense</h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="addExpense">
          <div class="row">

            <!-- Expense Date -->
            <div class="col-md-4 mb-3">
              <label class="form-label fw-semibold">Expense Date</label>
              <input
                type="date"
                class="form-control shadow-sm"
                v-model="expense.expense_date"
                required
              />
            </div>

            <!-- Category -->
            <div class="col-md-4 mb-3">
              <label class="form-label fw-semibold">Category</label>
              <select
                class="form-select shadow-sm"
                v-model="expense.category"
                required
              >
                <option value="">Select Category</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Amount -->
            <div class="col-md-4 mb-3">
              <label class="form-label fw-semibold">Amount</label>
              <input
                type="number"
                step="0.01"
                class="form-control shadow-sm"
                v-model="expense.amount"
                required
              />
            </div>

            <!-- Note -->
            <div class="col-md-12 mb-3">
              <label class="form-label fw-semibold">Note</label>
              <textarea
                class="form-control shadow-sm"
                v-model="expense.note"
                rows="3"
                placeholder="Optional details about this expense..."
              ></textarea>
            </div>

            <!-- Submit -->
            <div class="col-md-12 text-end">
              <button type="submit" class="btn btn-success px-4 py-2 shadow-sm">
                <i class="bi bi-plus-circle me-2"></i> Add Expense
              </button>
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
  name: "ExpenseCreate",
  data() {
    return {
      expense: {
        expense_date: "",
        category: "",
        amount: "",
        note: "",
      },
    };
  },
  methods: {
    addExpense() {
      const formData = new FormData();
      for (const key in this.expense) {
        formData.append(key, this.expense[key]);
      }

      DataService.AddExpense(formData)
        .then(() => {
          alert("Expense added successfully!");
          this.$router.push({ name: "expense_list" });
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            console.error("Error:", err.response.data);
            alert(JSON.stringify(err.response.data));
          } else {
            console.error(err);
          }
        });
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.form-control,
.form-select {
  border-radius: 0.6rem;
}
.btn-success {
  border-radius: 0.6rem;
}
</style>
