
<template>
  <aside class="left-side-bar">
    <!-- Brand Logo -->
    <div class="brand-logo">
      <a href="#">
        <img src="/backendassets/vendors/images/deskapp-logo-white.svg" alt="logo" class="light-logo" />
      </a>
    </div>

    <!-- Sidebar Menu -->
    <div class="menu-block customscroll">
      <div class="sidebar-menu">
        <ul id="accordion-menu">
          <!-- Dashboard -->
          <li>
            <a href="#" class="dropdown-toggle">
              <span class="micon dw dw-house-1"></span>
              <span class="mtext">Dashboard</span>
            </a>
          </li>

          <!-- User Management -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('userManagement')">
              <span class="micon dw dw-user1"></span>
              <span class="mtext">User Management</span>
            </a>
            <ul v-show="openMenus.userManagement" class="submenu">
              <li>Users</li>
              <li>Roles</li>
              <li>Sales Commission Agents</li>
            </ul>
          </li>

          <!-- Contacts -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('contacts')">
              <span class="micon dw dw-address-book1"></span>
              <span class="mtext">Contacts</span>
            </a>
            <ul v-show="openMenus.contacts" class="submenu">
              <li>Suppliers</li>
              <li>Customers</li>
              <li>Customer Groups</li>
              <li>Import Contacts</li>
            </ul>
          </li>

          <!-- Products Management -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('products')">
              <span class="micon dw dw-box"></span>
              <span class="mtext">Products Management</span>
            </a>
            <ul v-show="openMenus.products" class="submenu">
              <li>List Products</li>
              <li>Add Products</li>
              <li>Print Labels</li>
              <li>Variations</li>
              <li>Import Products</li>
              <li>Import Opening Stock</li>
              <li>Selling Price Group</li>
              <li>Units</li>
              <li>Categories</li>
              <li>Brands</li>
              <li>Warranties</li>
            </ul>
          </li>

          <!-- Purchases -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('purchases')">
              <span class="micon dw dw-cart1"></span>
              <span class="mtext">Purchases</span>
            </a>
            <ul v-show="openMenus.purchases" class="submenu">
              <li>List Purchase</li>
              <li>Add Purchase</li>
              <li>List Purchase Return</li>
            </ul>
          </li>

          <!-- Sales -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('sales')">
              <span class="micon dw dw-money"></span>
              <span class="mtext">Sales</span>
            </a>
            <ul v-show="openMenus.sales" class="submenu">
              <li>All Sales</li>
              <li>Add Sale</li>
              <li>List POS</li>
              <li>POS</li>
              <li>List Draft</li>
              <li>Add Draft</li>
              <li>Add Quotation</li>
              <li>List Quotation</li>
              <li>Sales Return</li>
              <li>Shipment</li>
              <li>Discount</li>
              <li>Import Sales</li>
            </ul>
          </li>

          <!-- Expenses -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('expenses')">
              <span class="micon dw dw-wallet1"></span>
              <span class="mtext">Expenses</span>
            </a>
            <ul v-show="openMenus.expenses" class="submenu">
              <li>List Expense</li>
              <li>Add Expense</li>
              <li>Expense Categories</li>
            </ul>
          </li>

          <!-- Reports -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('reports')">
              <span class="micon dw dw-analytics1"></span>
              <span class="mtext">Reports</span>
            </a>
            <ul v-show="openMenus.reports" class="submenu">
              <li>Profit/Loss Report</li>
              <li>Product Purchase Report</li>
              <li>Sales Representative Report</li>
              <li>Register Report</li>
              <li>Expense Report</li>
              <li>Sales Payment Report</li>
              <li>Purchase Payment Report</li>
              <li>Product Sale Report</li>
              <li>Item Report</li>
              <li>Purchase & Sale</li>
              <li>Trending Products</li>
              <li>Stock Adjustment Report</li>
              <li>Customer Group Report</li>
              <li>Supplier Report</li>
              <li>Customer Report</li>
              <li>Tax Report</li>
              <li>Activity Log</li>
            </ul>
          </li>

          <!-- Notifications -->
          <li>
            <a href="#" class="dropdown-toggle">Notifications</a>
          </li>

          <!-- Settings -->
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" @click.prevent="toggleMenu('settings')">
              <span class="micon dw dw-settings2"></span>
              <span class="mtext">Settings</span>
            </a>
            <ul v-show="openMenus.settings" class="submenu">
              <li>Business Setting</li>
              <li>Business Location</li>
              <li>Invoice</li>
              <li>Barcode</li>
              <li>Receipt Printer</li>
              <li>Tax Rate</li>
              <li>Package Subscription</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive } from 'vue'

const openMenus = reactive({
  userManagement: false,
  contacts: false,
  products: false,
  purchases: false,
  sales: false,
  expenses: false,
  reports: false,
  settings: false
})

const toggleMenu = (menu) => {
  openMenus[menu] = !openMenus[menu]
}
</script>

<style scoped>
.submenu {
  list-style: none;
  padding-left: 20px;
  display: block;
}

.dropdown-toggle {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mtext {
  margin-left: 10px;
  font-weight: 500;
}

.arrow {
  margin-left: auto;
}
</style>


<script setup>
</script>

<style scoped>
.left-side-bar {
  background: #0a0a4e;
  color: #fff;
  width: 300px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;

}
.brand-logo {
  text-align: center;
  padding: 20px 0;
}
</style>
