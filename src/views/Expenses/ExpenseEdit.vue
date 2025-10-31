<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-3">
      <div
        class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
      >
        <h4 class="mb-0">Edit Expense</h4>
        <router-link :to="{ name: 'expense_list' }" class="btn btn-light btn-sm fw-semibold">
          <i class="bi bi-arrow-left me-2"></i> Back
        </router-link>
      </div>

      <div class="card-body">
        <form @submit.prevent="updateExpense">
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
              <input
                type="text"
                class="form-control shadow-sm"
                v-model="expense.category"
                placeholder="Enter category"
                required
              />
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
                placeholder="Enter note (optional)"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="col-md-12 text-end">
              <button type="submit" class="btn btn-primary px-4 fw-semibold">
                <i class="bi bi-save me-2"></i> Update Expense
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
  name: "ExpenseEdit",
  props: ["id"],
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
    fetchExpense() {
      DataService.GetExpense(this.id)
        .then((res) => {
          this.expense = res.data;
        })
        .catch((err) => {
          console.error("Failed to load expense:", err);
          alert("Error loading expense details!");
        });
    },
    updateExpense() {
      DataService.UpdateExpense(this.id, this.expense)
        .then(() => {
          alert("Expense updated successfully!");
          this.$router.push({ name: "expense_list" });
        })
        .catch((err) => {
          console.error("Update error:", err);
          alert("Failed to update expense!");
        });
    },
  },
  mounted() {
    this.fetchExpense();
  },
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.form-control {
  border-radius: 0.5rem;
}
.btn {
  border-radius: 0.5rem;
}
</style>
