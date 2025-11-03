<template>
  <div class="invoice-page p-4">
    <div class="invoice-header mb-4">
      <h2>Purchase Invoice</h2>
      <p>Invoice No: {{ invoice.purchase.invoice_no }}</p>
      <p>Supplier: {{ invoice.purchase.supplier?.name }}</p>
      <p>Date: {{ formatDate(invoice.purchase.purchase_date) }}</p>
    </div>

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
        <tr v-for="(item, index) in invoice.purchase.items" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.product?.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatCurrency(item.unit_price) }}</td>
          <td>{{ formatCurrency(item.total_cost) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-summary mt-3 text-end">
      <p>Subtotal: {{ formatCurrency(invoice.purchase.subtotal) }}</p>
      <p>Discount: {{ formatCurrency(invoice.purchase.discount) }}</p>
      <p>Tax: {{ formatCurrency(invoice.purchase.tax) }}</p>
      <h5>Total: {{ formatCurrency(invoice.purchase.total_cost) }}</h5>
      <p>Paid: {{ formatCurrency(invoice.purchase.paid_amount) }}</p>
      <p>Due: {{ formatCurrency(invoice.purchase.due_amount) }}</p>
    </div>

    <button class="btn btn-primary mt-3 print_hide" @click="printInvoice">Print Invoice</button>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "PurchaseInvoice",
  data() {
    return {
      invoice: {
        purchase: {
          items: [],
          supplier: {},
        },
      },
    };
  },
  methods: {
    fetchInvoice() {
      const id = this.$route.params.id;
      DataService.GetPurchaseInvoice(id)
        .then((res) => (this.invoice = res.data))
        .catch((err) => console.error(err));
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        value || 0
      );
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
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
}

.invoice-header h2 {
  color: #007bff;
}

.invoice-summary p, .invoice-summary h5 {
  margin: 0;
}
</style>
