<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-primary">Reports Dashboard</h2>

    <div class="row">
      <div class="col-md-3 mb-3">
        <router-link :to="{ name: 'report_sales' }" class="btn btn-outline-primary w-100">
          Sales Report
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link :to="{ name: 'report_expenses' }" class="btn btn-outline-success w-100">
          Expense Report
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link :to="{ name: 'report_profit_loss' }" class="btn btn-outline-warning w-100">
          Profit & Loss
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link :to="{ name: 'report_inventory' }" class="btn btn-outline-info w-100">
          Inventory Report
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportList",
};
</script>
