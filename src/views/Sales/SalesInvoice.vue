<template>
  <div class="invoice-page p-4" v-if="invoice.sale">
    <!-- Invoice Header -->
    <div class="invoice-header mb-4">
      <h2>Sales Invoice</h2>
      <p><strong>Invoice No:</strong> {{ invoice.sale.invoice_no }}</p>
      <p><strong>Customer:</strong> {{ invoice.sale.customer?.name || '-' }}</p>
      <p><strong>Date:</strong> {{ formatDate(invoice.sale.sale_date) }}</p>
      <p v-if="invoice.sale.note"><strong>Note:</strong> {{ invoice.sale.note }}</p>
    </div>

    <!-- Invoice Items Table -->
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in invoice.sale.items" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.product?.name || '-' }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatCurrency(item.unit_price) }}</td>
          <td>{{ formatCurrency(item.total_price) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Invoice Summary -->
    <div class="invoice-summary mt-3 text-end">
      <p><strong>Subtotal:</strong> {{ formatCurrency(invoice.sale.subtotal) }}</p>
      <p><strong>Discount:</strong> {{ formatCurrency(invoice.sale.discount) }}</p>
      <p><strong>Tax:</strong> {{ formatCurrency(invoice.sale.tax) }}</p>
      <h5><strong>Total:</strong> {{ formatCurrency(invoice.sale.total_price) }}</h5>
      <p><strong>Paid:</strong> {{ formatCurrency(invoice.sale.paid_amount) }}</p>
      <p><strong>Due:</strong> {{ formatCurrency(invoice.sale.due_amount) }}</p>
      <p><strong>Status:</strong> 
        <span :class="statusClass(invoice.sale.payment_status)">
          {{ invoice.sale.payment_status?.toUpperCase() }}
        </span>
      </p>
    </div>

    <!-- Print Button -->
    <button class="btn btn-primary mt-3 print_hide" @click="printInvoice">
      <i class="bi bi-printer me-1"></i> Print Invoice
    </button>
  </div>

  <!-- Loader / No Data -->
  <div v-else class="text-center mt-5">
    <p v-if="loading">Loading invoice...</p>
    <p v-else>No invoice data found.</p>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "SalesInvoice",
  data() {
    return {
      invoice: {
        sale: {
          items: [],
          customer: {},
        },
      },
      loading: false,
    };
  },
  methods: {
    fetchInvoice() {
      const id = this.$route.params.id;
      this.loading = true;
      DataService.GetSaleInvoice(id)
        .then((res) => {
          this.invoice = res.data; // res.data should be { sale: {...} }
        })
        .catch((err) => console.error("Invoice fetch error:", err))
        .finally(() => (this.loading = false));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value || 0);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      switch (status) {
        case "paid":
          return "badge bg-success";
        case "partial":
          return "badge bg-warning";
        case "due":
          return "badge bg-danger";
        default:
          return "badge bg-secondary";
      }
    },
    printInvoice() {
      const printContent = document.querySelector(".invoice-page").innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    },
  },
  mounted() {
    this.fetchInvoice();
  },
};
</script>

<style scoped>
.invoice-page {
  max-width: 800px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.invoice-header h2 {
  color: #007bff;
  margin-bottom: 10px;
}

.invoice-summary p,
.invoice-summary h5 {
  margin: 0;
}

.no-print {
  display: inline-block;
}

@media print {
  .no-print {
    display: none !important;
  }
  body * {
    visibility: hidden;
  }
  .invoice-page,
  .invoice-page * {
    visibility: visible;
  }
  .invoice-page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
